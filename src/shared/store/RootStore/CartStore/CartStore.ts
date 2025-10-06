import { API_ENDPOINTS } from '@config/api'
import { Meta } from '@shared/config/meta'
import { ProductAddCartType } from '@shared/types/ProductAddCartType'
import debounce from 'lodash.debounce'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import type RootStore from '../RootStore'

export type CartItem = {
  id: number
  product: {
    id: number
    documentId: string
    title: string
    price: number
    discountPercent: number
    description: string
    images: { id: number; url: string }[]
    productCategory?: { id: number; title: string }
    rating?: number
  }
  quantity: number
}

type PrivateFields =
  | '_items'
  | '_meta'
  | '_metaMini'
  | '_totalCount'
  | '_totalPrice'
  | '_totalDiscountPrice'
  | '_itemsIncrease'

export interface ICartStore {
  items: CartItem[]
  meta: Meta
  metaMini: Meta
  totalCount: number
  totalPrice: number
  totalDiscountPrice: number

  getCartProducts(): Promise<void>
  addToCart(productInfo: ProductAddCartType, quantity?: number): void
  updateCartQuantity(
    productId: number,
    delta: number,
    productInfo?: ProductAddCartType
  ): void
  decreaseCartQuantity(productId: number, amount?: number): void
  deleteFromCartLocal(productId: number): void
  deleteAllFromCart(): Promise<void>
  clearCart(): void
}

export default class CartStore implements ICartStore {
  private _rootStore: RootStore

  private _items: CartItem[] = []
  private _meta: Meta = Meta.initial
  private _metaMini: Meta = Meta.initial
  private _totalCount: number = 0
  private _totalPrice: number = 0
  private _totalDiscountPrice: number = 0

  // временная переменная для накопления дельт
  private _itemsIncrease: { productId: number; quantity: number }[] = []

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore

    makeObservable<this, PrivateFields>(this, {
      _items: observable,
      _meta: observable,
      _metaMini: observable,
      _totalCount: observable,
      _totalPrice: observable,
      _totalDiscountPrice: observable,
      _itemsIncrease: observable,

      items: computed,
      meta: computed,
      totalCount: computed,
      totalPrice: computed,
      totalDiscountPrice: computed,

      getCartProducts: action,
      addToCart: action,
      updateCartQuantity: action,
      decreaseCartQuantity: action,
      deleteFromCart: action,
      deleteAllFromCart: action,
      clearCart: action,
    })

    this.sendCartUpdatesDebounced = debounce(this.sendCartUpdates, 1000)
  }

  get items() {
    return this._items
  }

  get meta() {
    return this._meta
  }

  get metaMini() {
    return this._metaMini
  }

  get totalCount() {
    return this._totalCount
  }

  get totalPrice() {
    return this._totalPrice
  }

  get totalDiscountPrice() {
    return this._totalDiscountPrice
  }

  private updateTotals() {
    this._totalCount = this._items.reduce((acc, item) => acc + item.quantity, 0)

    this._totalPrice = Math.round(
      this._items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    )

    this._totalDiscountPrice = Math.round(
      this._items.reduce((acc, item) => {
        const discountedPrice =
          item.product.price * (1 - item.product.discountPercent / 100)
        return acc + discountedPrice * item.quantity
      }, 0)
    )
  }

  private sendCartUpdatesDebounced: () => void

  updateCartQuantity(
    productId: number,
    delta: number,
    productInfo?: ProductAddCartType
  ) {
    runInAction(() => {
      const item = this._items.find((i) => i.product.id === productId)

      if (item) {
        item.quantity += delta
      } else {
        this._items.push({
          product: {
            id: productId,
            documentId: productInfo?.documentId || '',
            title: productInfo?.title || 'Loading...',
            price: productInfo?.price || 0,
            discountPercent: productInfo?.discountPercent || 0,
            description: productInfo?.description || '',
            images: productInfo?.images || [],
          },
          quantity: delta,
          id: Date.now(),
        })
      }

      this.updateTotals()

      const existingDelta = this._itemsIncrease.find(
        (i) => i.productId === productId
      )
      if (existingDelta) {
        existingDelta.quantity += delta
      } else {
        this._itemsIncrease.push({ productId, quantity: delta })
      }
    })

    this.sendCartUpdatesDebounced()
  }

  /** отправка накопленных дельт на сервер */
  private async sendCartUpdates() {
    if (this._itemsIncrease.length === 0) return

    try {
      const token = this._rootStore.auth.token

      await Promise.all(
        this._itemsIncrease.map((item) =>
          fetch(process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.CART_ADD, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product: item.productId,
              quantity: item.quantity,
            }),
          })
        )
      )

      runInAction(() => (this._itemsIncrease = []))
    } catch (e) {
      console.error(e)
      runInAction(() => (this._meta = Meta.error))
    }
  }

  async getCartProducts() {
    this._meta = Meta.loading
    try {
      const token = this._rootStore.auth.token

      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.CART,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) throw new Error('Failed to fetch cart')
      const data: CartItem[] = await res.json()

      console.log(data)

      runInAction(() => {
        this._items = data
        this.updateTotals()
        this._meta = Meta.success
      })
    } catch (e) {
      console.error(e)
      runInAction(() => (this._meta = Meta.error))
    }
  }

  async deleteFromCart(productId: number, quantity: number) {
    this._metaMini = Meta.loading
    try {
      const token = this._rootStore.auth.token

      await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.CART_REMOVE,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: productId,
            quantity: quantity,
          }),
        }
      )

      runInAction(() => {
        this._metaMini = Meta.success
      })
    } catch (e) {
      console.error('Ошибка при удалении товара из корзины:', e)
      runInAction(() => {
        this._metaMini = Meta.error
      })
    }
  }

  async deleteAllFromCart() {
    this._metaMini = Meta.loading
    try {
      const token = this._rootStore.auth.token

      await Promise.all(
        this._items.map((i) =>
          fetch(process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.CART_REMOVE, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product: i.product.id,
              quantity: i.quantity,
            }),
          })
        )
      )

      runInAction(() => {
        this._items = []
        this._itemsIncrease = []
        this.updateTotals()
        this._metaMini = Meta.success
      })
    } catch (e) {
      console.error('Ошибка при полном очищении корзины:', e)
      runInAction(() => {
        this._metaMini = Meta.error
      })
    }
  }

  async addToCart(productInfo: ProductAddCartType, quantity: number = 1) {
    this._meta = Meta.loading
    try {
      const token = this._rootStore.auth.token

      await fetch(process.env.NEXT_PUBLIC_BASE_URL + API_ENDPOINTS.CART_ADD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productInfo.id,
          quantity: 1,
        }),
      })
      await this.getCartProducts()

      runInAction(() => {
        this._metaMini = Meta.success
      })
    } catch (e) {
      console.error('Ошибка при добавлении товара в корзину:', e)
      this._meta = Meta.error
    }
  }

  decreaseCartQuantity(productId: number, amount: number = 1) {
    this.updateCartQuantity(productId, -amount)
  }

  deleteFromCartLocal(productId: number) {
    const item = this._items.find((i) => i.product.id === productId)
    if (!item) return

    runInAction(() => {
      this._items = this._items.filter((i) => i.product.id !== productId)
      this._itemsIncrease = this._itemsIncrease.filter(
        (i) => i.productId !== productId
      )
      this.updateTotals()
    })
    this.deleteFromCart(productId, item.quantity)
  }

  clearCart() {
    this._items = []
    this._itemsIncrease = []
    this._totalCount = 0
    this._totalPrice = 0
    this._meta = Meta.initial
  }
}

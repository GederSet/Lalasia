import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import qs from 'qs'
import { ProductType } from '../../types/ProductType'

type PrivateFields =
  | '_currentProduct'
  | '_relatedProducts'
  | '_productMeta'
  | '_relatedMeta'

export interface IProductPageStore {
  currentProduct: ProductType | null
  relatedProducts: ProductType[]
  productMeta: Meta
  relatedMeta: Meta

  getProductById(id: string): Promise<void>
  getRelatedProducts(limit?: number): Promise<void>
  fetchProductAndRelated(id: string, relatedLimit?: number): Promise<void>
  reset(): void
  destroy(): void
}

export default class ProductPageStore implements IProductPageStore {
  private _currentProduct: ProductType | null = null
  private _relatedProducts: ProductType[] = []
  private _productMeta: Meta = Meta.initial
  private _relatedMeta: Meta = Meta.initial

  constructor(product: ProductType, relatedProducts: ProductType[]) {
    this._currentProduct = product
    this._relatedProducts = relatedProducts

    makeObservable<this, PrivateFields>(this, {
      _currentProduct: observable,
      _relatedProducts: observable,
      _productMeta: observable,
      _relatedMeta: observable,

      currentProduct: computed,
      relatedProducts: computed,
      productMeta: computed,
      relatedMeta: computed,

      getProductById: action,
      getRelatedProducts: action,
      fetchProductAndRelated: action,
      reset: action,
    })
  }

  get currentProduct() {
    return this._currentProduct
  }

  get relatedProducts() {
    return this._relatedProducts
  }

  get productMeta() {
    return this._productMeta
  }

  get relatedMeta() {
    return this._relatedMeta
  }

  static async getInitProductById(id: string) {
    try {
      const query = qs.stringify(
        { populate: ['images', 'productCategory'] },
        { encodeValuesOnly: true }
      )
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}?${query}`,
        { cache: 'no-store' }
      )
      if (!res.ok) throw new Error('Failed to fetch product')

      const { data } = await res.json()
      return data
    } catch (e) {
      console.error('Error when loading the product', e)
    }
  }

  async getProductById(id: string) {
    this._productMeta = Meta.loading
    this._currentProduct = null

    try {
      const query = qs.stringify(
        { populate: ['images', 'productCategory'] },
        { encodeValuesOnly: true }
      )
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}?${query}`,
        { next: { revalidate: 300 } }
      )
      if (!res.ok) throw new Error('Failed to fetch product')

      const { data } = await res.json()
      runInAction(() => {
        this._currentProduct = data
        this._productMeta = Meta.success
      })
    } catch (e) {
      console.error('Error when loading the product', e)
      runInAction(() => (this._productMeta = Meta.error))
    }
  }

  static async getInitRelatedProducts(limit = 3) {
    try {
      const query = qs.stringify(
        {
          populate: ['images', 'productCategory'],
          pagination: { pageSize: 50 },
        },
        { encodeValuesOnly: true }
      )
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${query}`,
        { next: { revalidate: 300 } }
      )
      if (!res.ok) throw new Error('Failed to fetch related products')

      const { data } = await res.json()
      const allProducts: ProductType[] = data || []

      const relatedProducts = [...allProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit)

      return relatedProducts
    } catch (e) {
      console.error('Error loading Related Items', e)
    }
  }

  async getRelatedProducts(limit = 3) {
    this._relatedMeta = Meta.loading
    this._relatedProducts = []

    try {
      const query = qs.stringify(
        {
          populate: ['images', 'productCategory'],
          pagination: { pageSize: 50 },
        },
        { encodeValuesOnly: true }
      )
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${query}`,
        { cache: 'no-store' }
      )
      if (!res.ok) throw new Error('Failed to fetch related products')

      const { data } = await res.json()
      const allProducts: ProductType[] = data || []
      runInAction(() => {
        this._relatedProducts = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, limit)
        this._relatedMeta = Meta.success
      })
    } catch (e) {
      console.error('Error loading Related Items', e)
      runInAction(() => (this._relatedMeta = Meta.error))
    }
  }

  async fetchProductAndRelated(id: string, relatedLimit = 3) {
    this._productMeta = Meta.loading
    this._relatedMeta = Meta.loading

    try {
      await Promise.all([
        this.getProductById(id),
        this.getRelatedProducts(relatedLimit),
      ])
    } catch (e) {
      console.error('Error fetching product and related items', e)
    }
  }

  reset() {
    this._currentProduct = null
    this._relatedProducts = []
    this._productMeta = Meta.initial
    this._relatedMeta = Meta.initial
  }

  destroy() {
    this.reset()
  }
}

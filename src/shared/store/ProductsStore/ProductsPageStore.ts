import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { Method } from '@shared/config/method'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import qs from 'qs'
import { ProductType } from '../../types/ProductType'
import QueryParamsStore from '../RootStore/QueryParamsStore'

type PrivateFields = '_products' | '_meta' | '_productsCount'

export type ProductsPageStoreInitData = {
  products: ProductType[]
  total: number
  pagination: { page: number; pageSize: number; pageCount: number }
  search?: string
  categories?: { key: string; value: string }[]
}

export interface IProductsPageStore {
  products: ProductType[]
  productsCount: number
  meta: Meta

  setProducts(products: ProductType[]): void
  setProductsCount(productsCount: number): void
  setMeta(meta: Meta): void
  loadProducts(): Promise<void>
  setFindProducts(): void
  destroy(): void
}

export default class ProductsPageStore implements IProductsPageStore {
  private query: QueryParamsStore
  private _products: ProductType[] = []
  private _meta: Meta = Meta.initial
  private _productsCount: number = 0

  private _qpCategory?: () => void
  private _qpPagination?: () => void

  constructor(query: QueryParamsStore) {
    this.query = query

    makeObservable<this, PrivateFields>(this, {
      _products: observable,
      _meta: observable,
      _productsCount: observable,

      products: computed,
      meta: computed,

      setProducts: action,
      setProductsCount: action,
      setMeta: action,
      loadProducts: action,
      setFindProducts: action,
    })

    this._qpCategory = reaction(
      () => this.query.getParam('categories'),
      () => {
        this.query.setPage(1)
        this.loadProducts()
      }
    )

    this._qpPagination = reaction(
      () => this.query.currentPage,
      () => {
        this.loadProducts()
      }
    )
  }

  get products() {
    return this._products
  }

  get productsCount() {
    return this._productsCount
  }

  get meta() {
    return this._meta
  }

  setProducts(products: ProductType[]) {
    this._products = products
  }

  setProductsCount(productsCount: number) {
    this._productsCount = productsCount
  }

  setMeta(meta: Meta) {
    this._meta = meta
  }

  setFindProducts() {
    this.query.setPage(1)
    this.loadProducts()
  }

  async loadProducts() {
    this.setMeta(Meta.loading)

    try {
      const search = this.query.getParam('search')
      const categories = this.query.getParam('categories') as
        | { key: string }[]
        | undefined

      const pagination = {
        page: this.query.currentPage,
        pageSize: this.query.pageSize,
      }

      const filters: any = {
        ...(categories?.length && {
          productCategory: {
            documentId: { $in: categories.map((c) => c.key) },
          },
        }),
        ...(search && { title: { $containsi: search } }),
      }

      const queryStr = qs.stringify(
        { populate: ['images', 'productCategory'], filters, pagination },
        { encodeValuesOnly: true }
      )

      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          API_ENDPOINTS.PRODUCTS +
          '?' +
          queryStr,
        { method: Method.GET, cache: 'no-store' }
      )

      if (!response.ok) throw new Error()

      const data = await response.json()

      this.setProducts(data.data)
      this.setProductsCount(data.meta.pagination.total)
      this.setMeta(Meta.success)

      const { page, pageCount, pageSize } = data.meta.pagination
      this.query.setPagination({ page, pageCount, pageSize })
    } catch {
      this.setMeta(Meta.error)
    }
  }

  // использовал для серверного компонента, но отказался
  // static async getInitData(query: {
  //   getParam: (key: string) => unknown
  //   currentPage: number
  //   pageSize: number
  // }): Promise<{
  //   isError: boolean
  //   data?: {
  //     products: ProductType[]
  //     total: number
  //     pagination: { page: number; pageSize: number; pageCount: number }
  //     search?: string
  //     categories?: { key: string; value: string }[]
  //   }
  // }> {
  //   try {
  //     const search = query.getParam('search') as string | undefined
  //     const categories = query.getParam('categories') as
  //       | { key: string; value: string }[]
  //       | undefined

  //     const pagination = {
  //       page: query.currentPage,
  //       pageSize: query.pageSize,
  //     }

  //     const filters: Record<string, any> = {
  //       ...(categories?.length && {
  //         productCategory: {
  //           documentId: { $in: categories.map((c) => c.key) },
  //         },
  //       }),
  //       ...(search ? { title: { $containsi: search } } : {}),
  //     }

  //     const queryStr = qs.stringify(
  //       { populate: ['images', 'productCategory'], filters, pagination },
  //       { encodeValuesOnly: true }
  //     )

  //     const response = await fetch(
  //       process.env.NEXT_PUBLIC_BASE_URL +
  //         API_ENDPOINTS.PRODUCTS +
  //         '?' +
  //         queryStr,
  //       { method: Method.GET }
  //     )

  //     if (!response.ok) return { isError: true }

  //     const data = await response.json()
  //     const { page, pageCount, pageSize, total } = data.meta.pagination

  //     return {
  //       isError: false,
  //       data: {
  //         products: data.data,
  //         total,
  //         pagination: { page, pageSize, pageCount },
  //         search,
  //         categories,
  //       },
  //     }
  //   } catch {
  //     return { isError: true }
  //   }
  // }

  // static fromJson(
  //   initData: {
  //     products: ProductType[]
  //     total: number
  //     pagination: { page: number; pageSize: number; pageCount: number }
  //     search?: string
  //     categories?: { key: string; value: string }[]
  //   },
  //   query: QueryParamsStore
  // ) {
  //   const store = new ProductsPageStore(query)

  //   store.setProducts(initData.products)
  //   store.setProductsCount(initData.total)
  //   store.setMeta(Meta.success)

  //   query.setInitialParams({
  //     pagination: initData.pagination,
  //     search: initData.search,
  //     categories: initData.categories,
  //   })

  //   return store
  // }

  destroy() {
    this._products = []
    this._meta = Meta.initial

    this._qpCategory?.()
    this._qpPagination?.()
  }
}

import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { Method } from '@shared/config/method'
import { Option } from '@shared/types/OptionType'
import { PaginationApi } from '@shared/types/PaginationApiType'
import { QueryParamsTypes } from '@shared/types/QueryParamsTypes'
import { TotalProductsApi } from '@shared/types/TotalProductsApiType'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import qs from 'qs'
import { ProductType } from '../../types/ProductType'
import QueryParamsStore from '../RootStore/QueryParamsStore'

type PrivateFields = '_products' | '_meta' | '_productsCount'

export type ProductsPageStoreInitData = {
  products: ProductType[]
  total: number
  pagination: PaginationApi
  search?: string
  categories?: Option[]
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

  constructor(
    products: ProductType[],
    productsCount: number,
    query: QueryParamsStore
  ) {
    this.query = query
    this.setProducts(products)
    this.setProductsCount(productsCount)

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

  static async getInitProducts(
    query: QueryParamsTypes
  ): Promise<TotalProductsApi | undefined> {
    try {
      const search = query.search
      const categories = query.categories as { key: string }[] | undefined

      const pagination = {
        page: query.pagination.page,
        pageSize: query.pagination.pageSize,
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
        {
          method: Method.GET,
          cache: 'no-store',
        }
      )

      if (!response.ok) throw new Error()

      const data = await response.json()
      return data
    } catch (err) {
      console.error(err)
    }
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

  destroy() {
    this._products = []
    this._meta = Meta.initial

    this._qpCategory?.()
    this._qpPagination?.()
  }
}

import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { Method } from '@shared/config/method'
import { CategoryTypeApi } from '@shared/types/CategoryTypeApi'
import { Option } from '@shared/types/OptionType'
import { PaginationApi } from '@shared/types/PaginationApiType'
import { ProductType } from '@shared/types/ProductType'
import { QueryParamsTypes } from '@shared/types/QueryParamsTypes'
import { SearchParams } from '@shared/types/SearchParamsType'
import { normalizeSearchParams } from '@shared/utils/normalizeSearchParams'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import qs from 'qs'

type PrivateFields =
  | '_params'
  | '_categories'
  | '_categoryValue'
  | '_categoryLoading'
  | '_currentPage'
  | '_pageCount'
  | '_pageSize'
  | '_priceRange'
  | '_priceRangeGlobal'
  | '_discountRange'
  | '_discountRangeGlobal'
  | '_ratingRange'
  | '_ratingRangeGlobal'

export interface IQueryParamsStore {
  params: Record<string, any>
  categories: Option[]
  categoryValue: Option[]
  currentPage: number
  pageCount: number
  pageSize: number
  priceRange: { min: number; max: number }
  priceRangeGlobal: { min: number; max: number }
  discountRange: { min: number; max: number }
  discountRangeGlobal: { min: number; max: number }
  ratingRange: { min: number; max: number }
  ratingRangeGlobal: { min: number; max: number }
  isInStock: boolean

  setPriceRangeGlobalPrivate(products: ProductType[]): void
  getParam(
    key: string
  ): string | qs.ParsedQs | (string | qs.ParsedQs)[] | undefined
  setSearch(value: string): void
  setCategory(categories: Option[]): void
  setPriceRange(min: number, max: number): void
  setDiscountRange(min: number, max: number): void
  setRatingRange(min: number, max: number): void
  setInStock(value: boolean): void
  setPagination(pagination?: PaginationApi): void
  setPage(page: number): void
  getCategories(): Promise<void>
  reset(): void
  clear(): void
}

export default class QueryParamsStore implements IQueryParamsStore {
  private _params: Record<string, any> = {}
  private _categories: Option[] = []
  private _categoryValue: Option[] = []
  private _categoryLoading: Meta = Meta.initial
  private _currentPage = 1
  private _pageCount = 1
  private _pageSize = 10
  private _priceRange: { min: number; max: number } = { min: 10, max: 97 }
  private _priceRangeGlobal: { min: number; max: number } = { min: 10, max: 97 }
  private _discountRange: { min: number; max: number } = { min: 0, max: 100 }
  private _discountRangeGlobal: { min: number; max: number } = {
    min: 0,
    max: 100,
  }
  private _ratingRange: { min: number; max: number } = { min: 0, max: 5 }
  private _ratingRangeGlobal: { min: number; max: number } = { min: 0, max: 5 }
  private _isInStock: boolean = false

  constructor() {
    makeObservable<this, PrivateFields>(this, {
      _params: observable,
      _categories: observable,
      _categoryValue: observable,
      _categoryLoading: observable,
      _currentPage: observable,
      _pageCount: observable,
      _pageSize: observable,
      _priceRange: observable,
      _priceRangeGlobal: observable,
      _discountRange: observable,
      _discountRangeGlobal: observable,
      _ratingRange: observable,
      _ratingRangeGlobal: observable,

      params: computed,
      categories: computed,
      categoryValue: computed,
      currentPage: computed,
      pageCount: computed,
      pageSize: computed,
      priceRange: computed,
      priceRangeGlobal: computed,
      discountRange: computed,
      discountRangeGlobal: computed,
      ratingRange: computed,
      ratingRangeGlobal: computed,
      isInStock: computed,

      setPriceRangeGlobalPrivate: action,
      setSearch: action,
      setCategory: action,
      setPriceRange: action,
      setDiscountRange: action,
      setPagination: action,
      setPage: action,
      getCategories: action,
      reset: action,
      clear: action,
    })
  }

  get params() {
    return this._params
  }

  get categories() {
    return this._categories
  }

  get categoryValue() {
    return this._categoryValue
  }

  get currentPage() {
    return this._currentPage
  }

  get pageCount() {
    return this._pageCount
  }

  get pageSize() {
    return this._pageSize
  }

  get priceRange() {
    return this._priceRange
  }

  get priceRangeGlobal() {
    return this._priceRangeGlobal
  }

  get discountRange() {
    return this._discountRange
  }

  get discountRangeGlobal() {
    return this._discountRangeGlobal
  }

  get ratingRange() {
    return this._ratingRange
  }

  get ratingRangeGlobal() {
    return this._ratingRangeGlobal
  }

  get isInStock() {
    return this._isInStock
  }

  getParam(
    key: string
  ): string | qs.ParsedQs | (string | qs.ParsedQs)[] | undefined {
    return this._params[key]
  }

  static getNormalizeQueryParams(searchParams: SearchParams): QueryParamsTypes {
    const normalized = normalizeSearchParams(searchParams)
    const queryString = new URLSearchParams(normalized).toString()
    const parsed = qs.parse(queryString)

    return {
      pagination: {
        page: Number((parsed.pagination as any)?.page) || 1,
        pageSize: Number((parsed.pagination as any)?.pageSize) || 10,
        pageCount: Number((parsed.pagination as any)?.pageCount) || 0,
      },
      search: parsed.search as string | undefined,
      categories: Array.isArray(parsed.categories)
        ? (parsed.categories as any[]).map((c) => ({
            key: String(c.key),
            value: String(c.value),
          }))
        : undefined,
      priceRange: parsed.priceRange
        ? {
            min: Number.isNaN(Number((parsed.priceRange as any)?.min))
              ? 0
              : Number((parsed.priceRange as any)?.min),
            max: Number.isNaN(Number((parsed.priceRange as any)?.max))
              ? 1000
              : Number((parsed.priceRange as any)?.max),
          }
        : undefined,
      discountRange: parsed.discountRange
        ? {
            min: Number.isNaN(Number((parsed.discountRange as any)?.min))
              ? 0
              : Number((parsed.discountRange as any)?.min),
            max: Number.isNaN(Number((parsed.discountRange as any)?.max))
              ? 100
              : Number((parsed.discountRange as any)?.max),
          }
        : undefined,
      ratingRange: parsed.ratingRange
        ? {
            min: Number.isNaN(Number((parsed.ratingRange as any)?.min))
              ? 0
              : Number((parsed.ratingRange as any)?.min),
            max: Number.isNaN(Number((parsed.ratingRange as any)?.max))
              ? 5
              : Number((parsed.ratingRange as any)?.max),
          }
        : undefined,
      isInStock:
        typeof parsed.isInStock === 'string'
          ? (parsed.isInStock as string) === 'true'
          : undefined,
    }
  }

  static async getInitCategories(): Promise<Option[] | undefined> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.CATEGORIES}`,
        {
          method: Method.GET,
          next: { revalidate: 3600 },
        }
      )
      if (!response.ok) throw new Error('Failed to load categories')

      const data = await response.json()

      const categories = data.data.map((cat: CategoryTypeApi) => ({
        key: cat.documentId,
        value: cat.title,
      }))

      return categories
    } catch (err) {
      console.error(err)
      return undefined
    }
  }

  async getCategories() {
    this._categoryLoading = Meta.loading
    this._categories = []

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.CATEGORIES}`,
        {
          method: Method.GET,
          next: { revalidate: 300 },
        }
      )
      if (!response.ok) throw new Error('Failed to load categories')
      const data = await response.json()

      runInAction(() => {
        this._categories = data.data.map((cat: CategoryTypeApi) => ({
          key: cat.documentId,
          value: cat.title,
        }))
        this._categoryLoading = Meta.success
      })
    } catch {
      runInAction(() => {
        this._categoryLoading = Meta.error
      })
    }
  }

  setInitialParams(params: {
    search?: string
    categories?: Option[]
    pagination?: PaginationApi
    priceRange?: { min: number; max: number }
    discountRange?: { min: number; max: number }
    ratingRange?: { min: number; max: number }
    isInStock?: boolean
  }) {
    if (params?.search !== undefined) {
      this._params.search = params.search
    }
    // else {
    //   this._params.search = ''
    // }

    if (params?.categories !== undefined) {
      this._categoryValue = params.categories
      this._params.categories = params.categories
    }
    // else {
    //   this._categoryValue = []
    //   this._params.categories = []
    // }

    if (params?.pagination !== undefined) {
      this._currentPage = params.pagination.page
      this._pageCount = params.pagination.pageCount
      this._params.pagination = {
        page: String(params.pagination.page),
        pageSize: String(params.pagination.pageSize),
      }
    }

    if (params?.priceRange !== undefined) {
      this._priceRange = params.priceRange
      this._params.priceRange = params.priceRange
    }

    if (params?.discountRange !== undefined) {
      this._discountRange = params.discountRange
      this._params.discountRange = params.discountRange
    }

    if (params?.ratingRange !== undefined) {
      this._ratingRange = params.ratingRange
      this._params.ratingRange = params.ratingRange
    }

    if (params?.isInStock !== undefined) {
      this._isInStock = params.isInStock
      this._params.isInStock = String(params.isInStock)
    }
  }

  setSearch(value: string) {
    this._params.search = value
    this.updateUrl()
  }

  setCategoryPrivate(categories: Option[]) {
    this._categories = categories
  }

  setPriceRangeGlobalPrivate(products: ProductType[]) {
    const prices = products
      .map((product) => product.price)
      .filter((price) => price != null && price > 0)

    this._priceRangeGlobal = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }

  setCategory(categories: Option[]) {
    this._categoryValue = categories
    this._params.categories = categories
    this.updateUrl()
  }

  setPriceRange(min: number, max: number) {
    this._params.priceRange = { min, max }
    this.updateUrl()
  }

  setDiscountRange(min: number, max: number) {
    this._params.discountRange = { min, max }
    this.updateUrl()
  }

  setRatingRange(min: number, max: number) {
    this._params.ratingRange = { min, max }
    this.updateUrl()
  }

  setInStock(value: boolean) {
    this._isInStock = value
    this._params.isInStock = String(value)
    this.updateUrl()
  }

  setPagination(pagination?: PaginationApi) {
    if (!pagination) {
      this._currentPage = 1
      this._pageCount = 0
      delete this._params.pagination
    } else {
      this._currentPage = pagination.page
      this._pageCount = pagination.pageCount
      this._params.pagination = {
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
      }
    }
    this.updateUrl()
  }

  setPage(page: number) {
    this._currentPage = page
    if (!this._params.pagination) this._params.pagination = {}
    this._params.pagination.page = String(page)
    this.updateUrl()
  }

  reset() {
    runInAction(() => {
      this.setSearch('')
      this.setCategory([])
      this.setPriceRange(this.priceRangeGlobal.min, this.priceRangeGlobal.max)
      this.setDiscountRange(
        this.discountRangeGlobal.min,
        this.discountRangeGlobal.max
      )
      this.setRatingRange(
        this._ratingRangeGlobal.min,
        this._ratingRangeGlobal.max
      )
      this.setPagination()
      this.setInStock(false)
    })
  }

  clear() {
    this._params = {}
    this._categoryValue = []
    this._currentPage = 1
    this._pageCount = 1
    this.updateUrl()
  }

  updateUrl() {
    const query = qs.stringify(this._params, { encodeValuesOnly: true })
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`
      window.history.replaceState(null, '', newUrl)
    }
  }
}

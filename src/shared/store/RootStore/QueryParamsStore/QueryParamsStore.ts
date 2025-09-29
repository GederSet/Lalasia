import { API_ENDPOINTS } from '@shared/config/api'
import { Meta } from '@shared/config/meta'
import { Method } from '@shared/config/method'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import qs from 'qs'

export type Option = { key: string; value: string }
type CategoryTypeApi = { documentId: string; title: string }

type PaginationApi = {
  page: number
  pageCount: number
  pageSize: number
}

type PrivateFields =
  | '_params'
  | '_categories'
  | '_categoryValue'
  | '_categoryLoading'
  | '_currentPage'
  | '_pageCount'
  | '_pageSize'

export interface IQueryParamsStore {
  params: Record<string, any>
  categories: Option[]
  categoryValue: Option[]
  currentPage: number
  pageCount: number
  pageSize: number

  getParam(
    key: string
  ): string | qs.ParsedQs | (string | qs.ParsedQs)[] | undefined
  setSearch(value: string): void
  setCategory(categories: Option[]): void
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

  constructor() {
    makeObservable<this, PrivateFields>(this, {
      _params: observable,
      _categories: observable,
      _categoryValue: observable,
      _categoryLoading: observable,
      _currentPage: observable,
      _pageCount: observable,
      _pageSize: observable,

      params: computed,
      categories: computed,
      categoryValue: computed,
      currentPage: computed,
      pageCount: computed,
      pageSize: computed,

      setSearch: action,
      setCategory: action,
      setPagination: action,
      setPage: action,
      getCategories: action,
      reset: action,
      clear: action,
    })
  }

  // computed getters
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

  getParam(
    key: string
  ): string | qs.ParsedQs | (string | qs.ParsedQs)[] | undefined {
    return this._params[key]
  }

  // actions
  async getCategories() {
    this._categoryLoading = Meta.loading
    this._categories = []

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.CATEGORIES}`,
        {
          method: Method.GET,
          cache: 'no-store',
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

  setSearch(value: string) {
    this._params.search = value
    this.updateUrl()
  }

  setCategory(categories: Option[]) {
    this._categoryValue = categories
    this._params.categories = categories
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

  setInitialParams(params: {
    search?: string
    categories?: Option[]
    pagination?: PaginationApi
  }) {
    if (params.search !== undefined) {
      this._params.search = params.search
    }

    if (params.categories !== undefined) {
      this._categoryValue = params.categories
      this._params.categories = params.categories
    }

    // pagination
    if (params.pagination !== undefined) {
      this._currentPage = params.pagination.page
      this._pageCount = params.pagination.pageCount
      this._params.pagination = {
        page: String(params.pagination.page),
        pageSize: String(params.pagination.pageSize),
      }
    }
  }

  reset() {
    runInAction(() => {
      this.setSearch('')
      this.setCategory([])
      this.setPagination()
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

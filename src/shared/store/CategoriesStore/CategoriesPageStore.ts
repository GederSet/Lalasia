import { API_ENDPOINTS } from '@shared/config/api'
import { Method } from '@shared/config/method'
import { CategoryInfoType } from '@shared/types/CategoryInfoType'
import { CategoryTypeApi } from '@shared/types/CategoryTypeApi'
import { ProductType } from '@shared/types/ProductType'
import { makeObservable, observable } from 'mobx'
import qs from 'qs'

type PrivateFields = '_categoryItems'

export default class CategoriesPageStore {
  private _categoryItems: CategoryInfoType[] = []

  constructor(categoryItems: CategoryInfoType[]) {
    this._categoryItems = categoryItems

    makeObservable<this, PrivateFields>(this, {
      _categoryItems: observable,
    })
  }

  get categoryItems() {
    return this._categoryItems
  }

  static async getInitCategories(): Promise<CategoryTypeApi[] | undefined> {
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

      const categories = data.data.map((cat: CategoryTypeApi) => ({
        documentId: cat.documentId,
        title: cat.title,
      }))

      return categories
    } catch (err) {
      console.error(err)
    }
  }

  static async getInitCategoryItems(
    categories: CategoryTypeApi[]
  ): Promise<CategoryInfoType[] | undefined> {
    try {
      const categoryItems = await Promise.all(
        categories.map(async (category: CategoryTypeApi) => {
          try {
            const filters = {
              productCategory: {
                documentId: { $eq: category.documentId },
              },
            }

            const pagination = {
              page: 1,
              pageSize: 1,
            }

            const queryStr = qs.stringify(
              { populate: ['images', 'productCategory'], filters, pagination },
              { encodeValuesOnly: true }
            )

            const productResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${queryStr}`,
              {
                method: Method.GET,
                cache: 'no-store',
              }
            )

            if (!productResponse.ok) return null

            const productData = await productResponse.json()
            const product = productData.data?.[0]

            return product
              ? {
                  product: product,
                  link: `/?categories[0][key]=${
                    category.documentId
                  }&categories[0][value]=${encodeURIComponent(
                    category.title
                  )}&pagination`,
                }
              : null
          } catch (err) {
            console.error(
              `Error loading product for category ${category.title}:`,
              err
            )
            return null
          }
        })
      )

      return categoryItems.filter((item) => item !== null) as {
        product: ProductType
        link: string
      }[]
    } catch (err) {
      console.error(err)
    }
  }

  destroy() {
    this._categoryItems = []
  }
}

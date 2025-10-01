import { ProductType } from './ProductType'

export type TotalProductsApi = {
  data: ProductType[]
  meta: {
    pagination: {
      page: number
      pageCount: number
      pageSize: number
      total: number
    }
  }
}

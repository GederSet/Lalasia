export type HistoryProductsType = {
  id: number
  documentId: string
  title: string
  price: number
  discountPercent: number
  quantity: number
  description: string
  images: { id: number; url: string }[]
  rating: number
  productCategory: { title: string }
  createdAt?: number
}

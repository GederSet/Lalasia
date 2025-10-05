export type ProductAddCartType = {
  id: number
  documentId: string
  title: string
  description: string
  price: number
  discountPercent: number
  images: { id: number; url: string }[]
}

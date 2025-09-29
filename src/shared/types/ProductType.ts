export type ProductType = {
  id: number
  documentId: string
  title: string
  description: string
  price: number
  images: { id: number; url: string }[]
  productCategory: { title: string }
}

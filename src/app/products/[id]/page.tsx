import ProductPageStore from '@shared/store/ProductStore/ProductPageStore'
import { ProductPageStoreContextProvider } from '@shared/store/ProductStore/ProductPageStoreProvider'
import { notFound } from 'next/navigation'
import ProductPageComponent from './ProductPage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await ProductPageStore.getInitProductById(id)

  if (!product) {
    notFound()
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images:
        product.images?.map((img: { id: number; url: string }) => img.url) ||
        [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, relatedProducts] = await Promise.all([
    ProductPageStore.getInitProductById(id),
    ProductPageStore.getInitRelatedProducts(),
  ])

  if (!product || !relatedProducts) {
    notFound()
  }

  return (
    <ProductPageStoreContextProvider
      product={product}
      relatedProducts={relatedProducts}
    >
      <ProductPageComponent />
    </ProductPageStoreContextProvider>
  )
}

import ProductPageStore from '@shared/store/ProductStore/ProductPageStore'
import { ProductPageStoreContextProvider } from '@shared/store/ProductStore/ProductPageStoreProvider'
import ProductPageComponent from './ProductPage'

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, relatedProducts] = await Promise.all([
    ProductPageStore.getInitProductById(params.id),
    ProductPageStore.getInitRelatedProducts(),
  ])

  if (!product || !relatedProducts) {
    throw new Error('Error')
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

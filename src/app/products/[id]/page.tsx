'use client'

import { ProductPageStoreContextProvider } from '@shared/store/ProductStore/ProductPageStoreProvider'
import ProductPageComponent from './ProductPage'

export default function ProductPage() {
  return (
    <ProductPageStoreContextProvider>
      <ProductPageComponent />
    </ProductPageStoreContextProvider>
  )
}

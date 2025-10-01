'use client'

import { useLocalStore } from '@/shared/store/hooks/useLocalStore'
import { ProductType } from '@shared/types/ProductType'
import React from 'react'
import ProductPageStore from './ProductPageStore'

type ProductPageStoreContextProviderProps = {
  children: React.ReactNode
  product: ProductType
  relatedProducts: ProductType[]
}

const ProductPageStoreContext = React.createContext<ProductPageStore | null>(
  null
)

export const ProductPageStoreContextProvider: React.FC<
  ProductPageStoreContextProviderProps
> = ({ children, product, relatedProducts }) => {
  console.log(relatedProducts)
  const store = useLocalStore(
    () => new ProductPageStore(product, relatedProducts)
  )

  return (
    <ProductPageStoreContext.Provider value={store}>
      {children}
    </ProductPageStoreContext.Provider>
  )
}

export const useProductPageStore = () => {
  const context = React.useContext(ProductPageStoreContext)
  if (!context) throw new Error('ProductPageStoreContext was not provided')
  return context
}

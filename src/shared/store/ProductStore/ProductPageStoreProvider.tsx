'use client'

import { useLocalStore } from '@/shared/store/hooks/useLocalStore'
import React from 'react'
import ProductPageStore from './ProductPageStore'

const ProductPageStoreContext = React.createContext<ProductPageStore | null>(
  null
)

export const ProductPageStoreContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const store = useLocalStore(() => new ProductPageStore())

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

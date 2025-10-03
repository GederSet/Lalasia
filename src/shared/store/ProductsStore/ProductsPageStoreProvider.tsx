'use client'

import { useLocalStore } from '@/shared/store/hooks/useLocalStore'
import { Option } from '@shared/types/OptionType'
import { QueryParamsTypes } from '@shared/types/QueryParamsTypes'
import { TotalProductsApi } from '@shared/types/TotalProductsApiType'
import React from 'react'
import { useRootStore } from '../RootStore'
import ProductsPageStore from './ProductsPageStore'

type ProductsPageStoreContextProviderProps = {
  children: React.ReactNode
  products: TotalProductsApi
  categories: Option[]
  queryData: QueryParamsTypes
}

const ProductsPageStoreContext = React.createContext<ProductsPageStore | null>(
  null
)

export const ProductsPageStoreContextProvider: React.FC<
  ProductsPageStoreContextProviderProps
> = ({ children, products, categories, queryData }) => {
  const rootStore = useRootStore()

  rootStore.query.setInitialParams(queryData)

  const productsData = products.data
  const productsCount = products.meta.pagination.total

  const store = useLocalStore(
    () =>
      new ProductsPageStore(
        productsData,
        productsCount,
        rootStore.query,
        categories
      )
  )

  return (
    <ProductsPageStoreContext.Provider value={store}>
      {children}
    </ProductsPageStoreContext.Provider>
  )
}

export const useProductsPageStore = () => {
  const context = React.useContext(ProductsPageStoreContext)
  if (!context) throw new Error('ProductsPageStoreContext was not provided')
  return context
}

'use client'

import { useRootStore } from '@/shared/store/RootStore'
import { Option } from '@/shared/store/RootStore/QueryParamsStore/QueryParamsStore'
import { useLocalStore } from '@/shared/store/hooks/useLocalStore'
import React from 'react'
import ProductsPageStore from './ProductsPageStore'

type ProductsPageStoreContextProviderProps = {
  children: React.ReactNode
  queryData: {
    params: Record<string, unknown>
    currentPage: number
    pageSize: number
  }
}

const ProductsPageStoreContext = React.createContext<ProductsPageStore | null>(
  null
)

export const ProductsPageStoreContextProvider: React.FC<
  ProductsPageStoreContextProviderProps
> = ({ children, queryData }) => {
  const rootStore = useRootStore()

  rootStore.query.setInitialParams({
    search: queryData.params.search as string | undefined,
    categories: queryData.params.categories as Option[] | undefined,
    pagination: {
      page: queryData.currentPage,
      pageCount: 0,
      pageSize: queryData.pageSize,
    },
  })

  const store = useLocalStore(() => new ProductsPageStore(rootStore.query))

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

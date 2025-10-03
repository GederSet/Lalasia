'use client'

import { CategoryInfoType } from '@shared/types/CategoryInfoType'
import React from 'react'
import { useLocalStore } from '../hooks/useLocalStore'
import CategoriesPageStore from './CategoriesPageStore'

type CategoriesPageStoreContextProviderProps = {
  children: React.ReactNode
  categoryItems: CategoryInfoType[]
}

const CategoriesPageStoreContext =
  React.createContext<CategoriesPageStore | null>(null)

export const CategoriesPageStoreContextProvider: React.FC<
  CategoriesPageStoreContextProviderProps
> = ({ children, categoryItems }) => {
  const store = useLocalStore(() => new CategoriesPageStore(categoryItems))

  return (
    <CategoriesPageStoreContext.Provider value={store}>
      {children}
    </CategoriesPageStoreContext.Provider>
  )
}

export const useCategoriesPageStore = () => {
  const context = React.useContext(CategoriesPageStoreContext)
  if (!context) throw new Error('CategoriesPageStoreContext was not provided')
  return context
}

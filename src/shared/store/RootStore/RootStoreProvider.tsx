'use client'

import { enableStaticRendering } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useCreateRootStore } from '../hooks/useCreateRootStore'
import { useStrictContext } from '../hooks/useStrictContext'
import RootStore from './RootStore'

const isServer = typeof window === 'undefined'
enableStaticRendering(isServer)

type RootStoreContextValue = RootStore
const RootStoreContext = React.createContext<RootStoreContextValue | null>(null)

type RootStoreProviderProps = {
  children: React.ReactNode
}

export const RootStoreProvider: React.FC<RootStoreProviderProps> = ({
  children,
}) => {
  const store = useCreateRootStore()

  useEffect(() => {
    store.initClient()
  }, [])

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  )
}

export const useRootStore = (): RootStore => {
  return useStrictContext({
    context: RootStoreContext,
    message: 'RootStoreContext was not provided',
  })
}

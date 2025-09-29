import RootStore from '../RootStore'

let clientStore: RootStore | null = null
const isServer = typeof window === 'undefined'

export const useCreateRootStore = (): RootStore => {
  const initRootStore = (): RootStore => {
    return new RootStore()
  }

  if (isServer) {
    return initRootStore()
  }

  if (!clientStore) {
    clientStore = initRootStore()
  }

  return clientStore
}

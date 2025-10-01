import { useEffect, useRef } from 'react'

export interface ILocalStore {
  destroy: () => void
}

export const useLocalStore = <T extends ILocalStore>(creator: () => T): T => {
  const container = useRef<T | null>(null)
  if (container.current === null) {
    container.current = creator()
  }

  // изначально я получаю список товаров, но
  // работая в strictMode, в котором компоненты
  // монтируются и размонтируются 2 раза, он
  // мне их удаляет из-за destroy().
  // React при клиентском переходе (по ссылкам в хедере)
  // делает этот двойной маунт, но при обновлении
  // страницы он этого не делает.

  useEffect(() => {
    return () => {
      container.current?.destroy()
    }
  }, [])

  return container.current
}

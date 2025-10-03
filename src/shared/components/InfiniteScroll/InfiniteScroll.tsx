'use client'

import { useCallback, useEffect, useRef } from 'react'
import Loader from '../Loader'
import s from './InfiniteScroll.module.scss'

interface InfiniteScrollProps {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  children: React.ReactNode
  threshold?: number
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  loading,
  onLoadMore,
  children,
  threshold = 200,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
    })

    observer.observe(sentinel)

    return () => {
      observer.unobserve(sentinel)
    }
  }, [handleIntersection, threshold])

  return (
    <>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className={s.sentinel}>
          {loading && (
            <div className={s.loader}>
              <Loader size='m' />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default InfiniteScroll

'use client'

import Button from '@components/Button'
import Card from '@components/Card'
import { ProductType } from '@shared/types/ProductType'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import s from './VirtualizedProductsList.module.scss'

interface VirtualizedProductsListProps {
  products: ProductType[]
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  onProductClick?: (product: ProductType) => void
}

export interface VirtualizedProductsListRef {
  scrollToIndex: (index: number) => void
  scrollToTop: () => void
}

const VirtualizedProductsList = forwardRef<
  VirtualizedProductsListRef,
  VirtualizedProductsListProps
>(({ products, hasMore, loading, onLoadMore, onProductClick }, ref) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      virtuosoRef.current?.scrollToIndex({ index, behavior: 'smooth' })
    },
    scrollToTop: () => {
      virtuosoRef.current?.scrollToIndex({ index: 0, behavior: 'smooth' })
    },
  }))

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      onLoadMore()
    }
  }, [hasMore, loading, onLoadMore])

  const itemContent = useCallback(
    (index: number, product: ProductType) => (
      <div className={s.productItem}>
        <Card
          productNumberId={product.id}
          productId={product.documentId}
          className={s.productCard}
          images={product.images}
          captionSlot={product.productCategory.title}
          title={product.title}
          subtitle={product.description}
          contentSlot={`${product.price}`}
          actionSlot={
            <Button onClick={() => onProductClick?.(product)}>
              Add to Cart
            </Button>
          }
        />
      </div>
    ),
    [onProductClick]
  )

  return (
    <div className={s.container}>
      <Virtuoso
        ref={virtuosoRef}
        data={products}
        itemContent={itemContent}
        endReached={loadMore}
        overscan={5} // Количество элементов для предзагрузки
        increaseViewportBy={200} // Дополнительная область для срабатывания endReached
        className={s.virtuoso}
      />

      {loading && <div className={s.loadingIndicator}>Загрузка...</div>}
    </div>
  )
})

VirtualizedProductsList.displayName = 'VirtualizedProductsList'

export default VirtualizedProductsList

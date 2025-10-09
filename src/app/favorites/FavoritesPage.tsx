'use client'

import Button from '@components/Button'
import Card from '@shared/components/Card'
import { useRootStore } from '@shared/store/RootStore'
import { useEffect, useMemo, useState } from 'react'
import s from './Favorites.module.scss'
import NullFavorites from './components/NullFavorites'

const FavoritesPage = () => {
  const rootStore = useRootStore()
  type FavoriteItem = {
    id: number
    documentId: string
    title: string
    price: number
    description: string
    images: { id: number; url: string }[]
    discountPercent: number
    rating: number
  }
  const [products, setProducts] = useState<FavoriteItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const email = rootStore.auth.currentUser?.email
    if (!email) {
      setProducts([])
      return
    }
    try {
      const raw = localStorage.getItem('favorites')
      const store = raw ? JSON.parse(raw) : {}
      const list: FavoriteItem[] = Array.isArray(store[email])
        ? store[email]
        : []
      setProducts(list)
    } catch (e) {
      console.error('Failed to read favorites', e)
      setProducts([])
    }
  }, [rootStore.auth.currentUser?.email])

  const isEmpty = useMemo(
    () => !rootStore.auth.isAuthenticated || products.length === 0,
    [rootStore.auth.isAuthenticated, products.length]
  )

  return (
    <section className={s.favorites}>
      <div className={s.favorites__container}>
        {isEmpty ? (
          <NullFavorites
            title="You haven't added anything to favorites yet"
            text='Go to the main page to select the products'
          />
        ) : (
          <>
            <h2 className={s.favorites__title}>Favorites</h2>
            <div className={s.favorites__body}>
              {products.map((item, index) => (
                <Card
                  key={`${item.id}-${item.documentId ?? index}`}
                  productNumberId={item.id}
                  productId={item.documentId}
                  className={s.favorites__card}
                  images={item.images}
                  discountPercent={item.discountPercent}
                  captionSlot={undefined}
                  title={item.title}
                  rating={item.rating}
                  subtitle={item.description}
                  contentSlot={`${item.price}`}
                  actionSlot={<Button>Add to Cart</Button>}
                  onFavoriteChange={(productId, isFav) => {
                    if (!isFav) {
                      setProducts((prev) =>
                        prev.filter((p) => p.id !== productId)
                      )
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default FavoritesPage

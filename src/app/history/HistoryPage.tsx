'use client'

import Card from '@shared/components/Card'
import { useRootStore } from '@shared/store/RootStore'
import { HistoryProductsType } from '@shared/types/HistoryProductsType'
import { useEffect, useState } from 'react'
import s from './History.module.scss'
import NullHistory from './components/NullHistory'

const HistoryPage = () => {
  const rootStore = useRootStore()
  const [products, setProducts] = useState<HistoryProductsType[]>([])

  useEffect(() => {
    if (!rootStore.auth.isAuthenticated) {
      setProducts([])
      return
    }
    try {
      const raw = localStorage.getItem('orderHistory')
      const store = raw ? JSON.parse(raw) : {}
      const email = rootStore.auth.currentUser?.email
      const list: any[] =
        email && Array.isArray(store[email]) ? store[email] : []
      setProducts(list as HistoryProductsType[])
    } catch (e) {
      setProducts([])
    }
  }, [rootStore.auth.isAuthenticated, rootStore.auth.currentUser?.email])

  console.log(products)

  return (
    <section className={s.history}>
      <div className={s.history__container}>
        {!rootStore.auth.isAuthenticated || products.length === 0 ? (
          <NullHistory
            title="You haven't bought anything yet"
            text='Go to the main page to select the products'
          />
        ) : (
          <>
            <h2 className={s.history__title}>History</h2>
            <div className={s.history__body}>
              {products.map((item, index) => (
                <Card
                  key={`${item.id}-${item.createdAt ?? index}`}
                  productNumberId={item.id}
                  productId={item.documentId}
                  className={s.history__card}
                  images={item.images}
                  discountPercent={item.discountPercent}
                  captionSlot={
                    item.productCategory?.title
                      ? `${item.productCategory.title}, Qty: ${item.quantity}`
                      : `Qty: ${item.quantity}`
                  }
                  title={item.title}
                  rating={item.rating}
                  subtitle={item.description}
                  contentSlot={`${item.price * item.quantity}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default HistoryPage

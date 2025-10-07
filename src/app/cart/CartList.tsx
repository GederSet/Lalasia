'use client'

import Button from '@components/Button'
import CartPopup from '@shared/components/CartPopup'
import Loader from '@shared/components/Loader'
import Popup from '@shared/components/Popup'
import { Meta } from '@shared/config/meta'
import { useAnimatedNumber } from '@shared/hooks/useConfigureNumbers'
import { HistoryProductsType } from '@shared/types/HistoryProductsType'
import { useRootStore } from '@store/RootStore'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import s from './Cart.module.scss'
import CartError from './components/CartError'
import CartProduct from './components/CartProduct'
import CartSkeletonPage from './components/CartSkeletonPage'
import NullCart from './components/NullCart'

const CartList: React.FC = () => {
  const rootStore = useRootStore()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  const hasDiscount =
    rootStore.cart.totalDiscountPrice !== rootStore.cart.totalPrice

  const targetTotal = hasDiscount
    ? rootStore.cart.totalDiscountPrice
    : rootStore.cart.totalPrice

  const animatedTotal = useAnimatedNumber(targetTotal, 250)

  const discountTarget = hasDiscount
    ? rootStore.cart.totalPrice - rootStore.cart.totalDiscountPrice
    : 0
  const animatedDiscount = useAnimatedNumber(discountTarget, 250)

  const animatedFullPrice = useAnimatedNumber(rootStore.cart.totalPrice, 250)

  if (rootStore.cart.meta === Meta.loading) {
    return <CartSkeletonPage />
  }

  const handleDeleteRequest = (productId: number) => {
    setProductToDelete(productId)
    setIsPopupOpen(true)
  }

  const handleConfirmDelete = () => {
    if (productToDelete !== null) {
      rootStore.cart.deleteFromCartLocal(productToDelete)
      setProductToDelete(null)
    }
    setIsPopupOpen(false)
  }

  const handleCancelDelete = () => {
    setProductToDelete(null)
    setIsPopupOpen(false)
  }

  const products = [...rootStore.cart.items]
    .reverse()
    .map((item) => (
      <CartProduct
        key={item.product.id}
        productId={item.product.id}
        name={item.product.title}
        price={item.product.price}
        discountPercent={item.product.discountPercent}
        count={item.quantity}
        description={item.product.description || ''}
        images={item.product.images}
        onDelete={handleDeleteRequest}
      />
    ))

  const handleBuy = () => {
    setIsCartPopupOpen(true)
  }

  const handleConfirmBuy = () => {
    const KEY = 'orderHistory'

    try {
      const raw = localStorage.getItem(KEY)
      const store = raw ? JSON.parse(raw) : {}
      const email = rootStore.auth.currentUser?.email
      if (!email) throw new Error('No user email for history write')
      const prev: any[] = Array.isArray(store[email]) ? store[email] : []

      const createdAt = Date.now()
      const newProducts: HistoryProductsType[] = rootStore.cart.items.map(
        (i) => ({
          id: i.product.id,
          documentId: i.product.documentId,
          title: i.product.title,
          price: i.product.price,
          discountPercent: i.product.discountPercent,
          quantity: i.quantity,
          images: i.product.images,
          productCategory: i.product.productCategory
            ? { title: i.product.productCategory.title }
            : { title: '' },
          description: i.product.description,
          rating: i.product.rating ?? 0,
          createdAt,
        })
      )

      const next = [...newProducts, ...prev]
      const updated = { ...store, [email]: next }
      localStorage.setItem(KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to write order to localStorage', e)
    }

    rootStore.cart.deleteAllFromCart()
    setIsCartPopupOpen(false)
  }

  return (
    <div
      className={cn(s['basket'], {
        [s['basket_discount']]:
          rootStore.cart.totalDiscountPrice !== rootStore.cart.totalPrice,
      })}
    >
      <div className={s['basket__container']}>
        {rootStore.cart.meta === Meta.error ? (
          <CartError text='Error loading the shopping cart' />
        ) : rootStore.cart.totalCount === 0 ? (
          <NullCart
            title='Your shopping cart is empty'
            text='Go to the main page to select the products'
          />
        ) : (
          <>
            <div className={cn(s['basket__column'], s['basket__column_1'])}>
              <h2 className={s['basket__title']}>Cart</h2>
              <div className={s['basket__body']}>{products}</div>
            </div>
            <div className={cn(s['basket__column'], s['basket__column_2'])}>
              <div className={s['basket__wrapper']}>
                <div className={s['basket__counts']}>
                  <div className={s['basket__counts-text']}>
                    Total products:
                  </div>
                  <div className={s['basket__counts-product']}>
                    {rootStore.cart.totalCount}
                  </div>
                </div>
                {hasDiscount && (
                  <>
                    <div className={s['basket__rows']}>
                      <div className={s['basket__rows-text']}>Full price:</div>
                      <div className={s['basket__rows-price']}>
                        ${animatedFullPrice}
                      </div>
                    </div>
                    <div className={s['basket__rows']}>
                      <div className={s['basket__rows-text']}>My discount:</div>
                      <div className={s['basket__rows-price']}>
                        -$
                        {animatedDiscount}
                      </div>
                    </div>
                  </>
                )}
                <div className={s['basket__finals']}>
                  <div className={s['basket__total-text']}>Total price</div>
                  <div className={s['basket__total-price']}>
                    <span>${animatedTotal}</span>
                  </div>
                </div>
                <Button onClick={handleBuy} className={s['basket__button']}>
                  Buy
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <Popup
        isOpen={isPopupOpen}
        title={'Warning'}
        type={'confirm'}
        description={'Are you sure you want to delete the product?'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      {rootStore.cart.metaMini === Meta.loading && (
        <Loader size='m' className={s['basket__mini-loader']} />
      )}
      <CartPopup
        isOpen={isCartPopupOpen}
        totalProducts={rootStore.cart.totalCount}
        fullPrice={rootStore.cart.totalPrice}
        discountedPrice={discountTarget}
        totalPrice={targetTotal}
        onConfirm={handleConfirmBuy}
        onCancel={() => setIsCartPopupOpen(false)}
      />
    </div>
  )
}

export default observer(CartList)

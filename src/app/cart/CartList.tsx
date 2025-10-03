'use client'

import Button from '@components/Button'
import Loader from '@shared/components/Loader'
import Popup from '@shared/components/Popup'
import { Meta } from '@shared/config/meta'
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
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

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
        count={item.quantity}
        description={item.product.description || ''}
        images={item.product.images}
        onDelete={handleDeleteRequest}
      />
    ))

  const handleBuy = () => {
    alert('Пока не готово)')
  }

  return (
    <div className={s['basket']}>
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
                <div className={s['basket__finals']}>
                  <div className={s['basket__total-text']}>Total price</div>
                  <div className={s['basket__total-price']}>
                    ${rootStore.cart.totalPrice}
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
    </div>
  )
}

export default observer(CartList)

'use client'

import cn from 'classnames'
import { useEffect } from 'react'
import Button from '../Button'
import s from './CartPopup.module.scss'

type CartPopupProps = {
  isOpen: boolean
  totalProducts: number
  fullPrice: number
  discountedPrice: number
  totalPrice: number
  onConfirm?: () => void
  onCancel?: () => void
}

const CartPopup: React.FC<CartPopupProps> = ({
  isOpen,
  totalProducts,
  fullPrice,
  discountedPrice,
  totalPrice,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('_lock')
    } else {
      document.body.classList.remove('_lock')
    }
    return () => {
      document.body.classList.remove('_lock')
    }
  }, [isOpen])

  return (
    <div className={cn(s['cart-popup'], { [s._open]: isOpen })}>
      <div className={cn(s['cart-popup__body'])}>
        <div className={s['cart-popup__rows']}>
          <div className={s['cart-popup__text']}>Total products:</div>
          <div className={s['cart-popup__number']}>{totalProducts}</div>
        </div>
        <div className={s['cart-popup__rows']}>
          <div className={s['cart-popup__text']}>Full price:</div>
          <div className={s['cart-popup__number']}>${fullPrice}</div>
        </div>
        <div className={s['cart-popup__rows']}>
          <div className={s['cart-popup__text']}>My discount:</div>
          <div className={s['cart-popup__number']}>-${discountedPrice}</div>
        </div>
        <div className={cn(s['cart-popup__rows'], s['cart-popup__rows_total'])}>
          <div className={s['cart-popup__text']}>Total price</div>
          <div className={s['cart-popup__number']}>${totalPrice}</div>
        </div>
        <div className={s['cart-popup__buttons']}>
          <Button className={s['cart-popup__button']} onClick={onConfirm}>
            Buy
          </Button>
          <Button
            buttonStyle='transparent'
            className={s['cart-popup__button']}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CartPopup

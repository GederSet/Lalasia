'use client'

import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import s from './ConfirmPurchasePopup.module.scss'

type ConfirmPurchasePopupProps = {
  isOpen: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

const ConfirmPurchasePopup: React.FC<ConfirmPurchasePopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false)
    } else if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm?.()
    setIsConfirmed(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onCancel?.()
    }, 2000)
  }

  return (
    <div className={cn(s['confirm-purchase-popup'], { [s._open]: isOpen })}>
      <div
        className={cn(
          s['confirm-purchase-popup__body'],
          s['confirm-purchase-popup__content']
        )}
      >
        <div className={s['confirm-purchase-popup__title']}>
          {isConfirmed ? 'Success' : 'Confirm Purchase'}
        </div>
        <div className={s['confirm-purchase-popup__description']}>
          {isConfirmed
            ? 'You have successfully purchased the product!'
            : 'Do you want to buy this product now?'}
        </div>
        <div className={s['confirm-purchase-popup__buttons']}>
          <Button
            className={s['confirm-purchase-popup__button']}
            onClick={isConfirmed ? onCancel : handleConfirm}
          >
            Ok
          </Button>
          {!isConfirmed && (
            <Button
              buttonStyle='transparent'
              className={s['confirm-purchase-popup__button']}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfirmPurchasePopup

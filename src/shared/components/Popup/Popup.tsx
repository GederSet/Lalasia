'use client'

import cn from 'classnames'
import { useEffect } from 'react'
import Button from '../Button'
import s from './Popup.module.scss'

type PopupProps = {
  isOpen: boolean
  title: string
  description: string
  type?: 'alert' | 'confirm'
  onConfirm?: () => void
  onCancel?: () => void
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  title,
  description,
  type = 'alert',
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
    <div className={cn(s.popup, { [s._open]: isOpen })}>
      <div className={cn(s.popup__body, s.popup__content)}>
        <div className={s.popup__title}>{title}</div>
        <div className={s.popup__description}>{description}</div>
        <div className={s.popup__buttons}>
          <Button className={s.popup__button} onClick={onConfirm}>
            Ok
          </Button>

          {type === 'confirm' && (
            <Button
              buttonStyle='transparent'
              className={s.popup__button}
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

export default Popup

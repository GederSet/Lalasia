import { routes } from '@config/routes/routesMask'
import { useRootStore } from '@shared/store/RootStore'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Popup from '../Popup'
import Text from '../Text'
import s from './Card.module.scss'

export type CardProps = {
  /** Дополнительный classname */
  className?: string
  /** URL изображения */
  images: { id: number; url: string }[]
  /** Слот над заголовком */
  captionSlot?: React.ReactNode
  /** Заголовок карточки */
  title: React.ReactNode
  /** Описание карточки */
  subtitle: React.ReactNode
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode
  /** Клик на карточку */
  onClick?: React.MouseEventHandler
  /** Слот для действия */
  actionSlot?: React.ReactNode
  productId: string
  productNumberId: number
}

const Card: React.FC<CardProps> = ({
  className,
  productId,
  productNumberId,
  images,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const rootStore = useRootStore()
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleAddProductToBasket = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!rootStore.auth.isAuthenticated) {
      setIsPopupOpen(true)
      return
    }

    const productInfo = {
      id: productNumberId,
      documentId: productId,
      title: String(title),
      price: Number(contentSlot),
      description: String(subtitle),
      images: images,
    }

    rootStore.cart.addToCart(productInfo)
  }

  return (
    <>
      <Link
        href={routes.product.create(productId)}
        onClick={onClick}
        className={cn(s.card, className)}
      >
        <div className={s.card__img}>
          <Image fill src={images[0].url} alt='product' />
        </div>
        <div className={s.card__body}>
          <div className={s.card__wrapper}>
            {captionSlot && (
              <div className={s.card__text}>
                <Text tag='h3' color='secondary' weight='medium' view='p-14'>
                  {captionSlot}
                </Text>
              </div>
            )}
            <div className={s.card__title}>
              <Text
                maxLines={2}
                tag='h2'
                color='primary'
                weight='medium'
                view='p-20'
              >
                {title}
              </Text>
            </div>
            <div className={s.card__subtitle}>
              <Text maxLines={3} color='secondary'>
                {subtitle}
              </Text>
            </div>
          </div>
          <div className={s.card__rows}>
            {contentSlot && (
              <div className={s.card__price}>
                <Text tag='p' color='primary' weight='bold' view='p-18'>
                  ${contentSlot}
                </Text>
              </div>
            )}
            {actionSlot && (
              <div
                onClick={(e) => handleAddProductToBasket(e)}
                className={s.card__button}
              >
                {actionSlot}
              </div>
            )}
          </div>
        </div>
      </Link>
      <Popup
        isOpen={isPopupOpen}
        title='Warning'
        description='You are not logged in'
        type='alert'
        onConfirm={() => setIsPopupOpen(false)}
      />
    </>
  )
}

export default Card

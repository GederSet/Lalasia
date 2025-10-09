import { routes } from '@config/routes/routesMask'
import { useRootStore } from '@shared/store/RootStore'
import { getDiscount } from '@shared/utils/getDiscount'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import HeartIcon from '../icons/HeartIcon'
import StarIcon from '../icons/StarIcon'
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
  discountPercent: number
  rating: number
  onFavoriteChange?: (productId: number, isFavorite: boolean) => void
}

const Card: React.FC<CardProps> = ({
  className,
  discountPercent,
  productId,
  productNumberId,
  images,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
  rating,
  onFavoriteChange,
}) => {
  const rootStore = useRootStore()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupMessage, setPopupMessage] = useState('You are not logged in')
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const email = rootStore.auth.currentUser?.email
    if (!email) {
      setIsFavorite(false)
      return
    }
    try {
      const raw = localStorage.getItem('favorites')
      const store = raw ? JSON.parse(raw) : {}
      const list: any[] = Array.isArray(store[email]) ? store[email] : []
      setIsFavorite(list.some((i) => i?.id === productNumberId))
    } catch {
      setIsFavorite(false)
    }
  }, [rootStore.auth.currentUser?.email, productNumberId])

  const handleAddProductToBasket = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!rootStore.auth.isAuthenticated) {
      setPopupMessage('You are not logged in')
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
      discountPercent: discountPercent,
    }

    try {
      setIsAdding(true)
      await rootStore.cart.addToCart(productInfo)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!rootStore.auth.isAuthenticated) {
      setPopupMessage('Please register to use favorites')
      setIsPopupOpen(true)
      return
    }

    try {
      const email = rootStore.auth.currentUser?.email
      if (!email) throw new Error('No user email')
      const raw = localStorage.getItem('favorites')
      const store = raw ? JSON.parse(raw) : {}
      const list: any[] = Array.isArray(store[email]) ? store[email] : []
      const exists = list.some((i) => i?.id === productNumberId)
      let next: any[]
      if (exists) {
        next = list.filter((i) => i?.id !== productNumberId)
        setIsFavorite(false)
        onFavoriteChange?.(productNumberId, false)
      } else {
        const favoriteItem = {
          id: productNumberId,
          documentId: productId,
          title: String(title),
          price: Number(contentSlot),
          description: String(subtitle),
          images: images,
          discountPercent: discountPercent,
          rating: rating,
        }
        next = [favoriteItem, ...list]
        setIsFavorite(true)
        onFavoriteChange?.(productNumberId, true)
      }
      const updated = { ...store, [email]: next }
      localStorage.setItem('favorites', JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to toggle favorite', err)
    }
  }

  return (
    <>
      <Link
        href={routes.product.create(productId)}
        onClick={onClick}
        className={cn(s.card, className)}
      >
        <div className={s['card__options-wrapper']}>
          <div
            className={cn(s['card__heart'], {
              [s['card__heart_active']]: isFavorite,
            })}
            onClick={handleToggleFavorite}
          >
            <HeartIcon width={28} height={28} />
          </div>
          {rating !== 0 && (
            <div className={s.card__rating}>
              <StarIcon />
              <p className={s['card__rating-text']}>{rating}</p>
            </div>
          )}
        </div>
        {discountPercent !== 0 && (
          <div className={s['card__discount-badge']}>-{discountPercent}%</div>
        )}
        <div className={s.card__img}>
          {images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              loop={true}
              className={s.card__swiper}
            >
              {images.map((image, index) => (
                <SwiperSlide key={image.id || index}>
                  <div className={s.card__slide}>
                    <Image fill src={image.url} alt={`product ${index + 1}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image fill src={images[0].url} alt='product' />
          )}
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
              <div className={s.card__prices}>
                {discountPercent !== 0 && (
                  <p className={s.card__discount}>
                    ${getDiscount(Number(contentSlot), discountPercent)}
                  </p>
                )}
                <p
                  className={cn(s.card__price, {
                    [s.card__price_discount]: discountPercent !== 0,
                  })}
                >
                  ${contentSlot}
                </p>
              </div>
            )}
            {actionSlot && (
              <div
                onClick={(e) => handleAddProductToBasket(e)}
                className={s.card__button}
              >
                {React.isValidElement(actionSlot)
                  ? React.cloneElement(actionSlot as React.ReactElement<any>, {
                      loading: isAdding,
                      loaderSize: 'xs',
                    })
                  : actionSlot}
              </div>
            )}
          </div>
        </div>
      </Link>
      <Popup
        isOpen={isPopupOpen}
        title='Warning'
        description={popupMessage}
        type='alert'
        onConfirm={() => setIsPopupOpen(false)}
      />
    </>
  )
}

export default observer(Card)

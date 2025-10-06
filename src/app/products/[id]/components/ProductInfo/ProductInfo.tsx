import Button from '@components/Button'
import Text from '@components/Text'
import ConfirmPurchasePopup from '@shared/components/ConfirmPurchasePopup/ConfirmPurchasePopup'
import Popup from '@shared/components/Popup'
import { useRootStore } from '@shared/store/RootStore'
import { ProductType } from '@shared/types/ProductType'
import { getDiscount } from '@shared/utils/getDiscount'
import cn from 'classnames'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import s from './ProductInfo.module.scss'

export type ProductInfoProps = {
  product: ProductType
  className?: string
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, className }) => {
  const rootStore = useRootStore()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isBuyPopupOpen, setIsBuyPopupOpen] = useState(false)
  const discountPercent = product.discountPercent ?? 0
  const hasDiscount = discountPercent > 0
  const discountedPrice = hasDiscount
    ? getDiscount(product.price, discountPercent)
    : product.price

  const handleBuyProduct = useCallback(() => {
    const KEY = 'orderHistory'
    const createdAt = Date.now()

    try {
      const raw = localStorage.getItem(KEY)
      const prev = Array.isArray(JSON.parse(raw || '[]'))
        ? JSON.parse(raw || '[]')
        : []

      const newProduct = {
        id: product.id,
        documentId: product.documentId,
        title: product.title,
        price: product.price,
        discountPercent: discountPercent,
        quantity: 1,
        images: product.images,
        productCategory: product.productCategory
          ? { title: product.productCategory.title }
          : { title: '' },
        description: product.description,
        rating: product.rating ?? 0,
        createdAt,
      }

      const next = [newProduct, ...prev]

      localStorage.setItem(KEY, JSON.stringify(next))
    } catch (e) {
      console.error('Failed to write order to localStorage', e)
    }
  }, [product, discountPercent])

  const handleAddProductToBasket = useCallback(() => {
    if (!rootStore.auth.isAuthenticated) {
      setIsPopupOpen(true)
      return
    }

    const productInfo = {
      id: product.id,
      documentId: product.documentId,
      title: product.title,
      price: product.price,
      description: product.description,
      images: product.images,
    }

    rootStore.cart.addToCart({
      ...productInfo,
      discountPercent: product.discountPercent ?? 0,
    })
  }, [product, rootStore])

  return (
    <>
      <div className={cn(s['product-info'], className)}>
        <div className={s['product-info__img']}>
          {product.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop
              className={s['product-info__swiper']}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={image.id || index}>
                  <div className={s['product-info__slide']}>
                    <Image fill src={image.url} alt={`product ${index + 1}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image fill src={product.images[0].url} alt='product' />
          )}
        </div>
        <div className={s['product-info__content']}>
          <div className={s['product-info__text-box']}>
            <Text
              tag='h2'
              view='p-44'
              weight='bold'
              className={s['product-info__name']}
            >
              {product.title}
            </Text>
            <Text
              tag='p'
              view='p-20'
              color='secondary'
              className={s['product-info__description']}
            >
              {product.description}
            </Text>
          </div>
          <div className={s['product-info__price-box']}>
            <div className={s['product-info__prices']}>
              {hasDiscount && (
                <p className={s['product-info__price']}>${discountedPrice}</p>
              )}
              <p
                className={cn(s['product-info__price'], {
                  [s['product-info__price_discount']]: hasDiscount,
                })}
              >
                ${product.price}
              </p>
            </div>
            <div className={s['product-info__buttons']}>
              <Button
                className={s['product-info_button']}
                onClick={() => setIsBuyPopupOpen(true)}
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddProductToBasket}
                className={s['product-info_button']}
                buttonStyle='transparent'
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Popup
        isOpen={isPopupOpen}
        title='Warning'
        description='You are not logged in'
        type='alert'
        onConfirm={() => setIsPopupOpen(false)}
      />
      <ConfirmPurchasePopup
        isOpen={isBuyPopupOpen}
        onConfirm={handleBuyProduct}
        onCancel={() => setIsBuyPopupOpen(false)}
      />
    </>
  )
}

export default ProductInfo

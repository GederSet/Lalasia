'use client'

import Button from '@components/Button'
import Card from '@components/Card'
import ArrowRoundIcon from '@shared/components/icons/ArrowRoundedIcon'
import { Meta } from '@shared/config/meta'
import { ProductType } from '@shared/types/ProductType'
import cn from 'classnames'
import React, { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import ErrorProduct from '../ErrorProduct'
import NullData from '../NullData'
import s from './ProductSlider.module.scss'

export type ProductSliderProps = {
  /** Дополнительный classname */
  className?: string
  /** Статус загрузки */
  meta: Meta
  /** Массив продуктов */
  products: ProductType[]
  /** Количество скелетонов при загрузке */
  skeletonCount?: number
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  className,
  meta,
  products,
  skeletonCount = 3,
}) => {
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)

  //   const productsSkeletons = [...new Array(skeletonCount)].map((_, id) => (
  //     <SwiperSlide key={id}>
  //       <ProductSkeleton className={s['product-slider__skeleton']} />
  //     </SwiperSlide>
  //   ))

  //   if (meta === Meta.loading) {
  //     return (
  //       <div className={cn(s['product-slider'], className)}>
  //         <Swiper
  //           modules={[Navigation, Pagination]}
  //           spaceBetween={30}
  //           slidesPerView={1}
  //           navigation={true}
  //           pagination={{ clickable: true }}
  //           breakpoints={{
  //             425: {
  //               slidesPerView: 2,
  //               spaceBetween: 30,
  //             },
  //             1024: {
  //               slidesPerView: 3,
  //               spaceBetween: 30,
  //             },
  //           }}
  //           className={s['product-slider__swiper']}
  //         >
  //           {productsSkeletons}
  //         </Swiper>
  //       </div>
  //     )
  //   }

  if (meta === Meta.error) {
    return <ErrorProduct text={'Error loading products'} />
  }

  if (products.length === 0) {
    return <NullData text={'No products found'} />
  }

  return (
    <div className={cn(s['product-slider'], className)}>
      <button ref={prevRef} className={s['product-slider__prev']}>
        <ArrowRoundIcon />
      </button>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        onSwiper={(swiper) => {
          setTimeout(() => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation === 'object'
            ) {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
              swiper.navigation.init()
              swiper.navigation.update()
            }
          })
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          425: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className={s['product-slider__swiper']}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Card
              discountPercent={product.discountPercent}
              productNumberId={product.id}
              productId={product.documentId}
              className={s['product-slider__card']}
              images={product.images}
              captionSlot={product.productCategory.title}
              title={product.title}
              subtitle={product.description}
              contentSlot={`${product.price}`}
              actionSlot={<Button>Add to Cart</Button>}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button ref={nextRef} className={s['product-slider__next']}>
        <ArrowRoundIcon />
      </button>
    </div>
  )
}

export default ProductSlider

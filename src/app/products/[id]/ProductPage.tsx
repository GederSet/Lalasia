'use client'

import BackLink from '@components/BackLink'
import Text from '@components/Text'
import { Meta } from '@shared/config/meta'
import { useProductPageStore } from '@shared/store/ProductStore/ProductPageStoreProvider'
import { observer } from 'mobx-react-lite'
import Skeleton from 'react-loading-skeleton'
import ProductInfo from './components/ProductInfo'
import ProductPageSkeleton from './components/ProductPageSkeleton'
import ProductSlider from './components/ProductSlider'
import s from './Product.module.scss'

const ProductPageComponent = () => {
  const productStore = useProductPageStore()

  return (
    <section className={s.product}>
      <div className={s.product__container}>
        {productStore.productMeta === Meta.loading ? (
          <div className={s['product__back-link-skeleton']}>
            <Skeleton />
          </div>
        ) : (
          <BackLink className={s['product__back-link']} />
        )}

        {productStore.productMeta === Meta.loading && <ProductPageSkeleton />}
        {productStore.productMeta === Meta.error && (
          <div>An error occurred when loading the product</div>
        )}
        {productStore.currentProduct && (
          <ProductInfo
            className={s.product__info}
            product={productStore.currentProduct}
          />
        )}
        <div className={s['product__wrapper']}>
          <div className={s['product__counts']}>
            <Text
              tag='h3'
              weight='bold'
              view='p-32'
              className={s['product__count-text']}
            >
              Related Items
            </Text>
          </div>
          <ProductSlider
            className={s['product__slider']}
            meta={productStore.relatedMeta}
            products={productStore.relatedProducts}
            skeletonCount={3}
          />
        </div>
      </div>
    </section>
  )
}

export default observer(ProductPageComponent)

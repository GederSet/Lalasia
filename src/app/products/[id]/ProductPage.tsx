'use client'

import BackLink from '@components/BackLink'
import Button from '@components/Button'
import Card from '@components/Card'
import ProductSkeleton from '@components/ProductSkeleton'
import Text from '@components/Text'
import { Meta } from '@shared/config/meta'
import { useProductPageStore } from '@shared/store/ProductStore/ProductPageStoreProvider'
import { observer } from 'mobx-react-lite'
import Skeleton from 'react-loading-skeleton'
import ErrorProduct from './components/ErrorProduct'
import NullData from './components/NullData'
import ProductInfo from './components/ProductInfo'
import ProductPageSkeleton from './components/ProductPageSkeleton'
import s from './Product.module.scss'

const productsSkeletons = [...new Array(3)].map((_, id) => (
  <ProductSkeleton key={id} className={s['product__card-skeleton']} />
))

const ProductPageComponent = () => {
  // const params = useParams()
  const productStore = useProductPageStore()

  // useEffect(() => {
  //   const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  //   if (id) {
  //     productStore.fetchProductAndRelated(id, 3)
  //   }
  // }, [params?.id])

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
          <ErrorProduct text={'An error occurred when loading the product'} />
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
          <div className={s['product__body']}>
            {productStore.relatedMeta === Meta.loading ? (
              productsSkeletons
            ) : productStore.relatedMeta === Meta.error ? (
              <ErrorProduct text={'Error loading products'} />
            ) : productStore.relatedProducts.length === 0 ? (
              <NullData text={'No products found'} />
            ) : (
              productStore.relatedProducts.map((product) => (
                <Card
                  key={product.id}
                  productNumberId={product.id}
                  productId={product.documentId}
                  className={s['product__card']}
                  images={product.images}
                  captionSlot={product.productCategory.title}
                  title={product.title}
                  subtitle={product.description}
                  contentSlot={`${product.price}`}
                  actionSlot={<Button>Add to Cart</Button>}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default observer(ProductPageComponent)

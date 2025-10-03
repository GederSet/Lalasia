'use client'

import { useProductsPageStore } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import Button from '@components/Button'
import Card from '@components/Card'
import ProductSkeleton from '@components/ProductSkeleton'
import Text from '@components/Text'
import LoupeIcon from '@shared/components/icons/LoupeIcon'
import Input from '@shared/components/Input'
import Loader from '@shared/components/Loader'
import MultiDropdown, { Option } from '@shared/components/MultiDropdown'
import Pagination from '@shared/components/Pagination'
import VirtualizedProductsList, {
  VirtualizedProductsListRef,
} from '@shared/components/VirtualizedProductsList'
import { Meta } from '@shared/config/meta'
import { useDeviceType } from '@shared/hooks/useDeviceType'
import { useRootStore } from '@shared/store/RootStore'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useRef } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import ErrorProduct from '../components/ErrorProduct'
import NullData from '../components/NullData'
import s from './Products.module.scss'

const productsSkeletons = [...new Array(8)].map((_, id) => (
  <ProductSkeleton key={id} className={s['products__card-skeleton']} />
))

const ProductsList = () => {
  const rootStore = useRootStore()
  const productsStore = useProductsPageStore()
  const { isMobile } = useDeviceType()
  const virtualizedListRef = useRef<VirtualizedProductsListRef>(null)

  const categories = rootStore.query.categories
  const categoryValue = rootStore.query.categoryValue

  const handleClear = () => {
    rootStore.query.reset()
  }

  const handleSearch = (value: string) => {
    rootStore.query.setSearch(value)
  }

  const handleFindProducts = useCallback(() => {
    productsStore.setFindProducts()
  }, [productsStore])

  const handleLoadMore = useCallback(() => {
    productsStore.loadMoreProducts()
  }, [productsStore])

  const handleProductClick = useCallback((product: any) => {
    // Здесь можно добавить логику для добавления в корзину или навигации
    console.log('Product clicked:', product)
  }, [])

  useEffect(() => {
    return () => {
      rootStore.query.reset()
    }
  }, [])

  return (
    <section className={s.products}>
      <div className={s.products__container}>
        <div className={s.products__header}>
          <div className={s.products__box}>
            <Text
              tag='h1'
              weight='bold'
              view='p-44'
              className={s.products__title}
            >
              Products
            </Text>
            <Text
              tag='h2'
              color='secondary'
              weight='medium'
              view='p-20'
              className={s.products__subtitle}
            >
              We display products based on the latest products we have. To see
              older products, please enter the item name.
            </Text>
          </div>
        </div>

        <div className={s.products__navigate}>
          <div className={s['products__navigate-rows']}>
            <Input
              placeholder='Search product'
              className={s['products__navigate-input']}
              value={(rootStore.query.getParam('search') as string) || ''}
              onChange={handleSearch}
              afterSlot={
                <LoupeIcon
                  className={s['products__navigate-loupe']}
                  color='secondary'
                  onClick={handleFindProducts}
                />
              }
            />
            <Button
              className={s['products__navigate-button']}
              onClick={handleFindProducts}
            >
              Find now
            </Button>
          </div>

          <MultiDropdown
            className={s['products__multi-dropdown']}
            options={categories}
            value={categoryValue}
            onChange={(newCategories: Option[]) =>
              rootStore.query.setCategory(newCategories)
            }
            getTitle={(categoryValue: Option[]) =>
              categoryValue.length === 0
                ? 'Filter'
                : categoryValue.map(({ value }) => value).join(', ')
            }
          />

          <Button
            className={s['products__navigate-clear']}
            onClick={handleClear}
          >
            Clear Filters
          </Button>
        </div>

        <div className={s.products__wrapper}>
          <div className={s.products__counts}>
            <Text
              tag='h3'
              weight='bold'
              view='p-32'
              className={s['products__count-text']}
            >
              Total products
            </Text>
            {productsStore.meta === Meta.loading ? (
              <Loader size='s' />
            ) : (
              <Text
                tag='p'
                weight='bold'
                view='p-20'
                color='accent'
                className={s.products__count}
              >
                {productsStore.productsCount}
              </Text>
            )}
          </div>

          {isMobile ? (
            // Мобильная версия с виртуализацией и бесконечным скроллом
            productsStore.meta === Meta.error ? (
              <ErrorProduct text={'Error loading products'} />
            ) : productsStore.products.length === 0 &&
              productsStore.meta !== Meta.loading ? (
              <NullData text={'No products found'} />
            ) : (
              <div className={s.products__virtualized}>
                <VirtualizedProductsList
                  ref={virtualizedListRef}
                  products={productsStore.products}
                  hasMore={productsStore.hasMore}
                  loading={productsStore.meta === Meta.loading}
                  onLoadMore={handleLoadMore}
                  onProductClick={handleProductClick}
                />
              </div>
            )
          ) : (
            <>
              <div className={s.products__body}>
                {productsStore.meta === Meta.loading ? (
                  productsSkeletons
                ) : productsStore.meta === Meta.error ? (
                  <ErrorProduct text={'Error loading products'} />
                ) : productsStore.products.length === 0 ? (
                  <NullData text={'No products found'} />
                ) : (
                  productsStore.products.map((product) => (
                    <Card
                      key={product.id}
                      productNumberId={product.id}
                      productId={product.documentId}
                      className={s.products__card}
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
              {productsStore.productsCount !== 0 && <Pagination />}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default observer(ProductsList)

'use client'

import { useProductsPageStore } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import Button from '@components/Button'
import Card from '@components/Card'
import ProductSkeleton from '@components/ProductSkeleton'
import Text from '@components/Text'
import ButtonCheckbox from '@shared/components/ButtonCheckbox'
import LoupeIcon from '@shared/components/icons/LoupeIcon'
import InfiniteScroll from '@shared/components/InfiniteScroll'
import Input from '@shared/components/Input'
import Loader from '@shared/components/Loader'
import MultiDropdown, { Option } from '@shared/components/MultiDropdown'
import Pagination from '@shared/components/Pagination'
import PriceRangeSlider from '@shared/components/PriceRangeSlider'
import { Meta } from '@shared/config/meta'
import { useDeviceType } from '@shared/hooks/useDeviceType'
import { useRootStore } from '@shared/store/RootStore'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect } from 'react'
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

  const categories = rootStore.query.categories
  const categoryValue = rootStore.query.categoryValue

  const handleClear = () => {
    rootStore.query.reset()
  }

  const handleSearch = (value: string) => {
    rootStore.query.setSearch(value)
  }

  // может быть пригодится
  const handlePriceRangeChange = (value: [number, number]) => {}

  const handlePriceRangeChangeComplete = (value: [number, number]) => {
    rootStore.query.setPriceRange(value[0], value[1])
  }

  // может быть пригодится
  const handleDiscountRangeChange = (value: [number, number]) => {}

  const handleDiscountRangeChangeComplete = (value: [number, number]) => {
    rootStore.query.setDiscountRange(value[0], value[1])
  }

  const handleRatingRangeChange = (value: [number, number]) => {}
  const handleRatingRangeChangeComplete = (value: [number, number]) => {
    rootStore.query.setRatingRange(value[0], value[1])
  }

  const handleToggleInStock = useCallback(
    (checked: boolean) => {
      rootStore.query.setInStock(checked)
    },
    [rootStore.query]
  )

  const handleFindProducts = useCallback(() => {
    productsStore.setFindProducts()
  }, [productsStore])

  const handleLoadMore = useCallback(() => {
    productsStore.loadMoreProducts()
  }, [productsStore])

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

            <Button
              className={s['products__navigate-clear']}
              onClick={handleClear}
            >
              Clear Filters
            </Button>
          </div>

          <div
            className={cn(
              s['products__filter-rows'],
              s['products__filter-rows_gap']
            )}
          >
            <PriceRangeSlider
              className={s['products__price-range-slider']}
              title='Price'
              min={rootStore.query.priceRangeGlobal?.min}
              max={rootStore.query.priceRangeGlobal?.max}
              value={[
                (rootStore.query.getParam('priceRange') as any)?.min ??
                  rootStore.query.priceRange?.min,
                (rootStore.query.getParam('priceRange') as any)?.max ??
                  rootStore.query.priceRange?.max,
              ]}
              onChange={handlePriceRangeChange}
              onChangeComplete={handlePriceRangeChangeComplete}
              step={1}
            />

            <PriceRangeSlider
              className={s['products__price-range-slider']}
              title='Discount'
              min={rootStore.query.discountRangeGlobal?.min}
              max={rootStore.query.discountRangeGlobal?.max}
              value={[
                (rootStore.query.getParam('discountRange') as any)?.min ??
                  rootStore.query.discountRange?.min,
                (rootStore.query.getParam('discountRange') as any)?.max ??
                  rootStore.query.discountRange?.max,
              ]}
              onChange={handleDiscountRangeChange}
              onChangeComplete={handleDiscountRangeChangeComplete}
              step={1}
              labelPrefix={''}
              labelSuffix={'%'}
            />

            <PriceRangeSlider
              className={s['products__price-range-slider']}
              title='Rating'
              min={rootStore.query.ratingRangeGlobal?.min}
              max={rootStore.query.ratingRangeGlobal?.max}
              value={[
                (rootStore.query.getParam('ratingRange') as any)?.min ??
                  rootStore.query.ratingRange?.min,
                (rootStore.query.getParam('ratingRange') as any)?.max ??
                  rootStore.query.ratingRange?.max,
              ]}
              onChange={handleRatingRangeChange}
              onChangeComplete={handleRatingRangeChangeComplete}
              step={1}
              labelPrefix={''}
            />
          </div>

          <div className={s['products__filter-rows']}>
            <MultiDropdown
              className={cn(
                s['products__multi-dropdown'],
                s['products__multi-dropdown_category']
              )}
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
            <ButtonCheckbox
              className={s['products__button-checkbox']}
              text='In stock'
              checked={
                (rootStore.query.getParam('isInStock') as string) === 'true'
              }
              onChange={handleToggleInStock}
            />
          </div>
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
            productsStore.meta === Meta.error ? (
              <ErrorProduct text={'Error loading products'} />
            ) : productsStore.products.length === 0 &&
              productsStore.meta !== Meta.loading ? (
              <NullData text={'No products found'} />
            ) : (
              <div className={s.products__virtualized}>
                <InfiniteScroll
                  hasMore={productsStore.hasMore}
                  loading={productsStore.meta === Meta.loading}
                  onLoadMore={handleLoadMore}
                  threshold={200}
                >
                  <div className={s.products__body}>
                    {productsStore.products.map((product) => (
                      <Card
                        key={product.id}
                        productNumberId={product.id}
                        productId={product.documentId}
                        className={s.products__card}
                        images={product.images}
                        discountPercent={product.discountPercent}
                        captionSlot={product.productCategory.title}
                        title={product.title}
                        rating={product.rating}
                        subtitle={product.description}
                        contentSlot={`${product.price}`}
                        actionSlot={<Button>Add to Cart</Button>}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
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
                      discountPercent={product.discountPercent}
                      captionSlot={product.productCategory.title}
                      title={product.title}
                      rating={product.rating}
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

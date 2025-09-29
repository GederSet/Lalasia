import cn from 'classnames'
import Skeleton from 'react-loading-skeleton'
import s from './ProductPageSkeleton.module.scss'

export type ProductPageSkeletonProps = {
  className?: string
}

const ProductPageSkeleton: React.FC<ProductPageSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={cn(s['product-page-skeleton'], className)}>
      <div className={s['product-page-skeleton__img']}>
        <Skeleton />
      </div>
      <div className={s['product-page-skeleton__content']}>
        <div className={s['product-page-skeleton__text-box']}>
          <div className={s['product-page-skeleton__name']}>
            <Skeleton />
          </div>
          <div className={s['product-page-skeleton__description']}>
            <Skeleton count={5} />
          </div>
        </div>
        <div className={s['product-page-skeleton__price-box']}>
          <div className={s['product-page-skeleton__price']}>
            <Skeleton />
          </div>
          <div className={s['product-page-skeleton__buttons']}>
            <div className={s['product-page-skeleton_button']}>
              <Skeleton />
            </div>
            <div className={s['product-page-skeleton_button']}>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPageSkeleton

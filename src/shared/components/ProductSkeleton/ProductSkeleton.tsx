import cn from 'classnames'
import Skeleton from 'react-loading-skeleton'
import s from './ProductSkeleton.module.scss'

type ProductSkeletonProps = {
  className?: string
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ className }) => {
  return (
    <div className={cn(s['card-skeleton'], className)}>
      <div className={s['card-skeleton__img']}>
        <Skeleton />
      </div>
      <div className={s['card-skeleton__body']}>
        <div className={s['card-skeleton__wrapper']}>
          <div className={s['card-skeleton__text']}>
            <Skeleton />
          </div>
          <div className={s['card-skeleton__title']}>
            <Skeleton />
          </div>
          <div className={s['card-skeleton__subtitle']}>
            <Skeleton count={3} />
          </div>
        </div>
        <div className={s['card-skeleton__rows']}>
          <div className={s['card-skeleton__button']}>
            <Skeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton

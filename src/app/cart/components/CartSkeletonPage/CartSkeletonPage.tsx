import cn from 'classnames'
import Skeleton from 'react-loading-skeleton'
import CartProductSkeleton from '../CartProductSkeleton'
import s from './CartSkeletonPage.module.scss'

const CartSkeletonPage: React.FC = () => {
  const productsSkeletons = [...new Array(8)].map((_, id) => (
    <CartProductSkeleton key={id} />
  ))

  return (
    <div className={s['basket']}>
      <div className={s['basket__container']}>
        <div className={cn(s['basket__column'], s['basket__column_1'])}>
          <h2 className={s['basket__title']}>
            <Skeleton />
          </h2>
          <div className={s['basket__body']}>{productsSkeletons}</div>
        </div>
        <div className={cn(s['basket__column'], s['basket__column_2'])}>
          <div className={s['basket__wrapper']}>
            <div className={s['basket__counts']}>
              <div className={s['basket__counts-text']}>
                <Skeleton />
              </div>
              <div className={s['basket__counts-product']}>
                <Skeleton />
              </div>
            </div>
            <div className={s['basket__finals']}>
              <div className={s['basket__total-text']}>
                <Skeleton />
              </div>
              <div className={s['basket__total-price']}>
                <Skeleton />
              </div>
            </div>
            <div className={s['basket__button']}>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSkeletonPage

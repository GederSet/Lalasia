import Skeleton from 'react-loading-skeleton'
import s from './CartProductSkeleton.module.scss'

const CartProductSkeleton = () => {
  return (
    <div className={s['basket-product__product']}>
      <div className={s['basket-product__info']}>
        <div className={s['basket-product__img']}>
          <Skeleton />
        </div>
        <div className={s['basket-product__shell']}>
          <p className={s['basket-product__price']}>
            <Skeleton />
          </p>
          <div className={s['basket-product__name']}>
            <Skeleton />
          </div>
          <div className={s['basket-product__description']}>
            <Skeleton count={3} />
          </div>
          <div className={s['basket-product__icons']}>
            <div className={s['basket-product__trash']}>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
      <div className={s['basket-product__counter']}>
        <Skeleton />
      </div>
    </div>
  )
}

export default CartProductSkeleton

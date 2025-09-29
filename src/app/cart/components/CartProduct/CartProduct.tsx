import Text from '@components/Text'
import BasketDeleteIcon from '@components/icons/BasketDeleteIcon'
import { useRootStore } from '@shared/store/RootStore'
import Image from 'next/image'
import s from './CartProduct.module.scss'

type CartProductProps = {
  productId: number
  price: number
  name: string
  description: string
  count: number
  images: { id: number; url: string }[]
  onDelete: (productId: number) => void
}

const MAX_COUNT = 50
const MIN_COUNT = 1

const CartProduct: React.FC<CartProductProps> = ({
  productId,
  price,
  name,
  description,
  count,
  images,
  onDelete,
}) => {
  const rootStore = useRootStore()

  const handleDecrease = () => {
    if (count > MIN_COUNT) {
      rootStore.cart.decreaseCartQuantity(productId, 1)
    }
  }

  const handleIncrease = () => {
    if (count < MAX_COUNT) {
      rootStore.cart.updateCartQuantity(productId, 1)
    }
  }

  return (
    <div className={s['basket-product__product']}>
      <div className={s['basket-product__info']}>
        <div className={s['basket-product__img']}>
          <Image fill src={images[0]?.url} alt='product' />
        </div>
        <div className={s['basket-product__shell']}>
          <p className={s['basket-product__price']}>${price}</p>
          <Text maxLines={1} className={s['basket-product__name']}>
            {name}
          </Text>
          <Text maxLines={3} className={s['basket-product__description']}>
            {description}
          </Text>
          <div className={s['basket-product__icons']}>
            <button
              onClick={() => onDelete(productId)}
              className={s['basket-product__trash']}
            >
              <BasketDeleteIcon />
            </button>
          </div>
        </div>
      </div>
      <div className={s['basket-product__counter']}>
        <button
          disabled={count <= MIN_COUNT}
          onClick={handleDecrease}
          className={s['basket-product__counter-button']}
        >
          -
        </button>
        <div className={s['basket-product__count']}>{count}</div>
        <button
          disabled={count >= MAX_COUNT}
          onClick={handleIncrease}
          className={s['basket-product__counter-button']}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default CartProduct

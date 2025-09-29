import RootStore from '@shared/store/RootStore'
import { ProductAddCartType } from '@shared/types/ProductAddCartType'
export const addProductToBasket = (
  productInfo: ProductAddCartType,
  rootStore: RootStore
) => {
  if (!rootStore.auth.isAuthenticated) {
    alert('You are not logged in')
  } else {
    rootStore.cart.addToCart(productInfo)
  }
}

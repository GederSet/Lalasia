import AuthStore from './AuthStore'
import CartStore from './CartStore'
import QueryParamsStore from './QueryParamsStore'

export default class RootStore {
  readonly query: QueryParamsStore
  readonly auth: AuthStore
  readonly cart: CartStore

  constructor() {
    this.query = new QueryParamsStore()
    this.auth = new AuthStore(this)
    this.cart = new CartStore(this)
  }

  initClient() {
    this.auth.initFromStorage()
    if (this.auth.isAuthenticated) {
      this.cart.getCartProducts()
    }
  }
}

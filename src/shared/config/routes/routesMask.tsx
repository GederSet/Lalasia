export const routes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  products: {
    mask: '',
    create: () => '',
  },
  product: {
    mask: '/products/:id',
    create: (id: string) => `/products/${id}`,
  },
  categories: {
    mask: '/categories',
    create: () => '/categories',
  },
  aboutUs: {
    mask: '/aboutUs',
    create: () => '/aboutUs',
  },
  cart: {
    mask: '/cart',
    create: () => '/cart',
  },
  login: {
    mask: '/login',
    create: () => '/login',
  },
  register: {
    mask: '/register',
    create: () => '/register',
  },
}

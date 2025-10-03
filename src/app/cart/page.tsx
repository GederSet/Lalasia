import type { Metadata } from 'next'
import CartList from './CartList'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your shopping cart with selected items',
  openGraph: {
    title: 'Cart',
    description: 'Your shopping cart with selected items',
  },
}

export default function CartPage() {
  return <CartList />
}

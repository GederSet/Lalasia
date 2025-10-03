import CategoriesPageStore from '@shared/store/CategoriesStore'
import { CategoriesPageStoreContextProvider } from '@shared/store/CategoriesStore/CategoriesPageStoreProvider'
import type { Metadata } from 'next'
import CategoriesList from './CategoriesList'

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse all product categories and discover amazing products in each category.',
  keywords: 'categories, products, shopping, browse, discover',
}

export default async function CategoriesPage() {
  const categories = await CategoriesPageStore.getInitCategories()

  if (!categories) {
    throw new Error('Error')
  }

  const categoryItems = await CategoriesPageStore.getInitCategoryItems(
    categories
  )

  if (!categoryItems) {
    throw new Error('Error')
  }

  return (
    <CategoriesPageStoreContextProvider categoryItems={categoryItems}>
      <CategoriesList />
    </CategoriesPageStoreContextProvider>
  )
}

import { ProductsPageStoreContextProvider } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import ProductsPageStore from '@shared/store/ProductsStore'
import QueryParamsStore from '@shared/store/RootStore/QueryParamsStore'
import { SearchParams } from '@shared/types/SearchParamsType'
import type { Metadata } from 'next'
import ProductsList from './products/ProductsList'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Home page with all products',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const queryData = QueryParamsStore.getNormalizeQueryParams(await searchParams)

  const [products, allProducts, categories] = await Promise.all([
    ProductsPageStore.getInitProducts(queryData),
    ProductsPageStore.getInitAllProducts(),
    QueryParamsStore.getInitCategories(),
  ])

  if (!products || !categories || !allProducts) {
    throw new Error('Error')
  }

  const updatedQueryData = {
    ...queryData,
    pagination: {
      ...queryData.pagination,
      pageCount: products.meta.pagination.pageCount,
    },
  }

  return (
    <ProductsPageStoreContextProvider
      products={products}
      allProducts={allProducts}
      categories={categories}
      queryData={updatedQueryData}
    >
      <ProductsList />
    </ProductsPageStoreContextProvider>
  )
}

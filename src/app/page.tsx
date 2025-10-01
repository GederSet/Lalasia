import { ProductsPageStoreContextProvider } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import ProductsPageStore from '@shared/store/ProductsStore'
import QueryParamsStore from '@shared/store/RootStore/QueryParamsStore'
import { SearchParams } from '@shared/types/SearchParamsType'
import ProductsList from './ProductsList'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const queryData = QueryParamsStore.getNormalizeQueryParams(await searchParams)

  const [products, categories] = await Promise.all([
    ProductsPageStore.getInitProducts(queryData),
    QueryParamsStore.getInitCategories(),
  ])

  if (!products || !categories) {
    throw new Error('Error')
  }

  console.log('query', queryData)

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
      categories={categories}
      queryData={updatedQueryData}
    >
      <ProductsList />
    </ProductsPageStoreContextProvider>
  )
}

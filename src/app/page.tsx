import { ProductsPageStoreContextProvider } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import { useNormalizeSearchParams } from '@shared/utils/useNormalizeSearchParams'
import qs from 'qs'
import ProductsList from './ProductsList'

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  // нормализуем объект searchParams, чтобы хоть как-то можно было работать
  const normalized = useNormalizeSearchParams(searchParams)

  // делаем из объекта строку
  const queryString = new URLSearchParams(normalized).toString()

  // делаем из строки нормальный объект, с которым можно работать
  const parsed = qs.parse(queryString)

  const queryData = {
    params: parsed,
    currentPage: Number((parsed.pagination as any)?.page) || 1,
    pageSize: Number((parsed.pagination as any)?.pageSize) || 10,
  }

  return (
    <ProductsPageStoreContextProvider queryData={queryData}>
      <ProductsList />
    </ProductsPageStoreContextProvider>
  )
}

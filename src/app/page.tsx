import { ProductsPageStoreContextProvider } from '@/shared/store/ProductsStore/ProductsPageStoreProvider'
import { useNormalizeSearchParams } from '@shared/utils/useNormalizeSearchParams'
import qs from 'qs'
import ProductsList from './ProductsList'

export default function ProductsPage({ searchParams }: { searchParams: any }) {
  // нормализуем объект searchParams
  const normalized = useNormalizeSearchParams(searchParams)

  // превращаем в строку
  const queryString = new URLSearchParams(normalized).toString()

  // парсим обратно в объект
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

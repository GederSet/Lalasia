import { Option } from './OptionType'
import { PaginationApi } from './PaginationApiType'

export type QueryParamsTypes = {
  pagination: PaginationApi
  search?: string | undefined
  categories?: Option[] | undefined
}

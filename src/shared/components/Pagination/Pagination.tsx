import ArrowRoundIcon from '@components/icons/ArrowRoundedIcon'
import { useRootStore } from '@shared/store/RootStore'
import { getPaginationRange } from '@utils/getPaginationRange'
import cn from 'classnames'
import { useCallback } from 'react'
import s from './Pagination.module.scss'

type PaginationProps = {
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({ className }) => {
  const rootStore = useRootStore()

  const currentPage = rootStore.query.currentPage
  const totalPages = rootStore.query.pageCount

  const handlePageChange = useCallback(
    (page: number) => {
      rootStore.query.setPage(page)
    },
    [rootStore.query]
  )

  const handlePagePrev = () => {
    handlePageChange(currentPage - 1)
  }

  const handlePageNext = () => {
    handlePageChange(currentPage + 1)
  }

  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <div className={cn(s['pagination'], className)}>
      <div className={s['pagination__container']}>
        <div className={s['pagination__body']}>
          <button
            disabled={currentPage <= 1}
            onClick={handlePagePrev}
            className={cn(s['pagination__arrow'], s['pagination__arrow_left'])}
          >
            <ArrowRoundIcon />
          </button>

          <div className={s['pagination__rows']}>
            {pages.map((page, idx) =>
              page === 'dots' ? (
                <div key={`dots-${idx}`} className={s['pagination__dotted']}>
                  ...
                </div>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(s['pagination__number'], {
                    [s.pagination__number_active]: currentPage === page,
                  })}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={handlePageNext}
            className={cn(s['pagination__arrow'])}
          >
            <ArrowRoundIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination

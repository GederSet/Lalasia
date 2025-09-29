import { routes } from '@shared/config/routes/routesMask'
import Link from 'next/link'
import s from './NotFound.module.scss'

export default function NotFound() {
  return (
    <div className={s['not-found']}>
      <div className={s['not-found__title']}>404 — Page not found</div>
      <div className={s['not-found__text']}>
        Unfortunately, there is no such page.
      </div>
      <Link className={s['not-found__button']} href={routes.main.mask}>
        Go to homepage
      </Link>
    </div>
  )
}

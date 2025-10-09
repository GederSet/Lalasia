import { routes } from '@shared/config/routes/routesMask'
import Link from 'next/link'
import s from './NullFavorites.module.scss'

type NullFavoritesProps = {
  title: string
  text: string
}

const NullFavorites: React.FC<NullFavoritesProps> = ({ title, text }) => {
  return (
    <div className={s['empty-favorites']}>
      <div className={s['empty-favorites__title']}>{title}</div>
      <div className={s['empty-favorites__text']}>{text}</div>
      <Link className={s['empty-favorites__button']} href={routes.main.mask}>
        Go to homepage
      </Link>
    </div>
  )
}

export default NullFavorites

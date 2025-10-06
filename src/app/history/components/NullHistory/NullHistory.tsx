import { routes } from '@shared/config/routes/routesMask'
import Link from 'next/link'
import s from './NullHistory.module.scss'

type NullHistoryProps = {
  title: string
  text: string
}

const NullHistory: React.FC<NullHistoryProps> = ({ title, text }) => {
  return (
    <div className={s['empty-history']}>
      <div className={s['empty-history__title']}>{title}</div>
      <div className={s['empty-history__text']}>{text}</div>
      <Link className={s['empty-history__button']} href={routes.main.mask}>
        Go to homepage
      </Link>
    </div>
  )
}

export default NullHistory

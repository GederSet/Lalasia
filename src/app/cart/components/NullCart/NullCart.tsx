import { routes } from '@shared/config/routes/routesMask'
import Link from 'next/link'
import s from './NullCart.module.scss'

type NullCartProps = {
  title: string
  text: string
}

const NullCart: React.FC<NullCartProps> = ({ title, text }) => {
  return (
    <div className={s['empty-basket']}>
      <div className={s['empty-basket__title']}>{title}</div>
      <div className={s['empty-basket__text']}>{text}</div>
      <Link className={s['empty-basket__button']} href={routes.main.mask}>
        Go to homepage
      </Link>
    </div>
  )
}

export default NullCart

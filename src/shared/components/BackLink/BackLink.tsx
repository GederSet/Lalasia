'use client'

import ArrowDownIcon from '@components/icons/ArrowDownIcon'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import s from './BackLink.module.scss'

export type BackLinkProps = {
  className?: string
}

const BackLink: React.FC<BackLinkProps> = ({ className }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={cn(s['back-link'], className)}
    >
      <ArrowDownIcon className={s['back-link__arrow']} />
      <span className={s['back-link__text']}>Back</span>
    </button>
  )
}

export default BackLink

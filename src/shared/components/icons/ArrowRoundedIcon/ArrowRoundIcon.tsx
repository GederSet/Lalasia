import cn from 'classnames'
import * as React from 'react'
import Icon, { IconProps } from '../Icon'
import s from './ArrowRoundIcon.module.scss'

const ArrowRoundIcon: React.FC<IconProps> = ({ color, ...props }) => {
  return (
    <Icon {...props} viewBox='0 0 24 24'>
      <path
        xmlns='http://www.w3.org/2000/svg'
        d='M8.90997 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.90997 4.07999'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={cn(
          s['arrow-round-icon'],
          color && s[`arrow-round-icon_${color}`]
        )}
      />
    </Icon>
  )
}

export default ArrowRoundIcon

import cn from 'classnames'
import * as React from 'react'
import Icon, { IconProps } from '../Icon'
import s from './CheckIcon.module.scss'

const CheckIcon: React.FC<IconProps> = ({ color, ...props }) => {
  return (
    <Icon {...props} viewBox='0 0 24 24'>
      <path
        d='M4 11.6129L9.87755 18L20 7'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={cn(s['check-icon'], color && s[`check-icon_${color}`])}
      />
    </Icon>
  )
}

export default CheckIcon

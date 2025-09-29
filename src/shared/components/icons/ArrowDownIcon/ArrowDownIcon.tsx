import cn from 'classnames'
import * as React from 'react'
import Icon, { IconProps } from '../Icon'
import s from './ArrowDownIcon.module.scss'

const ArrowDownIcon: React.FC<IconProps> = ({ color, ...props }) => {
  return (
    <Icon {...props} viewBox='0 0 24 24'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.33563 8.74741L3.66436 7.25259L12 14.662L20.3356 7.25259L21.6644 8.74741L12 17.338L2.33563 8.74741Z'
        className={cn(
          s['arrow-down-icon'],
          color && s[`arrow-down-icon_${color}`]
        )}
      />
    </Icon>
  )
}

export default ArrowDownIcon

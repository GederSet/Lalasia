import { default as cn } from 'classnames'
import React from 'react'
import Loader from '../Loader'
import s from './Button.module.scss'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  children: React.ReactNode
  buttonStyle?: 'green' | 'transparent'
  loaderSize?: 'xs' | 's' | 'm' | 'l'
  loaderColor?: 'green' | 'white'
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled = false,
  className,
  children,
  onClick,
  buttonStyle = 'green',
  loaderSize = 's',
  loaderColor = 'white',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        s.button,
        s[`button_${buttonStyle}`],
        loading && s['button_loading'],
        disabled && s['button_disabled'],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      {loading && <Loader size={loaderSize} loaderColor={loaderColor} />}
    </button>
  )
}

export default Button

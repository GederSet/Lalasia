import cn from 'classnames'
import React from 'react'
import s from './ButtonCheckbox.module.scss'

export type ButtonCheckboxProps = {
  text: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

const ButtonCheckbox: React.FC<ButtonCheckboxProps> = ({
  text,
  checked,
  onChange,
  className,
}) => {
  const handleClick = () => {
    onChange(!checked)
  }

  return (
    <button
      type='button'
      aria-pressed={checked}
      onClick={handleClick}
      className={cn(
        s['button-checkbox'],
        checked ? s['button-checkbox_active'] : s['button-checkbox_inactive'],
        className
      )}
    >
      {text}
    </button>
  )
}

export default ButtonCheckbox

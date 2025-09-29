import cn from 'classnames'
import React, { useCallback, useState } from 'react'
import s from './Input.module.scss'

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string
  onChange: (value: string) => void
  afterSlot?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, ...restProps }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
      },
      [onChange]
    )

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        restProps.onFocus?.(event)
      },
      [restProps]
    )

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        restProps.onBlur?.(event)
      },
      [restProps]
    )

    const handleClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus()
      }
    }

    return (
      <div
        className={cn(
          s['custom-input'],
          isFocused && s['custom-input_focused'],
          className
        )}
        onClick={handleClick}
      >
        <div className={s['custom-input__shell']}>
          <input
            {...restProps}
            ref={ref}
            type='text'
            className={s['custom-input__input']}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {afterSlot && (
          <div className={s['custom-input__block']}>{afterSlot}</div>
        )}
      </div>
    )
  }
)

export default Input

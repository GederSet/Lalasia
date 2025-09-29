import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import Input from '../Input'
import ArrowDownIcon from '../icons/ArrowDownIcon'
import s from './MultiDropdown.module.scss'

export type Option = {
  key: string
  value: string
}

export type MultiDropdownProps = {
  className?: string
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
  disabled?: boolean
  getTitle: (value: Option[]) => string
}

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  disabled,
  onChange,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setInputValue('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (disabled) {
      setIsOpen(false)
      setInputValue('')
    }
  }, [disabled])

  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    if (!isOpen && !disabled) setIsOpen(true)
  }

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some((v) => v.key === option.key)
    if (isSelected) onChange(value.filter((v) => v.key !== option.key))
    else onChange([...value, option])
  }

  const displayValue = inputValue || (value.length > 0 ? getTitle(value) : '')
  const placeholder = value.length === 0 ? getTitle(value) : undefined

  return (
    <div
      className={cn(
        s['multi-dropdown'],
        isOpen && s['multi-dropdown_open'],
        className
      )}
      ref={dropdownRef}
    >
      <Input
        value={displayValue}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={placeholder}
        className={s['multi-dropdown__input']}
        onClick={() => {
          if (!disabled) setIsOpen(true)
        }}
        afterSlot={
          <ArrowDownIcon
            className={cn(
              s['multi-dropdown__icon'],
              isOpen && s['multi-dropdown__icon_active']
            )}
            color='secondary'
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) setIsOpen((prev) => !prev)
            }}
          />
        }
      />

      {isOpen && !disabled && (
        <div className={s['multi-dropdown__shell']}>
          <div className={s['multi-dropdown__dropdown']}>
            {filteredOptions.map((option) => {
              const isSelected = value.some((v) => v.key === option.key)
              return (
                <div
                  key={option.key}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    s['multi-dropdown__option'],
                    isSelected && s['multi-dropdown__option_selected']
                  )}
                >
                  {option.value}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiDropdown

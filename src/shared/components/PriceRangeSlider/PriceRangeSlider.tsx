'use client'

import Input from '@components/Input'
import Text from '@components/Text'
import cn from 'classnames'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState } from 'react'
import s from './PriceRangeSlider.module.scss'

export type PriceRangeSliderProps = {
  /** Дополнительный classname */
  className?: string
  /** Минимальная цена */
  min?: number
  /** Максимальная цена */
  max?: number
  /** Начальные значения [min, max] */
  defaultValue?: [number, number]
  /** Текущие значения [min, max] */
  value?: [number, number]
  /** Обработчик изменения значений */
  onChange?: (value: [number, number]) => void
  /** Обработчик завершения изменения */
  onChangeComplete?: (value: [number, number]) => void
  /** Шаг изменения */
  step?: number
  /** Отключен ли слайдер */
  disabled?: boolean
  /** Префикс для лейблов минимума/максимума (по умолчанию '$') */
  labelPrefix?: string
  /** Суффикс для лейблов минимума/максимума (по умолчанию '') */
  labelSuffix?: string
  /** Заголовок */
  title?: string
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  className,
  min = 0,
  max = 1000,
  defaultValue = [min, max],
  value,
  onChange,
  onChangeComplete,
  step = 1,
  disabled = false,
  labelPrefix = '$',
  labelSuffix = '',
  title,
}) => {
  const [internalValue, setInternalValue] = useState<[number, number]>(
    value || defaultValue
  )
  const [minInput, setMinInput] = useState<string>('')
  const [maxInput, setMaxInput] = useState<string>('')

  const sliderValue = internalValue
  const currentValue = value || internalValue

  useEffect(() => {
    if (value) {
      setMinInput(value[0].toString())
      setMaxInput(value[1].toString())
    }
  }, [value])

  useEffect(() => {
    if (value) {
      setInternalValue(value)
    }
  }, [value])

  const handleChange = (newValue: number | number[]) => {
    const rangeValue = newValue as [number, number]

    setInternalValue(rangeValue)
    setMinInput(rangeValue[0].toString())
    setMaxInput(rangeValue[1].toString())
  }

  const handleChangeComplete = (newValue: number | number[]) => {
    const rangeValue = newValue as [number, number]
    onChangeComplete?.(rangeValue)
  }

  const handleMinInputChange = (inputValue: string) => {
    setMinInput(inputValue)
    const parsed = parseInt(inputValue, 10)
    const numValue = Number.isNaN(parsed) ? min : parsed
    const newRange: [number, number] = [
      Math.max(min, Math.min(max, numValue)),
      currentValue[1],
    ]

    setInternalValue(newRange)
  }

  const handleMaxInputChange = (inputValue: string) => {
    setMaxInput(inputValue)
    const parsed = parseInt(inputValue, 10)
    const numValue = Number.isNaN(parsed) ? max : parsed
    const newRange: [number, number] = [
      currentValue[0],
      Math.max(min, Math.min(max, numValue)),
    ]

    setInternalValue(newRange)
  }

  const handleMinInputBlur = () => {
    const parsed = parseInt(minInput, 10)
    const numValue = Number.isNaN(parsed) ? min : parsed
    const newRange: [number, number] = [
      Math.max(min, Math.min(max, numValue)),
      currentValue[1],
    ]
    onChangeComplete?.(newRange)
  }

  const handleMaxInputBlur = () => {
    const parsed = parseInt(maxInput, 10)
    const numValue = Number.isNaN(parsed) ? max : parsed
    const newRange: [number, number] = [
      currentValue[0],
      Math.max(min, Math.min(max, numValue)),
    ]
    onChangeComplete?.(newRange)
  }

  return (
    <div className={cn(s['price-range-slider'], className)}>
      <p className={s['price-range-slider__header']}>{title}</p>
      <div className={s['price-range-slider__rows']}>
        <Input
          type='number'
          value={minInput}
          onChange={handleMinInputChange}
          onBlur={handleMinInputBlur}
          min={min}
          max={max}
          disabled={disabled}
          className={s['price-range-slider__input']}
        />
        <Input
          type='number'
          value={maxInput}
          onChange={handleMaxInputChange}
          onBlur={handleMaxInputBlur}
          min={min}
          max={max}
          disabled={disabled}
          className={s['price-range-slider__input']}
        />
      </div>

      <div className={s['price-range-slider__slider']}>
        <Slider
          range
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
          step={step}
          disabled={disabled}
          className={s['price-range-slider__range']}
        />
      </div>

      <div className={s['price-range-slider__labels']}>
        <Text tag='span' view='p-14' color='secondary'>
          {`${labelPrefix}${min}${labelSuffix}`}
        </Text>
        <Text tag='span' view='p-14' color='secondary'>
          {`${labelPrefix}${max}${labelSuffix}`}
        </Text>
      </div>
    </div>
  )
}

export default PriceRangeSlider

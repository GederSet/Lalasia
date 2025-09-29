import cn from 'classnames'
import * as React from 'react'
import s from './Text.module.scss'

export type TextProps = {
  /** Дополнительный класс */
  className?: string
  /** Стиль отображения */
  view?:
    | 'title'
    | 'button'
    | 'p-44'
    | 'p-32'
    | 'p-20'
    | 'p-18'
    | 'p-16'
    | 'p-14'
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span'
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold'
  /** Контент */
  children: React.ReactNode
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent'
  /** Максимальное кол-во строк */
  maxLines?: number
}

const Text: React.FC<TextProps> = ({
  className = '',
  view = 'p-16',
  tag: Tag = 'p',
  weight,
  children,
  color,
  maxLines,
  ...props
}) => {
  const style = maxLines
    ? ({ '--max-lines': maxLines } as React.CSSProperties)
    : undefined

  return (
    <Tag
      className={cn(
        s.text,
        view && s[`text_view_${view}`],
        weight && s[`text_weight_${weight}`],
        color && s[`text_color_${color}`],
        maxLines && s[`text_max-lines`],
        className
      )}
      style={style}
      data-testid='text'
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Text

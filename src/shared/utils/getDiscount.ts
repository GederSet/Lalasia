/**
 * Возвращает цену с учётом скидки.
 * @param price исходная цена товара
 * @param discountPercent процент скидки (например, 20 = 20%)
 * @returns цена со скидкой
 */
export function getDiscount(price: number, discountPercent: number): number {
  if (!price || discountPercent <= 0) return price
  const discounted = price - (price * discountPercent) / 100
  return Math.max(0, Math.round(discounted))
}

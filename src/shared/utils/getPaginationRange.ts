export const getPaginationRange = (
  currentPage: number,
  totalPages: number
): (number | 'dots')[] => {
  // тут отображаем, сколько соседних элементов может быть
  const delta = 1
  // это массив, который мапим
  const range: (number | 'dots')[] = []

  const left = Math.max(2, currentPage - delta)
  const right = Math.min(totalPages - 1, currentPage + delta)

  // всегда отображаем первый элемент
  range.push(1)

  // ставим точки влево если надо
  if (left > 2) {
    range.push('dots')
  }

  // это наши цифры между точками
  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  // ставим точки вправо если надо
  if (right < totalPages - 1) {
    range.push('dots')
  }

  // ставим последний элемент
  // (условие чтобы не дублировалось)
  if (totalPages > 1) {
    range.push(totalPages)
  }

  return range
}

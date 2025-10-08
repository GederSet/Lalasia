'use client'
import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(target: number, duration: number = 250) {
  const [value, setValue] = useState(target)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const start = value

    // тут храним разницу
    const diff = target - start

    // тут вычисляем количество шагов (при 250 это 15)
    const steps = Math.max(1, Math.ceil(duration / (1000 / 60)))

    // тут храним текущий шаг
    let currentStep = 0

    function animate() {
      currentStep++

      // тут у нас получается наше "бегающее" значение
      // которое при setValue рендерит значение компонента
      const next =
        currentStep >= steps ? target : start + (diff * currentStep) / steps

      setValue(Math.round(next))

      // Если текущий шаг меньше максимального количества
      // то запускаем анимацию снова
      if (currentStep < steps) {
        frame.current = requestAnimationFrame(animate)
      }
    }

    // отменяем возможную старую анимацию перед запуском новой
    if (frame.current) cancelAnimationFrame(frame.current)
    animate()

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration])

  return value
}

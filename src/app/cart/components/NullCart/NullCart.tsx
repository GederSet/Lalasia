'use client'

import { routes } from '@shared/config/routes/routesMask'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import s from './NullCart.module.scss'

type NullCartProps = {
  title: string
  text: string
}

const NullCart: React.FC<NullCartProps> = ({ title, text }) => {
  const leftEyeRef = useRef<HTMLDivElement | null>(null)
  const rightEyeRef = useRef<HTMLDivElement | null>(null)
  const [leftPupil, setLeftPupil] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [rightPupil, setRightPupil] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const update = (
        el: HTMLDivElement | null,
        set: (v: { x: number; y: number }) => void
      ) => {
        const rect = el?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const maxMove = 6
        const nx = Math.max(-1, Math.min(1, dx / (rect.width / 2)))
        const ny = Math.max(-1, Math.min(1, dy / (rect.height / 2)))
        set({ x: nx * maxMove, y: ny * maxMove })
      }
      update(leftEyeRef.current, setLeftPupil)
      update(rightEyeRef.current, setRightPupil)
    }
    const handleMouseLeave = () => {
      setLeftPupil({ x: 0, y: 0 })
      setRightPupil({ x: 0, y: 0 })
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className={s['empty-basket']}>
      <div className={s['empty-basket__eyes']} aria-hidden>
        <div className={s.eye} ref={leftEyeRef}>
          <div
            className={s['eye__pupil']}
            style={{
              ['--dx' as any]: `${leftPupil.x}px`,
              ['--dy' as any]: `${leftPupil.y}px`,
            }}
          />
        </div>
        <div className={s.eye} ref={rightEyeRef}>
          <div
            className={s['eye__pupil']}
            style={{
              ['--dx' as any]: `${rightPupil.x}px`,
              ['--dy' as any]: `${rightPupil.y}px`,
            }}
          />
        </div>
      </div>
      <div className={s['empty-basket__title']}>{title}</div>
      <div className={s['empty-basket__text']}>{text}</div>
      <Link className={s['empty-basket__button']} href={routes.main.mask}>
        Go to homepage
      </Link>
    </div>
  )
}

export default NullCart

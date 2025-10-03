'use client'

import { useEffect, useState } from 'react'

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 425)
    }

    // Проверяем при первой загрузке
    checkDevice()

    window.addEventListener('resize', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return {
    isMobile,
    isDesktop: !isMobile,
  }
}

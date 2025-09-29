'use client'

import cn from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type CustomLinkProps = {
  href: string
  className?: string
  activeClassName?: string
  children: React.ReactNode
  onClick?: () => void
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  className,
  activeClassName,
  onClick,
}) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  )
}

export default CustomLink

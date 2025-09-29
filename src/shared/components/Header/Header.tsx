'use client'

import CustomLink from '@components/CustomLink'
import LogoIcon from '@components/icons/Logo'
import { routes } from '@config/routes/routesMask'
import Popup from '@shared/components/Popup'
import { Meta } from '@shared/config/meta'
import { useRootStore } from '@shared/store/RootStore'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import BasketIcon from '../icons/BasketIcon'
import LogoutIcon from '../icons/LogoutIcon'
import UserIcon from '../icons/UserIcon'
import Loader from '../Loader'
import s from './Header.module.scss'

const menuItems = [
  { label: 'Products', to: routes.main.mask },
  { label: 'Categories', to: routes.categories.mask },
  { label: 'About us', to: routes.aboutUs.mask },
]

const Header: React.FC = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const router = useRouter()
  const rootStore = useRootStore()

  const toggleMenu = useCallback(() => {
    setIsMenuActive((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuActive(false)
  }, [])

  useEffect(() => {
    if (isMenuActive) {
      document.body.classList.add('_lock')
    } else {
      document.body.classList.remove('_lock')
    }
    return () => document.body.classList.remove('_lock')
  }, [isMenuActive])

  const handleLogout = () => {
    setIsPopupOpen(true)
  }

  const handleConfirmLogout = () => {
    rootStore.auth.logout()
    setIsPopupOpen(false)
    closeMenu()
    router.push(routes.main.mask)
  }

  const handleCancelLogout = () => {
    setIsPopupOpen(false)
  }

  return (
    <>
      <header className={s.header}>
        <div className={s.header__container}>
          <div className={s.header__logo}>
            <Link href={routes.main.mask}>
              <LogoIcon width={131} height={42} />
            </Link>
          </div>
          <nav
            className={cn(s.header__menu, s.menu, {
              [s._active]: isMenuActive,
            })}
          >
            <ul className={s.menu__list}>
              {menuItems.map((item) => (
                <li key={item.to} className={s.menu__item}>
                  <CustomLink
                    className={s.menu__link}
                    activeClassName={s.menu__link_active}
                    href={item.to}
                    onClick={closeMenu}
                  >
                    <div>{item.label}</div>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.header__rows}>
            <Link
              className={s.header__cart}
              href={routes.cart.mask}
              onClick={closeMenu}
            >
              {rootStore.cart.totalCount > 0 && (
                <span className={s.header__count}>
                  {rootStore.cart.meta === Meta.loading ? (
                    <Loader loaderColor='white' size='xs' />
                  ) : (
                    rootStore.cart.totalCount
                  )}
                </span>
              )}
              <BasketIcon width={30} height={30} />
            </Link>
            {rootStore.auth.isAuthenticated ? (
              <div className={s.header__logout} onClick={handleLogout}>
                <LogoutIcon width={30} height={30} />
              </div>
            ) : (
              <Link href={routes.login.mask} onClick={closeMenu}>
                <UserIcon width={30} height={30} />
              </Link>
            )}
            <div
              className={cn(s['header__menu-burger'], s['menu-burger'], {
                [s._active]: isMenuActive,
              })}
              onClick={toggleMenu}
            >
              <span className={s['menu-burger__line']}></span>
              <span className={s['menu-burger__line']}></span>
              <span className={s['menu-burger__line']}></span>
            </div>
          </div>
        </div>
      </header>

      <Popup
        isOpen={isPopupOpen}
        title='Logout'
        description='Are you sure you want to log out?'
        type='confirm'
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  )
}

export default observer(Header)

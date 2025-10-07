'use client'

import cn from 'classnames'
import { useState } from 'react'
import s from './Settings.module.scss'
import PasswordSettings from './components/PasswordSettings'
import ProfileSettings from './components/ProfileSettings'

type SettingsSection = 'profile' | 'password'

const SettingsPage: React.FC = () => {
  const [active, setActive] = useState<SettingsSection>('profile')

  return (
    <section className={s.settings}>
      <div className={s.settings__container}>
        <h1 className={s.settings__title}>Settings</h1>

        <div className={s.settings__grid}>
          <aside className={s.settings__sidebar}>
            <button
              className={cn(s.settings__tab, {
                [s.settings__tab_active]: active === 'profile',
              })}
              onClick={() => setActive('profile')}
            >
              Profile
            </button>
            <button
              className={cn(s.settings__tab, {
                [s.settings__tab_active]: active === 'password',
              })}
              onClick={() => setActive('password')}
            >
              Password
            </button>
          </aside>

          <div className={s.settings__content}>
            {active === 'profile' ? <ProfileSettings /> : <PasswordSettings />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage

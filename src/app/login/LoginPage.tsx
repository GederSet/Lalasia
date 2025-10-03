'use client'

import Button from '@components/Button'
import { routes } from '@config/routes/routesMask'
import { TextField } from '@mui/material'
import { useRootStore } from '@shared/store/RootStore'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import s from './Login.module.scss'

interface IFormInput {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  const rootStore = useRootStore()
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: 'onChange' })

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    setLoginError(null)
    try {
      await rootStore.auth.login({
        identifier: formData.username.trim(),
        password: formData.password.trim(),
      })

      if (rootStore.auth.isAuthenticated) {
        router.replace(routes.main.mask)
      }
    } catch (err: any) {
      console.error('Ошибка при логине', err)
      const message =
        err?.response?.data?.error?.message || 'Invalid username or password'
      setLoginError(message)
    }
  }

  return (
    <section className={s.login}>
      <div className={s.login__container}>
        <form onSubmit={handleSubmit(onSubmit)} className={s.login__body}>
          <h1 className={s.login__title}>Sign in</h1>

          <TextField
            error={Boolean(errors.username?.message)}
            helperText={errors.username?.message}
            {...register('username', { required: 'Enter a name' })}
            label='username'
            className={s.login__input}
            fullWidth
          />

          <TextField
            type='password'
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', { required: 'Enter a password' })}
            label='password'
            className={s.login__input}
            fullWidth
          />

          {loginError && <div className={s.login__error}>{loginError}</div>}

          <Button className={s.login__button}>Sign in</Button>
          <Link href={routes.register.mask} className={s.login__link}>
            Sign up
          </Link>
        </form>
      </div>
    </section>
  )
}

export default observer(LoginPage)

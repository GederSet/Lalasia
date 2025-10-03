'use client'

import Button from '@components/Button'
import { routes } from '@config/routes/routesMask'
import { TextField } from '@mui/material'
import { Meta } from '@shared/config/meta'
import { useRootStore } from '@shared/store/RootStore'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import s from './Register.module.scss'

interface IFormInput {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

const RegisterPage: React.FC = () => {
  const rootStore = useRootStore()
  const router = useRouter()
  const [registrationError, setRegistrationError] = React.useState<string>('')

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: 'onChange' })

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    const { passwordConfirmation, ...data } = formData

    const trimmedData = {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    }

    setRegistrationError('')
    try {
      await rootStore.auth.register(trimmedData)
      if (rootStore.auth.meta === Meta.success) {
        router.replace(routes.main.mask)
      }
    } catch (err: any) {
      console.error('Error during registration', err)
      const message =
        err?.response?.data?.error?.message ||
        'username or email is already in use'
      setRegistrationError(message)
    }
  }

  return (
    <section className={s.registration}>
      <div className={s.registration__container}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={s.registration__body}
        >
          <h1 className={s.registration__title}>Sign up</h1>

          <TextField
            error={Boolean(errors.username?.message)}
            helperText={errors.username?.message}
            {...register('username', {
              required: 'Enter a name',
              minLength: { value: 2, message: 'Minimum of 2 characters' },
              maxLength: { value: 30, message: 'Maximum of 30 characters' },
            })}
            label='Username'
            className={s.registration__input}
            fullWidth
          />

          <TextField
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Enter your email address',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter the correct email address',
              },
            })}
            label='Email'
            className={s.registration__input}
            fullWidth
          />

          <TextField
            type='password'
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Enter a password',
              minLength: { value: 5, message: 'Minimum of 5 characters' },
              maxLength: { value: 30, message: 'Maximum of 30 characters' },
            })}
            label='Password'
            className={s.registration__input}
            fullWidth
          />

          <TextField
            type='password'
            error={Boolean(errors.passwordConfirmation?.message)}
            helperText={errors.passwordConfirmation?.message}
            {...register('passwordConfirmation', {
              required: 'Repeat the password',
              validate: (value) =>
                value === watch('password') || `Passwords don't match`,
            })}
            label='Repeat the password'
            className={s.registration__input}
            fullWidth
          />

          {registrationError && (
            <div className={s.registration__error}>{registrationError}</div>
          )}

          <Button className={s.registration__button} type='submit'>
            Sign up
          </Button>

          <Link href={routes.login.mask} className={s.registration__link}>
            Sign in
          </Link>
        </form>
      </div>
    </section>
  )
}

export default observer(RegisterPage)

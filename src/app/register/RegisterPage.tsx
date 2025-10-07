'use client'

import Button from '@components/Button'
import { routes } from '@config/routes/routesMask'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import EyeIcon from '@shared/components/icons/EyeIcon'
import { Meta } from '@shared/config/meta'
import { useRootStore } from '@shared/store/RootStore'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
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
  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false)
  const [avatar, setAvatar] = React.useState<string>('/noavatar.png')
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const getAvatarKeyByEmail = (email: string) =>
    `_avatar_${email.trim().toLowerCase()}`

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    setAvatar('/noavatar.png')
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (result) {
        setAvatar(result)
        if (typeof window !== 'undefined') {
          const emailValue = watch('email')
          if (emailValue) {
            const key = getAvatarKeyByEmail(emailValue)
            localStorage.setItem(key, result)
            // dispatchEvent связывает все
            // слушатели в window
            window.dispatchEvent(
              // тут просто создаем свое событие
              new CustomEvent('avatar:update', {
                detail: { key, value: result },
              })
            )
          }
        }
      }
    }
    reader.readAsDataURL(file)

    // удаляем картинку, чтобы при повторе записывалась
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAvatar('/noavatar.png')
    if (typeof window !== 'undefined') {
      const emailValue = watch('email')
      if (emailValue) {
        const key = getAvatarKeyByEmail(emailValue)
        localStorage.removeItem(key)
        window.dispatchEvent(
          new CustomEvent('avatar:update', { detail: { key, value: '' } })
        )
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
        if (typeof window !== 'undefined' && avatar) {
          const key = getAvatarKeyByEmail(trimmedData.email)
          localStorage.setItem(key, avatar)
          window.dispatchEvent(
            new CustomEvent('avatar:update', { detail: { key, value: avatar } })
          )
        }
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

          <div className={s.registration__avatarBlock}>
            {avatar !== '/noavatar.png' && (
              <button
                type='button'
                className={s.registration__avatarRemoveBtn}
                onClick={handleAvatarClear}
                aria-label='Remove avatar'
              >
                ×
              </button>
            )}
            <div
              className={s.registration__avatarWrapper}
              onClick={openFileDialog}
              role='button'
              aria-label='Upload avatar'
            >
              <Image
                src={avatar}
                alt='User avatar'
                fill
                sizes='56px'
                className={s.registration__avatarImg}
                priority
              />
            </div>
            <input
              ref={fileInputRef}
              className={s.registration__avatarInput}
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
            />
          </div>

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
            type={showPassword ? 'text' : 'password'}
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end' sx={{ ml: 0, mr: 1 }}>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword((v) => !v)}
                      edge='end'
                    >
                      <span className={cn(s['registration__line-body'])}>
                        <span
                          className={cn(s['registration__line'], {
                            [s['registration__line_active']]: showPassword,
                          })}
                        ></span>
                      </span>
                      <EyeIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            type={showPasswordRepeat ? 'text' : 'password'}
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
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end' sx={{ ml: 0, mr: 1 }}>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPasswordRepeat((v) => !v)}
                      edge='end'
                    >
                      <span className={cn(s['registration__line-body'])}>
                        <span
                          className={cn(s['registration__line'], {
                            [s['registration__line_active']]:
                              showPasswordRepeat,
                          })}
                        ></span>
                      </span>
                      <EyeIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
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

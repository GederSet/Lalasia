'use client'

import Button from '@components/Button'
import { TextField } from '@mui/material'
import { useRootStore } from '@shared/store/RootStore'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import s from './ProfileSettings.module.scss'

type UsernameFormInputs = { username: string }
type EmailFormInputs = { email: string }

const ProfileSettings: React.FC = () => {
  const rootStore = useRootStore()
  const user = rootStore.auth.currentUser

  const [usernameSuccess, setUsernameSuccess] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [avatar, setAvatar] = useState<string>('/noavatar.png')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const getAvatarKeyByEmail = (email: string) =>
    `_avatar_${email.trim().toLowerCase()}`

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: errorsUsername },
    reset: resetUsernameForm,
    setError: setErrorUsername,
    watch: watchUsernameForm,
  } = useForm<UsernameFormInputs>({
    mode: 'onChange',
    defaultValues: { username: user?.username ?? '' },
  })

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
    reset: resetEmailForm,
    setError: setErrorEmail,
    watch: watchEmailForm,
  } = useForm<EmailFormInputs>({
    mode: 'onChange',
    defaultValues: { email: user?.email ?? '' },
  })

  const onSubmitUsername = async (data: UsernameFormInputs) => {
    try {
      setUsernameSuccess(false)
      await rootStore.auth.updateUsername(data.username.trim())
      setUsernameSuccess(true)
    } catch (err: any) {
      const message = err?.message || 'Failed to update username'
      setErrorUsername('username', { type: 'server', message })
    }
  }

  const onSubmitEmail = async (data: EmailFormInputs) => {
    try {
      setEmailSuccess(false)
      const newEmail = data.email.trim()
      const oldEmail = user?.email
      await rootStore.auth.updateEmail(newEmail)
      // перенос аватара: со старого ключа на новый
      if (typeof window !== 'undefined' && avatar) {
        const oldKey = oldEmail ? getAvatarKeyByEmail(oldEmail) : null
        const newKey = getAvatarKeyByEmail(newEmail)
        localStorage.setItem(newKey, avatar)
        if (oldKey && oldKey !== newKey) localStorage.removeItem(oldKey)
        window.dispatchEvent(
          new CustomEvent('avatar:update', {
            detail: { key: newKey, value: avatar },
          })
        )
      }
      setEmailSuccess(true)
    } catch (err: any) {
      const message = err?.message || 'Failed to update email'
      setErrorEmail('email', { type: 'server', message })
    }
  }

  useEffect(() => {
    if (user) {
      resetUsernameForm({ username: user.username || '' })
      resetEmailForm({ email: user.email || '' })
      if (typeof window !== 'undefined' && user.email) {
        const key = getAvatarKeyByEmail(user.email)
        const saved = localStorage.getItem(key)
        setAvatar(saved || '/noavatar.png')
      }
    }
  }, [user, resetUsernameForm, resetEmailForm])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAvatar('/noavatar.png')
    if (typeof window !== 'undefined' && user?.email) {
      const key = getAvatarKeyByEmail(user.email)
      localStorage.removeItem(key)
      window.dispatchEvent(
        new CustomEvent('avatar:update', { detail: { key, value: '' } })
      )
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (result) {
        setAvatar(result)
        if (typeof window !== 'undefined' && user?.email) {
          const key = getAvatarKeyByEmail(user.email)
          localStorage.setItem(key, result)
          window.dispatchEvent(
            new CustomEvent('avatar:update', { detail: { key, value: result } })
          )
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={s.profile}>
      <h2 className={s.profile__title}>Profile</h2>

      <div className={s.profile__avatarBlock}>
        {avatar !== '/noavatar.png' && (
          <button
            type='button'
            className={s.profile__avatarRemoveBtn}
            onClick={handleAvatarRemove}
            aria-label='Remove avatar'
          >
            ×
          </button>
        )}
        <div
          className={s.profile__avatarWrapper}
          onClick={handleAvatarClick}
          role='button'
          aria-label='Upload avatar'
        >
          <Image
            src={avatar}
            alt='User avatar'
            fill
            sizes='56px'
            className={s.profile__avatarImg}
            priority
          />
        </div>
        <input
          ref={fileInputRef}
          className={s.profile__avatarInput}
          type='file'
          accept='image/*'
          onChange={handleAvatarChange}
        />
      </div>
      <form
        className={s.profile__form}
        onSubmit={handleSubmitUsername(onSubmitUsername)}
      >
        <TextField
          className={s.profile__input}
          label='Username'
          error={Boolean(errorsUsername.username?.message)}
          helperText={errorsUsername.username?.message}
          slotProps={{
            inputLabel: { shrink: Boolean(watchUsernameForm('username')) },
          }}
          {...registerUsername('username', {
            required: 'Enter username',
            minLength: { value: 3, message: 'Minimum of 3 characters' },
            maxLength: { value: 30, message: 'Maximum of 30 characters' },
          })}
          fullWidth
          margin='none'
        />
        <Button className={s.profile__button} type='submit'>
          Save
        </Button>
      </form>
      {usernameSuccess && (
        <div className={s.profile__success}>Username updated successfully</div>
      )}

      <form
        className={s.profile__form}
        onSubmit={handleSubmitEmail(onSubmitEmail)}
      >
        <TextField
          className={s.profile__input}
          label='Email'
          error={Boolean(errorsEmail.email?.message)}
          helperText={errorsEmail.email?.message}
          slotProps={{
            inputLabel: { shrink: Boolean(watchEmailForm('email')) },
          }}
          {...registerEmail('email', {
            required: 'Enter email',
            pattern: {
              value:
                /^(?:[a-zA-Z0-9_!#$%&'*+\/=?`{|}~^.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
              message: 'Enter valid email',
            },
          })}
          fullWidth
          margin='none'
        />
        <Button className={s.profile__button} type='submit'>
          Save
        </Button>
      </form>
      {emailSuccess && (
        <div className={s.profile__success}>Email updated successfully</div>
      )}
    </div>
  )
}

export default ProfileSettings

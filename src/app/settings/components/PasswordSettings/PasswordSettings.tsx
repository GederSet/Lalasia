'use client'

import Button from '@components/Button'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import EyeIcon from '@shared/components/icons/EyeIcon'
import { useRootStore } from '@shared/store/RootStore'
import cn from 'classnames'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import s from './PasswordSettings.module.scss'

type FormInputs = {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

const PasswordSettings: React.FC = () => {
  const rootStore = useRootStore()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormInputs>({ mode: 'onChange' })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    clearErrors()
    setIsSuccess(false)

    if (data.password === data.currentPassword) {
      setError('password', {
        type: 'validate',
        message:
          'Your new password must be different than your current password',
      })
      return
    }

    try {
      setIsSubmitting(true)
      await rootStore.auth.changePassword({
        currentPassword: data.currentPassword,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })
      setIsSuccess(true)
    } catch (e) {
      setError('currentPassword', {
        type: 'validate',
        message: 'The provided current password is invalid',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={s.password} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={s.password__title}>Password</h2>
      <TextField
        className={s.password__input}
        type={showCurrent ? 'text' : 'password'}
        label='Current password'
        error={Boolean(errors.currentPassword?.message)}
        helperText={errors.currentPassword?.message}
        {...register('currentPassword', {
          required: 'Enter current password',
        })}
        fullWidth
        margin='none'
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position='end' sx={{ ml: 0, mr: 1 }}>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowCurrent((v) => !v)}
                  edge='end'
                >
                  <span className={cn(s['password__line-body'])}>
                    <span
                      className={cn(s['password__line'], {
                        [s['password__line_active']]: showCurrent,
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
        className={s.password__input}
        type={showNew ? 'text' : 'password'}
        label='New password'
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', {
          required: 'Enter new password',
          minLength: { value: 5, message: 'Minimum of 5 characters' },
        })}
        fullWidth
        margin='none'
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position='end' sx={{ ml: 0, mr: 1 }}>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowNew((v) => !v)}
                  edge='end'
                >
                  <span className={cn(s['password__line-body'])}>
                    <span
                      className={cn(s['password__line'], {
                        [s['password__line_active']]: showNew,
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
        className={s.password__input}
        type={showRepeat ? 'text' : 'password'}
        label='Repeat new password'
        error={Boolean(errors.passwordConfirmation?.message)}
        helperText={errors.passwordConfirmation?.message}
        {...register('passwordConfirmation', {
          required: 'Repeat new password',
          validate: (value) =>
            value === watch('password') || 'Passwords do not match',
        })}
        fullWidth
        margin='none'
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position='end' sx={{ ml: 0, mr: 1 }}>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => setShowRepeat((v) => !v)}
                  edge='end'
                >
                  <span className={cn(s['password__line-body'])}>
                    <span
                      className={cn(s['password__line'], {
                        [s['password__line_active']]: showRepeat,
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
      {isSuccess && (
        <div className={s.password__success}>Password changed successfully</div>
      )}
      <Button
        className={s.password__button}
        type='submit'
        disabled={isSubmitting}
      >
        Save
      </Button>
    </form>
  )
}

export default PasswordSettings

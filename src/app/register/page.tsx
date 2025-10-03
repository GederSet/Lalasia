import type { Metadata } from 'next'
import RegisterPage from './RegisterPage'

export const metadata: Metadata = {
  title: 'Sign up',
  description:
    'Create your Lalasia account to start shopping and managing your orders.',
  keywords: 'register, sign up, create account, registration, Lalasia',
}

export default function Register() {
  return <RegisterPage />
}

import type { Metadata } from 'next'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to your Lalasia account to access your personal dashboard and manage your orders.',
  keywords: 'login, sign in, authentication, account, Lalasia',
}

export default function Login() {
  return <LoginPage />
}

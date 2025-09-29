import { RootStoreProvider } from '@/shared/store/RootStore'
import Header from '@shared/components/Header'
import '@shared/styles/adaptiveVars.scss'
import '@shared/styles/index.scss'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const roboto = Roboto({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lalasia',
  description: 'Website for the sale of goods',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SkeletonTheme baseColor='#d9d9d9' highlightColor='#bababa'>
      <html lang='en'>
        <body className={`${roboto.className}`}>
          <RootStoreProvider>
            <Header />
            {children}
          </RootStoreProvider>
        </body>
      </html>
    </SkeletonTheme>
  )
}

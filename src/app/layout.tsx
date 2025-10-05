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
    <RootStoreProvider>
      <SkeletonTheme baseColor='#d9d9d9' highlightColor='#bababa'>
        <html lang='en' suppressHydrationWarning>
          <body className={`${roboto.className}`} suppressHydrationWarning>
            <div style={{ overflowX: 'hidden' }}>
              <Header />
              {children}
            </div>
          </body>
        </html>
      </SkeletonTheme>
    </RootStoreProvider>
  )
}

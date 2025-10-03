import type { Metadata } from 'next'
import AboutUsPage from './AboutUsPage'

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Learn more about Lalasia, your reliable partner for quality products. Our mission, values and vision for the future.',
  keywords: 'about us, company, mission, values, Lalasia, Quality, customers',
}

export default function AboutUs() {
  return <AboutUsPage />
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@landup/ui/globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LandUp! — AI Quiz Funnel Builder',
  description:
    'Create mobile-first quiz funnels that qualify leads and book appointments. AI-powered personalisation in minutes.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

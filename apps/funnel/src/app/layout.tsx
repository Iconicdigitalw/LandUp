import type { Metadata } from 'next'
import '@landup/ui/globals.css'

export const metadata: Metadata = {
  title: 'LandUp!',
  description: 'Your personalised quiz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

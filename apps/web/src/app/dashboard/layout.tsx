import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-brand-bg-light">
      <DashboardNav user={session.user} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

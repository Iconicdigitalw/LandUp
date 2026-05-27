import { auth } from '@/lib/auth'
import { prisma } from '@landup/db'
import { FunnelGrid } from '@/components/dashboard/funnel-grid'
import { CreateFunnelButton } from '@/components/dashboard/create-funnel-button'
import { BarChart3, Users, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [funnels, totalLeads] = await Promise.all([
    prisma.funnel.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { leads: true, pageViews: true } } },
    }),
    prisma.lead.count({ where: { funnel: { userId } } }),
  ])

  const publishedCount = funnels.filter((f) => f.status === 'PUBLISHED').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Your Funnels</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build, publish, and track your quiz funnels
          </p>
        </div>
        <CreateFunnelButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Funnels', value: funnels.length, icon: Zap },
          { label: 'Published', value: publishedCount, icon: BarChart3 },
          { label: 'Total Leads', value: totalLeads, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-bg-light rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-dark" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel grid */}
      <FunnelGrid funnels={funnels} />
    </div>
  )
}

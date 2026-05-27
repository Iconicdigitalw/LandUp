'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Edit2, ExternalLink, MoreHorizontal, Trash2, Users, BarChart2 } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@landup/ui'
import type { Funnel, FunnelStatus } from '@landup/db'
import { CreateFunnelButton } from './create-funnel-button'

type FunnelWithCounts = Funnel & {
  _count: { leads: number; pageViews: number }
}

const statusVariant: Record<FunnelStatus, 'published' | 'draft' | 'archived'> = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
}

interface FunnelGridProps {
  funnels: FunnelWithCounts[]
}

export function FunnelGrid({ funnels }: FunnelGridProps) {
  if (funnels.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Create your first funnel</h2>
        <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
          Pick a template or start from scratch. Your first lead is minutes away.
        </p>
        <CreateFunnelButton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {funnels.map((funnel) => (
        <Card key={funnel.id} className="hover:shadow-md transition-shadow group">
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-dark truncate pr-2">{funnel.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Updated {formatDistanceToNow(new Date(funnel.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/editor/${funnel.id}`}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {funnel.status === 'PUBLISHED' && (
                    <DropdownMenuItem asChild>
                      <a href={`${process.env.NEXT_PUBLIC_FUNNEL_URL}/f/${funnel.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View live
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {funnel._count.leads} leads
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5" />
                {funnel._count.pageViews} views
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <Badge variant={statusVariant[funnel.status]}>
                {funnel.status.toLowerCase()}
              </Badge>
              <Link href={`/editor/${funnel.id}`}>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

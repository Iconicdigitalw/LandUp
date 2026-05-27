import { notFound } from 'next/navigation'
import { FunnelRenderer } from '@/components/funnel-renderer'
import type { PublishedFunnel } from '@landup/types'

const WEB_URL = process.env.WEB_APP_URL ?? 'http://localhost:3000'

interface FunnelPageProps {
  params: { slug: string }
  searchParams: { preview?: string }
}

export default async function FunnelPage({ params, searchParams }: FunnelPageProps) {
  // Fetch funnel data from the web app API
  const res = await fetch(`${WEB_URL}/api/funnels/by-slug/${params.slug}`, {
    next: { revalidate: 30 },
  })

  if (!res.ok) notFound()

  const funnel: PublishedFunnel = await res.json()
  const isPreview = searchParams.preview === '1'

  return <FunnelRenderer funnel={funnel} isPreview={isPreview} />
}

export async function generateMetadata({ params }: FunnelPageProps) {
  const res = await fetch(`${WEB_URL}/api/funnels/by-slug/${params.slug}`)
  if (!res.ok) return {}
  const funnel: PublishedFunnel = await res.json()
  return { title: funnel.name }
}

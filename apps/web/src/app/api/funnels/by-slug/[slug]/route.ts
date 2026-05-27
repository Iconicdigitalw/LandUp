import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@landup/db'

interface Params { params: { slug: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const funnel = await prisma.funnel.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      pages: { orderBy: { order: 'asc' } },
      theme: true,
    },
  })

  if (!funnel) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Shape as PublishedFunnel
  const published = {
    id: funnel.id,
    name: funnel.name,
    slug: funnel.slug,
    theme: {
      primaryColor: funnel.theme?.primaryColor ?? '#34386a',
      accentColor: funnel.theme?.accentColor ?? '#a5185e',
      bgLight: funnel.theme?.bgLight ?? '#f6f5ff',
      bgDarker: funnel.theme?.bgDarker ?? '#ecebf7',
      fontFamily: funnel.theme?.fontFamily ?? 'Inter',
      borderRadius: funnel.theme?.borderRadius ?? '12px',
      ...((funnel.themeOverrides as object) ?? {}),
    },
    pages: funnel.pages.map((p) => ({
      id: p.id,
      funnelId: p.funnelId,
      order: p.order,
      name: p.name,
      type: p.type,
      isResult: p.isResult,
      minScore: p.minScore,
      maxScore: p.maxScore,
      blocks: Array.isArray(p.blocks) ? p.blocks : [],
    })),
    backButtonEnabled: funnel.backButton,
    webhookUrl: funnel.webhookUrl ?? undefined,
  }

  return NextResponse.json(published)
}

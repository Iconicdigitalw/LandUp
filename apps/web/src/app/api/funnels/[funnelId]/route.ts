import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@landup/db'

interface Params { params: { funnelId: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const funnel = await prisma.funnel.findFirst({
    where: { id: params.funnelId, userId: session.user.id },
    include: { pages: { orderBy: { order: 'asc' } }, theme: true },
  })

  if (!funnel) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(funnel)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { pages, name, status, webhookUrl, backButton } = body

  // Verify ownership
  const existing = await prisma.funnel.findFirst({
    where: { id: params.funnelId, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update funnel + upsert pages
  const funnel = await prisma.$transaction(async (tx) => {
    if (pages) {
      // Delete existing pages and recreate (simpler than upsert for now)
      await tx.page.deleteMany({ where: { funnelId: params.funnelId } })
      await tx.page.createMany({
        data: pages.map((p: { order: number; name: string; type: string; isResult?: boolean; minScore?: number; maxScore?: number; blocks: object[] }, i: number) => ({
          funnelId: params.funnelId,
          order: i,
          name: p.name,
          type: p.type,
          isResult: p.isResult ?? false,
          minScore: p.minScore,
          maxScore: p.maxScore,
          blocks: p.blocks,
        })),
      })
    }

    return tx.funnel.update({
      where: { id: params.funnelId },
      data: {
        ...(name && { name }),
        ...(status && { status }),
        ...(webhookUrl !== undefined && { webhookUrl }),
        ...(backButton !== undefined && { backButton }),
        updatedAt: new Date(),
      },
      include: { pages: { orderBy: { order: 'asc' } } },
    })
  })

  return NextResponse.json(funnel)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.funnel.deleteMany({
    where: { id: params.funnelId, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}

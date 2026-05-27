import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@landup/db'
import { getTemplate } from '@/lib/templates'
import { nanoid } from 'nanoid'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const funnels = await prisma.funnel.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { leads: true, pageViews: true } } },
  })

  return NextResponse.json(funnels)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, templateId } = await req.json()

  const template = templateId ? getTemplate(templateId) : null
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`

  const funnel = await prisma.funnel.create({
    data: {
      userId: session.user.id,
      name,
      slug,
      status: 'DRAFT',
      backButton: true,
      pages: template
        ? {
            create: template.pages.map((page, i) => ({
              order: i,
              name: page.name,
              type: page.type,
              isResult: page.isResult ?? false,
              blocks: page.blocks as object[],
            })),
          }
        : undefined,
    },
    include: { pages: { orderBy: { order: 'asc' } } },
  })

  return NextResponse.json(funnel)
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@landup/db'
import { scoreLead } from '@landup/types'

interface Params { params: { funnelId: string } }

export async function POST(req: NextRequest, { params }: Params) {
  const body = await req.json()
  const { name, email, phone, quizAnswers, resultPageId, utmSource, utmMedium, utmCampaign } = body

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const funnel = await prisma.funnel.findUnique({
    where: { id: params.funnelId },
    include: { pages: true },
  })
  if (!funnel) return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })

  // Calculate score from quiz answers
  const scoreMap: Record<string, Record<string, number>> = {}
  for (const page of funnel.pages) {
    const blocks = Array.isArray(page.blocks) ? page.blocks : []
    for (const block of blocks as { type: string; question?: string; options?: { text: string; score?: number }[] }[]) {
      if (['quiz_radio', 'quiz_image', 'quiz_button', 'quiz_list'].includes(block.type) && block.options) {
        scoreMap[page.id] = {}
        for (const opt of block.options) {
          if (opt.score !== undefined) {
            scoreMap[page.id]![opt.text] = opt.score
          }
        }
      }
    }
  }
  const score = scoreLead(quizAnswers ?? {}, scoreMap)

  // Save lead
  const lead = await prisma.lead.create({
    data: {
      funnelId: params.funnelId,
      name,
      email,
      phone,
      quizAnswers: quizAnswers ?? {},
      score,
      resultPageId,
      utmSource,
      utmMedium,
      utmCampaign,
      device: req.headers.get('user-agent')?.includes('Mobile') ? 'mobile' : 'desktop',
    },
  })

  // Fire webhook if configured
  if (funnel.webhookUrl) {
    fetch(funnel.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'form_submitted',
        funnelId: params.funnelId,
        contact: { name, email, phone },
        quizAnswers,
        score,
        resultPage: resultPageId,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {}) // Fire-and-forget
  }

  return NextResponse.json({ success: true, leadId: lead.id, score, resultPageId })
}

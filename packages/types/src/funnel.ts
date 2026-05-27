import type { Block } from './blocks'

// ─── Funnel Status ───────────────────────────────────────────────────────────

export type FunnelStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type PageType = 'HERO' | 'BRIDGE' | 'QUIZ' | 'OPTIN' | 'RESULT'
export type Plan = 'FREE' | 'STARTER' | 'GROWTH' | 'PRO'

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = {
  id: string
  name: string
  primaryColor: string
  accentColor: string
  bgLight: string
  bgDarker: string
  fontFamily: string
  borderRadius: string
  isDefault?: boolean
}

// ─── Brand Profile ───────────────────────────────────────────────────────────

export type BrandProfile = {
  url: string
  businessName: string
  serviceType: string
  targetAudience: string[]
  valueProps: string[]
  proofPoints: {
    clientCount?: number
    geography?: string
    caseStudy?: string
    metrics?: string[]
  }
  methodology?: string
  tone?: string
}

// ─── Funnel Pages ────────────────────────────────────────────────────────────

export type FunnelPage = {
  id: string
  funnelId: string
  order: number
  name: string
  type: PageType
  blocks: Block[]
  isResult?: boolean
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export type Lead = {
  id: string
  funnelId: string
  name?: string
  email: string
  phone?: string
  quizAnswers: Record<string, string>
  score?: number
  resultPage?: string
  utmSource?: string
  utmCampaign?: string
  createdAt: string
}

// ─── Funnel ──────────────────────────────────────────────────────────────────

export type Funnel = {
  id: string
  userId: string
  name: string
  slug: string
  status: FunnelStatus
  brandProfile?: BrandProfile
  theme: Partial<Theme>
  pages: FunnelPage[]
  createdAt: string
  updatedAt: string
}

// ─── Published Funnel (renderer) ─────────────────────────────────────────────

export type PublishedFunnel = {
  id: string
  name: string
  slug: string
  theme: Partial<Theme>
  pages: FunnelPage[]
  backButtonEnabled: boolean
  webhookUrl?: string
}

// ─── Score Map ───────────────────────────────────────────────────────────────

export type ScoreMap = Record<string, Record<string, number>>

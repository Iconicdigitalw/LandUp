// ─── AI Chat & Edit Types ────────────────────────────────────────────────────

export type AIEditTarget =
  | { scope: 'block'; pageId: string; blockIndex: number }
  | { scope: 'page'; pageId: string }
  | { scope: 'funnel' }

export type AIEditRequest = {
  funnelId: string
  target: AIEditTarget
  instruction: string
  context?: string // additional context about the funnel/brand
}

export type AIEditResponse = {
  success: boolean
  changes: AIBlockChange[]
  message?: string
}

export type AIBlockChange = {
  pageId: string
  blockIndex: number
  updatedBlock: Record<string, unknown>
}

// ─── AI Brand Profile Types ──────────────────────────────────────────────────

export type BrandProfileInput = {
  url: string
  templateId: string
}

export type BrandProfileResult = {
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

export type AIPersonalizationJob = {
  jobId: string
  status: 'pending' | 'scraping' | 'analyzing' | 'generating' | 'complete' | 'error'
  progress: number // 0–100
  funnelId?: string
  error?: string
}

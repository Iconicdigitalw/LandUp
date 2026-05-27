// ─── Block Types ────────────────────────────────────────────────────────────

export type QuizOption = {
  id: string
  text: string
  emoji?: string
  imageUrl?: string // quiz_image only
  score?: number // lead scoring weight (0–10)
  linkTo: string // default next page id or 'result:{id}'
  conditions?: RoutingRule[]
}

export type RoutingRule = {
  ifQuestionId: string
  ifAnswerValue: string
  thenLinkTo: string
}

export type Review = {
  id: string
  name: string
  role?: string
  avatarUrl?: string
  rating: number
  text: string
}

export type FormField = 'name' | 'email' | 'phone'

export type Block =
  | { type: 'eyebrow'; text: string; color?: string }
  | { type: 'headline'; text: string; size?: 'lg' | 'xl' | '2xl' }
  | { type: 'subheadline'; text: string }
  | { type: 'body'; text: string }
  | { type: 'image'; src: string; alt: string; rounded?: boolean }
  | { type: 'video'; url: string; thumbnailUrl?: string }
  | { type: 'logo'; src?: string; alt?: string }
  | { type: 'cta'; text: string; linkTo: string; style?: 'primary' | 'ghost' }
  | { type: 'spacer'; size?: 'sm' | 'md' | 'lg' }
  | { type: 'social_proof'; avatarUrls?: string[]; rating?: number; text: string }
  | { type: 'quiz_radio'; question: string; options: QuizOption[] }
  | { type: 'quiz_image'; question: string; options: QuizOption[] }
  | { type: 'quiz_button'; question: string; options: QuizOption[] }
  | { type: 'quiz_list'; question: string; options: QuizOption[] }
  | {
      type: 'form'
      fields: FormField[]
      ctaText: string
      disclaimer?: string
      webhookUrl?: string
    }
  | { type: 'countdown'; endsAt: string }
  | { type: 'reviews'; items: Review[] }
  | { type: 'divider' }
  | { type: 'html'; content: string }

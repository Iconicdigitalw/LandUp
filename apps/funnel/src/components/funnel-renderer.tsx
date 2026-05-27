'use client'

import { useState, useEffect } from 'react'
import type { PublishedFunnel, FunnelPage, Block, QuizOption } from '@landup/types'
import { getNextPage } from '@landup/types'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface FunnelRendererProps {
  funnel: PublishedFunnel
  isPreview?: boolean
}

export function FunnelRenderer({ funnel, isPreview }: FunnelRendererProps) {
  const normalPages = funnel.pages.filter((p) => !p.isResult)
  const resultPages = funnel.pages.filter((p) => p.isResult)
  const allPages = funnel.pages

  const [currentPageId, setCurrentPageId] = useState<string>(
    normalPages[0]?.id ?? allPages[0]?.id ?? ''
  )
  const [history, setHistory] = useState<string[]>([])
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentPage = allPages.find((p) => p.id === currentPageId)
  const theme = funnel.theme

  // Persist session to sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`funnel-${funnel.id}`)
    if (saved) {
      const { pageId, answers } = JSON.parse(saved)
      setCurrentPageId(pageId)
      setSessionAnswers(answers)
    }
  }, [funnel.id])

  useEffect(() => {
    sessionStorage.setItem(
      `funnel-${funnel.id}`,
      JSON.stringify({ pageId: currentPageId, answers: sessionAnswers })
    )
  }, [currentPageId, sessionAnswers, funnel.id])

  function navigateTo(pageId: string) {
    setIsTransitioning(true)
    setTimeout(() => {
      setHistory((h) => [...h, currentPageId])
      setCurrentPageId(pageId)
      setIsTransitioning(false)
      window.scrollTo(0, 0)
    }, 250)
  }

  function goBack() {
    const prev = history[history.length - 1]
    if (prev) {
      setIsTransitioning(true)
      setTimeout(() => {
        setHistory((h) => h.slice(0, -1))
        setCurrentPageId(prev)
        setIsTransitioning(false)
        window.scrollTo(0, 0)
      }, 250)
    }
  }

  function handleAnswer(questionPageId: string, answerId: string, answerText: string) {
    const newAnswers = { ...sessionAnswers, [questionPageId]: answerText }
    setSessionAnswers(newAnswers)

    const nextId = getNextPage(questionPageId, answerId, newAnswers, allPages)
    if (nextId) {
      // Check if it's a result page
      const nextPage = allPages.find((p) => p.id === nextId)
      if (nextPage) {
        navigateTo(nextId)
      } else {
        // Try sequential navigation
        const currentIdx = normalPages.findIndex((p) => p.id === questionPageId)
        const next = normalPages[currentIdx + 1]
        if (next) navigateTo(next.id)
      }
    } else {
      // Sequential navigation
      const currentIdx = normalPages.findIndex((p) => p.id === questionPageId)
      const next = normalPages[currentIdx + 1]
      if (next) navigateTo(next.id)
    }
  }

  function handleCTAClick(linkTo: string) {
    if (linkTo === 'next') {
      const currentIdx = normalPages.findIndex((p) => p.id === currentPageId)
      const next = normalPages[currentIdx + 1]
      if (next) navigateTo(next.id)
    } else {
      const targetPage = allPages.find((p) => p.id === linkTo)
      if (targetPage) navigateTo(linkTo)
      else if (linkTo.startsWith('http')) window.open(linkTo, '_blank')
    }
  }

  async function handleFormSubmit(fields: { name?: string; email: string; phone?: string }) {
    const resultPage = resultPages[0]
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/api/funnels/${funnel.id}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          quizAnswers: sessionAnswers,
          resultPageId: resultPage?.id,
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }),
      }
    )

    if (response.ok) {
      setIsSubmitted(true)
      sessionStorage.removeItem(`funnel-${funnel.id}`)
      if (resultPage) navigateTo(resultPage.id)
    }
  }

  // Quiz question counter
  const quizPages = normalPages.filter((p) => p.type === 'QUIZ')
  const currentQuizIndex = quizPages.findIndex((p) => p.id === currentPageId)
  const isQuizPage = currentQuizIndex !== -1

  const showBackButton =
    funnel.backButtonEnabled &&
    history.length > 0 &&
    !currentPage?.isResult

  return (
    <div
      className="min-h-screen flex items-start justify-center py-8 px-4"
      style={{ backgroundColor: theme.bgLight ?? '#f6f5ff' }}
    >
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold text-center py-1.5 z-50">
          Preview mode — this is how your funnel looks to visitors
        </div>
      )}

      <div
        className={`w-full max-w-[390px] bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-250 ${
          isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}
        style={{ transform: isTransitioning ? 'translateX(8px)' : 'none' }}
      >
        {/* Back button */}
        {showBackButton && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-4 pt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Page content */}
        {currentPage && (
          <div className="p-6 space-y-4">
            {currentPage.blocks.map((block, idx) => (
              <FunnelBlock
                key={idx}
                block={block as Block}
                page={currentPage}
                quizIndex={isQuizPage ? currentQuizIndex : -1}
                totalQuiz={quizPages.length}
                theme={theme}
                onAnswer={(answerId, answerText) =>
                  handleAnswer(currentPage.id, answerId, answerText)
                }
                onCTA={handleCTAClick}
                onSubmit={handleFormSubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Individual Block Renderer ────────────────────────────────────────────────

interface BlockProps {
  block: Block
  page: FunnelPage
  quizIndex: number
  totalQuiz: number
  theme: PublishedFunnel['theme']
  onAnswer: (answerId: string, answerText: string) => void
  onCTA: (linkTo: string) => void
  onSubmit: (fields: { name?: string; email: string; phone?: string }) => void
}

function FunnelBlock({ block, page, quizIndex, totalQuiz, theme, onAnswer, onCTA, onSubmit }: BlockProps) {
  const primary = theme.primaryColor ?? '#34386a'

  switch (block.type) {
    case 'logo':
      return (
        <div className="flex justify-center py-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: primary }}>
            <span className="text-white text-xs font-bold">L</span>
          </div>
        </div>
      )

    case 'eyebrow':
      return (
        <p className="text-xs font-bold uppercase tracking-wider text-center" style={{ color: primary }}>
          {quizIndex !== -1 && block.text.startsWith('Question')
            ? `Question ${quizIndex + 1} of ${totalQuiz}`
            : block.text}
        </p>
      )

    case 'headline':
      return (
        <h1
          className={`font-extrabold text-gray-900 leading-tight text-center ${
            block.size === '2xl' ? 'text-2xl' : block.size === 'xl' ? 'text-xl' : 'text-lg'
          }`}
        >
          {block.text}
        </h1>
      )

    case 'subheadline':
      return <h2 className="text-base font-semibold text-gray-800 text-center">{block.text}</h2>

    case 'body':
      return <p className="text-sm text-gray-500 leading-relaxed text-center">{block.text}</p>

    case 'cta':
      return (
        <button
          onClick={() => onCTA(block.linkTo)}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 ${
            block.style === 'ghost' ? 'border-2' : 'text-white'
          }`}
          style={
            block.style === 'ghost'
              ? { borderColor: primary, color: primary }
              : { backgroundColor: primary }
          }
        >
          {block.text}
        </button>
      )

    case 'image':
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.src}
          alt={block.alt}
          className={`w-full object-cover ${block.rounded ? 'rounded-xl' : ''}`}
        />
      ) : null

    case 'spacer':
      return (
        <div
          className={block.size === 'lg' ? 'h-8' : block.size === 'sm' ? 'h-2' : 'h-4'}
        />
      )

    case 'social_proof':
      return (
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white" />
            ))}
          </div>
          <div>
            <div className="text-yellow-400 text-xs">{'★'.repeat(5)}</div>
            <p className="text-[10px] text-gray-500">{block.text}</p>
          </div>
        </div>
      )

    case 'quiz_radio':
    case 'quiz_list':
      return <QuizBlock block={block} primary={primary} onAnswer={onAnswer} />

    case 'quiz_button':
      return <QuizButtonBlock block={block} primary={primary} onAnswer={onAnswer} />

    case 'quiz_image':
      return <QuizImageBlock block={block} primary={primary} onAnswer={onAnswer} />

    case 'form':
      return <FormBlock block={block} primary={primary} onSubmit={onSubmit} />

    case 'divider':
      return <hr className="border-gray-100" />

    default:
      return null
  }
}

// ─── Quiz Block Components ────────────────────────────────────────────────────

function QuizBlock({
  block,
  primary,
  onAnswer,
}: {
  block: Extract<Block, { type: 'quiz_radio' | 'quiz_list' }>
  primary: string
  onAnswer: (id: string, text: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <p className="font-bold text-gray-900 text-center text-base">{block.question}</p>
      <div className="space-y-2">
        {block.options.map((opt: QuizOption) => (
          <button
            key={opt.id}
            onClick={() => {
              setSelected(opt.id)
              if (block.type === 'quiz_list') {
                setTimeout(() => onAnswer(opt.id, opt.text), 150)
              }
            }}
            className="w-full flex items-center gap-3 p-3.5 border-2 rounded-xl text-sm font-medium transition-all text-left"
            style={
              selected === opt.id
                ? { borderColor: primary, backgroundColor: `${primary}15`, color: primary }
                : { borderColor: '#e5e7eb', color: '#374151' }
            }
          >
            {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
            <span className="flex-1">{opt.text}</span>
            {block.type === 'quiz_radio' && (
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={
                  selected === opt.id
                    ? { borderColor: primary, backgroundColor: primary }
                    : { borderColor: '#d1d5db' }
                }
              >
                {selected === opt.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      {block.type === 'quiz_radio' && selected && (
        <button
          onClick={() => {
            const opt = block.options.find((o: QuizOption) => o.id === selected)
            if (opt) onAnswer(opt.id, opt.text)
          }}
          className="w-full py-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: primary }}
        >
          Next Question
        </button>
      )}
    </div>
  )
}

function QuizButtonBlock({
  block,
  primary,
  onAnswer,
}: {
  block: Extract<Block, { type: 'quiz_button' }>
  primary: string
  onAnswer: (id: string, text: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="font-bold text-gray-900 text-center text-base">{block.question}</p>
      <div className="grid grid-cols-2 gap-3">
        {block.options.map((opt: QuizOption) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.id, opt.text)}
            className="p-4 rounded-xl font-bold text-sm text-white text-center transition-opacity hover:opacity-90 min-h-[70px] flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: primary }}
          >
            {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}

function QuizImageBlock({
  block,
  primary,
  onAnswer,
}: {
  block: Extract<Block, { type: 'quiz_image' }>
  primary: string
  onAnswer: (id: string, text: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="font-bold text-gray-900 text-center text-base">{block.question}</p>
      <div className="grid grid-cols-2 gap-3">
        {block.options.map((opt: QuizOption) => (
          <button
            key={opt.id}
            onClick={() => onAnswer(opt.id, opt.text)}
            className="aspect-square rounded-xl overflow-hidden relative transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#e5e7eb' }}
          >
            {opt.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={opt.imageUrl} alt={opt.text} className="w-full h-full object-cover" />
            )}
            <div
              className="absolute bottom-0 left-0 right-0 py-2 px-1 text-white font-bold text-xs text-center"
              style={{ backgroundColor: primary }}
            >
              {opt.text}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function FormBlock({
  block,
  primary,
  onSubmit,
}: {
  block: Extract<Block, { type: 'form' }>
  primary: string
  onSubmit: (fields: { name?: string; email: string; phone?: string }) => void
}) {
  const [fields, setFields] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fields.email) return
    setIsSubmitting(true)
    await onSubmit({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
    })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {block.fields.map((field) => (
        <input
          key={field}
          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
          placeholder={field === 'name' ? 'Full name' : field === 'email' ? 'Email address' : 'Phone number'}
          required={field === 'email'}
          value={fields[field] ?? ''}
          onChange={(e) => setFields((f) => ({ ...f, [field]: e.target.value }))}
          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark transition-colors"
        />
      ))}
      {block.disclaimer && (
        <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 shrink-0"
            required
          />
          {block.disclaimer}
        </label>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        style={{ backgroundColor: primary }}
      >
        {isSubmitting ? 'Submitting...' : block.ctaText}
      </button>
    </form>
  )
}

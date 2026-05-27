import type { FunnelPage, ScoreMap } from './funnel'
import type { Block, QuizOption } from './blocks'

// ─── Quiz Routing Engine ─────────────────────────────────────────────────────

/**
 * Given the current page, the selected answer, and all previous session answers,
 * return the id of the next page to navigate to.
 */
export function getNextPage(
  currentPageId: string,
  selectedAnswerId: string,
  sessionAnswers: Record<string, string>,
  pages: FunnelPage[]
): string | null {
  const page = pages.find((p) => p.id === currentPageId)
  if (!page) return null

  // Find the quiz block on this page
  const quizBlock = page.blocks.find((b) =>
    ['quiz_radio', 'quiz_image', 'quiz_button', 'quiz_list'].includes(b.type)
  ) as Extract<Block, { type: 'quiz_radio' | 'quiz_image' | 'quiz_button' | 'quiz_list' }> | undefined

  if (!quizBlock) return null

  const option = quizBlock.options.find((o: QuizOption) => o.id === selectedAnswerId)
  if (!option) return null

  // Evaluate conditional rules top-to-bottom — first match wins
  if (option.conditions) {
    for (const rule of option.conditions) {
      if (sessionAnswers[rule.ifQuestionId] === rule.ifAnswerValue) {
        return rule.thenLinkTo
      }
    }
  }

  // Fall back to default linkTo
  return option.linkTo
}

// ─── Lead Scoring ────────────────────────────────────────────────────────────

/**
 * Calculate a numeric lead score from all quiz answers using a score map.
 * Score map: { questionId: { answerText: score } }
 */
export function scoreLead(answers: Record<string, string>, scoreMap: ScoreMap): number {
  return Object.entries(answers).reduce((total, [questionId, answer]) => {
    return total + (scoreMap[questionId]?.[answer] ?? 1)
  }, 0)
}

/**
 * Given a score and result pages with min/max thresholds, return the result page id.
 */
export function getResultPage(
  score: number,
  resultPages: Array<{ id: string; minScore?: number | null; maxScore?: number | null }>
): string | null {
  const match = resultPages.find((rp) => {
    const min = rp.minScore ?? -Infinity
    const max = rp.maxScore ?? Infinity
    return score >= min && score <= max
  })
  return match?.id ?? null
}

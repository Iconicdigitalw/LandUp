/**
 * AI Block Editor — powers the in-editor AI chat & element editing feature.
 *
 * Two modes:
 * 1. Element edit: User clicks a block → describes change → AI rewrites that block
 * 2. Page/funnel chat: User types in chat panel → AI applies broader changes
 */

import { anthropic, AI_MODEL } from './client'
import type { Block } from '@landup/types'
import type { AIEditRequest, AIEditResponse, AIBlockChange } from '@landup/types'

// ─── System Prompt ────────────────────────────────────────────────────────────

const BLOCK_EDITOR_SYSTEM = `You are an expert direct-response copywriter and conversion rate optimisation specialist working inside the LandUp! funnel builder.

Your job is to rewrite funnel blocks (headlines, body copy, CTAs, quiz questions, etc.) based on the user's instructions.

Rules:
- Output ONLY valid JSON matching the block schema — no prose, no explanation
- Keep the same block "type" field unless explicitly asked to change it
- Maintain the same JSON structure — only change text/copy fields
- Write in a direct-response style: outcome-first, second-person ("your"), active verbs
- Use "without [pain]" clauses where appropriate
- Never use "Submit", "Send", "Click here" for CTA buttons
- Eyebrow text should be 3–8 words, uppercase or title case
- Headlines: 8–15 words, bold promise, outcome-focused
- Body: 1–3 sentences max, supportive of the headline
- CTA buttons: action verb + what they get (e.g., "Get my free strategy session")

Quiz question rules:
- Questions should feel helpful, not like screening
- Options should represent real lead tiers (not generic)
- Keep all option IDs, linkTo, and conditions fields unchanged`

// ─── Edit a single block ──────────────────────────────────────────────────────

export async function editBlock(
  block: Block,
  instruction: string,
  brandContext?: string
): Promise<Block> {
  const prompt = `Current block (JSON):
${JSON.stringify(block, null, 2)}

Brand context:
${brandContext ?? 'Not provided'}

Instruction from user:
"${instruction}"

Rewrite the block following the instruction. Return ONLY the updated block JSON, nothing else.`

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    system: BLOCK_EDITOR_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected AI response type')

  // Extract JSON from response (handle code blocks)
  const jsonMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = jsonMatch ? jsonMatch[1] : content.text.trim()

  return JSON.parse(jsonStr) as Block
}

// ─── AI Edit Request Handler ──────────────────────────────────────────────────

export async function handleAIEdit(
  request: AIEditRequest,
  blocks: Block[]
): Promise<AIEditResponse> {
  const changes: AIBlockChange[] = []

  if (request.target.scope === 'block') {
    const { pageId, blockIndex } = request.target
    const block = blocks[blockIndex]
    if (!block) {
      return { success: false, changes: [], message: 'Block not found' }
    }

    const updated = await editBlock(block, request.instruction, request.context)
    changes.push({ pageId, blockIndex, updatedBlock: updated as Record<string, unknown> })
  }

  return { success: true, changes }
}

// ─── Chat Message Handler ─────────────────────────────────────────────────────

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function streamChatEdit(
  messages: ChatMessage[],
  funnelContext: string
): Promise<ReadableStream<string>> {
  const systemPrompt = `${BLOCK_EDITOR_SYSTEM}

Current funnel context:
${funnelContext}

When the user asks to change something, respond with:
1. A brief acknowledgement of what you're changing (1 sentence)
2. Then the JSON changes in this format:
\`\`\`changes
[{"pageId": "...", "blockIndex": 0, "updatedBlock": {...}}, ...]
\`\`\`

If you need clarification, ask a short question. Keep responses concise and action-oriented.`

  const stream = await anthropic.messages.stream({
    model: AI_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(event.delta.text)
        }
      }
      controller.close()
    },
  })
}

/**
 * AI Brand Profile Generator
 * Takes scraped website content and extracts structured brand data,
 * then uses it to personalize all funnel template blocks.
 */

import { anthropic, AI_MODEL } from './client'
import type { BrandProfileResult } from '@landup/types'

// ─── Extract Brand Profile from Scraped Content ───────────────────────────────

export async function extractBrandProfile(
  scrapedContent: string,
  url: string
): Promise<BrandProfileResult> {
  const prompt = `You are analyzing a business website to extract brand information for a marketing funnel.

Website URL: ${url}

Scraped content:
${scrapedContent.slice(0, 8000)}

Extract the following information and return as JSON:
{
  "businessName": "exact business name",
  "serviceType": "web_design | coaching | consulting | local_service | saas | other",
  "targetAudience": ["audience segment 1", "audience segment 2"],
  "valueProps": ["value prop 1", "value prop 2", "value prop 3"],
  "proofPoints": {
    "clientCount": 100,
    "geography": "North America",
    "caseStudy": "brief case study summary if found",
    "metrics": ["specific result 1", "specific result 2"]
  },
  "methodology": "proprietary framework name if mentioned, or invent a compelling one",
  "tone": "professional | friendly | authoritative | energetic"
}

Rules:
- If information is not on the page, infer from context or leave null
- For methodology: if they don't have a named framework, create a compelling branded name (e.g., "The [X] Method", "[Brand] Framework")
- For metrics: if specific numbers aren't available, use plausible aspirational metrics
- Return ONLY valid JSON, no explanation`

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (!content || content.type !== 'text') throw new Error('Unexpected AI response')

  const jsonMatch = content.text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = jsonMatch?.[1] ?? content.text.trim()

  return JSON.parse(jsonStr) as BrandProfileResult
}

// ─── Personalize a Template with Brand Profile ────────────────────────────────

export async function personalizeBlock(
  blockType: string,
  currentContent: string,
  brandProfile: BrandProfileResult,
  pageContext: string
): Promise<string> {
  const prompt = `You are rewriting funnel copy for a specific business.

Business: ${brandProfile.businessName}
Service: ${brandProfile.serviceType}
Target audience: ${brandProfile.targetAudience.join(', ')}
Value props: ${brandProfile.valueProps.join(', ')}
Methodology: ${brandProfile.methodology ?? 'not specified'}
Proof: ${JSON.stringify(brandProfile.proofPoints)}
Tone: ${brandProfile.tone ?? 'professional'}

Page context: ${pageContext}
Block type: ${blockType}

Original template text:
"${currentContent}"

Rewrite this text to be specific to ${brandProfile.businessName}.
- Use their actual service type and audience
- Reference their methodology if applicable
- Include specific proof points where relevant
- Match their tone
- Keep similar length to original

Return ONLY the rewritten text, no quotes, no explanation.`

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (!content || content.type !== 'text') throw new Error('Unexpected AI response')
  return content.text.trim()
}

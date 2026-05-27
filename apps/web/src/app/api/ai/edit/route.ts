import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { streamChatEdit } from '@landup/ai'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { instruction, context, target } = body

  // Build messages for the AI
  const messages = [
    {
      role: 'user' as const,
      content: `Target: ${JSON.stringify(target)}\nInstruction: ${instruction}`,
    },
  ]

  const stream = await streamChatEdit(messages, context ?? '')

  // Encode the stream as a text stream response
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = stream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(encoder.encode(value))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}

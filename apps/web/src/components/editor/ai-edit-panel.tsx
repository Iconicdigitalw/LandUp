'use client'

import { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { Button, ScrollArea, Textarea } from '@landup/ui'
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ChevronDown,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import type { ChatMessage } from '@/store/editor-store'

interface AIEditPanelProps {
  funnelId: string
}

// Quick-action prompts
const QUICK_PROMPTS = [
  'Make this headline more urgent and compelling',
  'Add a "without [pain]" clause to the body copy',
  'Rewrite the CTA button to be more action-oriented',
  'Make the quiz question feel more helpful and less like screening',
  'Shorten this text by 30% while keeping the meaning',
]

export function AIEditPanel({ funnelId }: AIEditPanelProps) {
  const {
    closeAIEdit,
    aiTarget,
    aiMessages,
    aiIsStreaming,
    addChatMessage,
    setAIStreaming,
    applyAIChanges,
    pages,
    activePageId,
    selectedBlockIndex,
  } = useEditorStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  // Auto-populate input when a block is selected via the AI Edit button
  useEffect(() => {
    if (aiTarget && 'blockIndex' in aiTarget) {
      inputRef.current?.focus()
    }
  }, [aiTarget])

  // Context description for the AI
  function getTargetDescription() {
    if (!aiTarget) return 'entire funnel'
    if (aiTarget.scope === 'block') {
      const page = pages.find((p) => p.id === aiTarget.pageId)
      const block = page?.blocks[aiTarget.blockIndex]
      return `${block?.type ?? 'block'} on "${page?.name ?? 'page'}"`
    }
    if (aiTarget.scope === 'page') {
      const page = pages.find((p) => p.id === aiTarget.pageId)
      return `all blocks on "${page?.name ?? 'page'}"`
    }
    return 'entire funnel'
  }

  async function handleSend() {
    if (!input.trim() || aiIsStreaming) return

    const userMsg: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    addChatMessage(userMsg)
    setInput('')
    setAIStreaming(true)

    // Build context for AI
    const activePage = pages.find((p) => p.id === activePageId)
    const targetBlock =
      aiTarget && 'blockIndex' in aiTarget
        ? activePage?.blocks[aiTarget.blockIndex]
        : null

    const context = {
      funnelId,
      target: aiTarget ?? { scope: 'funnel' },
      instruction: userMsg.content,
      context: JSON.stringify({
        activePage: activePage?.name,
        block: targetBlock,
        allPages: pages.map((p) => ({ id: p.id, name: p.name, type: p.type })),
      }),
    }

    // Stream the response
    const assistantMsgId = nanoid()
    let assistantContent = ''
    addChatMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    })

    try {
      const res = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      })

      if (!res.ok) throw new Error('AI request failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          assistantContent += chunk

          // Update the streaming message
          useEditorStore.setState((state) => ({
            aiMessages: state.aiMessages.map((m) =>
              m.id === assistantMsgId ? { ...m, content: assistantContent } : m
            ),
          }))
        }
      }

      // Parse changes from the response if any
      const changesMatch = assistantContent.match(/```changes\s*([\s\S]*?)```/)
      if (changesMatch?.[1]) {
        try {
          const changes = JSON.parse(changesMatch[1])
          applyAIChanges(changes)
        } catch {
          // No changes to apply
        }
      }
    } catch (error) {
      useEditorStore.setState((state) => ({
        aiMessages: state.aiMessages.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        ),
      }))
    } finally {
      setAIStreaming(false)
    }
  }

  return (
    <aside className="w-80 bg-white border-l flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-dark">AI Editor</p>
            {aiTarget && (
              <p className="text-[10px] text-gray-400">Editing: {getTargetDescription()}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeAIEdit}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Target selector */}
      {aiTarget && 'blockIndex' in aiTarget && (
        <div className="px-3 py-2 bg-brand-bg-light border-b">
          <div className="flex items-center gap-2 text-xs text-brand-dark">
            <div className="w-2 h-2 rounded-full bg-brand-accent" />
            <span>Selected block: <strong>{getTargetDescription()}</strong></span>
          </div>
          <button
            className="text-[10px] text-gray-400 underline mt-0.5"
            onClick={() =>
              useEditorStore.setState({
                aiTarget: activePageId ? { scope: 'page', pageId: activePageId } : { scope: 'funnel' },
              })
            }
          >
            Switch to page edit
          </button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {aiMessages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-brand-bg-light rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-brand-dark" />
              </div>
              <p className="text-sm font-medium text-brand-dark mb-1">AI Funnel Editor</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {aiTarget && 'blockIndex' in aiTarget
                  ? 'Describe how you want to change this block.'
                  : 'Describe any changes to your funnel in plain English.'}
              </p>
            </div>
          ) : (
            aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-brand-dark flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-dark text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {msg.content || (aiIsStreaming ? <Loader2 className="w-3 h-3 animate-spin" /> : '')}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-gray-500" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick prompts */}
      {aiMessages.length === 0 && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-gray-400 mb-1.5 font-medium">Quick actions</p>
          <div className="space-y-1">
            {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="w-full text-left text-[10px] text-gray-500 hover:text-brand-dark border border-gray-100 hover:border-brand-dark/30 rounded-lg px-2 py-1.5 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder={
              aiTarget && 'blockIndex' in aiTarget
                ? 'Describe how to change this block...'
                : 'Describe the changes you want...'
            }
            className="text-xs resize-none min-h-[60px] max-h-32"
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={aiIsStreaming}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            disabled={!input.trim() || aiIsStreaming}
          >
            {aiIsStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </aside>
  )
}

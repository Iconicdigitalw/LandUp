'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEditorStore } from '@/store/editor-store'
import { Button, Badge } from '@landup/ui'
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Loader2,
  Zap,
  MessageSquare,
  Eye,
} from 'lucide-react'
import type { Funnel } from '@landup/db'

interface EditorTopbarProps {
  funnel: Funnel
}

export function EditorTopbar({ funnel }: EditorTopbarProps) {
  const { funnelName, isDirty, isSaving, aiChatOpen, toggleAIChat } = useEditorStore()
  const [isSavingNow, setIsSavingNow] = useState(false)

  async function handleSave() {
    setIsSavingNow(true)
    const { pages } = useEditorStore.getState()
    await fetch(`/api/funnels/${funnel.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages }),
    })
    useEditorStore.getState().markSaved()
    setIsSavingNow(false)
  }

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-dark flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-sm text-brand-dark">{funnelName}</span>
        </div>
        {isDirty && (
          <Badge variant="draft" className="text-xs">Unsaved</Badge>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* AI Chat toggle */}
        <Button
          variant={aiChatOpen ? 'default' : 'outline'}
          size="sm"
          onClick={toggleAIChat}
          className="gap-1.5"
        >
          <MessageSquare className="w-4 h-4" />
          AI Edit
        </Button>

        {/* Preview */}
        <Button variant="outline" size="sm" asChild>
          <a
            href={`${process.env.NEXT_PUBLIC_FUNNEL_URL}/f/${funnel.slug}?preview=1`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="w-4 h-4" />
            Preview
          </a>
        </Button>

        {/* Save */}
        <Button size="sm" onClick={handleSave} disabled={isSavingNow || !isDirty}>
          {isSavingNow ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isDirty ? 'Save' : 'Saved'}
        </Button>

        {/* Publish */}
        <Button size="sm" variant="accent">
          <ExternalLink className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { EditorSidebar } from './editor-sidebar'
import { EditorCanvas } from './editor-canvas'
import { EditorPanel } from './editor-panel'
import { EditorTopbar } from './editor-topbar'
import { AIEditPanel } from './ai-edit-panel'
import type { Funnel, Page } from '@landup/db'
import type { FunnelPage } from '@landup/types'

interface EditorShellProps {
  funnel: Funnel & { pages: Page[] }
}

export function EditorShell({ funnel }: EditorShellProps) {
  const { pages, activePageId, aiChatOpen } = useEditorStore()

  useEffect(() => {
    // Hydrate editor store
    const store = useEditorStore.getState()
    const funnelPages = funnel.pages.map((p) => ({
      ...p,
      blocks: Array.isArray(p.blocks) ? p.blocks : [],
    })) as FunnelPage[]

    useEditorStore.setState({
      funnelId: funnel.id,
      funnelName: funnel.name,
      pages: funnelPages,
      activePageId: funnelPages[0]?.id ?? null,
    })
  }, [funnel])

  const activePage = pages.find((p) => p.id === activePageId) ?? null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-bg-darker">
      <EditorTopbar funnel={funnel} />
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — page list */}
        <EditorSidebar />

        {/* Center — phone canvas */}
        <div className="flex-1 flex items-start justify-center overflow-y-auto py-8 px-4">
          <EditorCanvas page={activePage} funnelId={funnel.id} />
        </div>

        {/* Right — block settings or AI chat */}
        {aiChatOpen ? (
          <AIEditPanel funnelId={funnel.id} />
        ) : (
          <EditorPanel page={activePage} />
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { Button, ScrollArea, Separator, Badge } from '@landup/ui'
import {
  GripVertical,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Flag,
  FileText,
  HelpCircle,
  FormInput,
  Star,
} from 'lucide-react'
import type { FunnelPage } from '@landup/types'
import { nanoid } from 'nanoid'

const pageTypeIcon = {
  HERO: FileText,
  BRIDGE: ChevronRight,
  QUIZ: HelpCircle,
  OPTIN: FormInput,
  RESULT: Star,
}

const pageTypeLabel = {
  HERO: 'Hero',
  BRIDGE: 'Bridge',
  QUIZ: 'Quiz',
  OPTIN: 'Opt-In',
  RESULT: 'Result',
}

export function EditorSidebar() {
  const { pages, activePageId, setActivePage, addPage } = useEditorStore()
  const normalPages = pages.filter((p) => !p.isResult)
  const resultPages = pages.filter((p) => p.isResult)

  function addNewPage() {
    addPage({
      id: nanoid(),
      funnelId: '',
      order: normalPages.length,
      name: `Page ${normalPages.length + 1}`,
      type: 'BRIDGE',
      blocks: [],
    })
  }

  function addResultPage() {
    addPage({
      id: nanoid(),
      funnelId: '',
      order: pages.length,
      name: `Result ${String.fromCharCode(65 + resultPages.length)}`,
      type: 'RESULT',
      isResult: true,
      blocks: [],
    })
  }

  return (
    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
      <div className="p-3 border-b">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {normalPages.map((page) => (
            <PageItem
              key={page.id}
              page={page}
              isActive={page.id === activePageId}
              onClick={() => setActivePage(page.id)}
            />
          ))}
        </div>
        <div className="px-2 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-gray-400 h-8"
            onClick={addNewPage}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add page
          </Button>
        </div>

        <Separator />

        <div className="p-3">
          <div className="flex items-center gap-1 mb-1">
            <Flag className="w-3 h-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Results</p>
          </div>
        </div>
        <div className="px-2 space-y-0.5">
          {resultPages.map((page) => (
            <PageItem
              key={page.id}
              page={page}
              isActive={page.id === activePageId}
              onClick={() => setActivePage(page.id)}
            />
          ))}
        </div>
        <div className="px-2 pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-gray-400 h-8"
            onClick={addResultPage}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add result
          </Button>
        </div>
      </ScrollArea>
    </aside>
  )
}

function PageItem({
  page,
  isActive,
  onClick,
}: {
  page: FunnelPage
  isActive: boolean
  onClick: () => void
}) {
  const Icon = pageTypeIcon[page.type] ?? FileText

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors group ${
        isActive
          ? 'bg-brand-bg-light text-brand-dark'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <GripVertical className="w-3 h-3 text-gray-300 shrink-0 cursor-grab" />
      <Icon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
      <span className="flex-1 truncate text-xs font-medium">{page.name}</span>
      <Badge
        variant="outline"
        className="text-[10px] px-1 py-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {pageTypeLabel[page.type]}
      </Badge>
    </button>
  )
}

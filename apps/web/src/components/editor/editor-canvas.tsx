'use client'

import { useEditorStore } from '@/store/editor-store'
import { CanvasBlock } from './canvas-block'
import { Button } from '@landup/ui'
import { Plus, Smartphone } from 'lucide-react'
import type { FunnelPage } from '@landup/types'
import type { Block } from '@landup/types'
import { nanoid } from 'nanoid'

interface EditorCanvasProps {
  page: FunnelPage | null
  funnelId: string
}

export function EditorCanvas({ page, funnelId }: EditorCanvasProps) {
  const { selectedBlockIndex, selectBlock, addBlock } = useEditorStore()

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a page to start editing</p>
        </div>
      </div>
    )
  }

  function handleAddBlock(type: Block['type']) {
    if (!page) return
    const newBlock: Block = (() => {
      switch (type) {
        case 'headline': return { type, text: 'Your compelling headline here', size: 'xl' }
        case 'body': return { type, text: 'Supporting copy that explains your offer and builds desire.' }
        case 'eyebrow': return { type, text: 'FOR YOUR AUDIENCE' }
        case 'cta': return { type, text: 'Get started now', linkTo: 'next', style: 'primary' }
        case 'spacer': return { type, size: 'md' }
        case 'image': return { type, src: '', alt: 'Image' }
        default: return { type: 'body', text: 'New block' } as Block
      }
    })()
    addBlock(page.id, newBlock)
  }

  return (
    <div className="relative">
      {/* Device frame label */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
        <Smartphone className="w-3.5 h-3.5" />
        <span>Mobile preview · 390px</span>
      </div>

      {/* Phone-width canvas */}
      <div
        className="w-[390px] bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200"
        style={{ minHeight: 600 }}
        onClick={(e) => {
          // Deselect if clicking the canvas itself
          if (e.target === e.currentTarget) selectBlock(null)
        }}
      >
        {/* Status bar mockup */}
        <div className="bg-white h-8 flex items-center justify-between px-5 border-b border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-gray-300 rounded-sm" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Page content */}
        <div className="p-5 space-y-2 min-h-[500px]">
          {page.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <Plus className="w-8 h-8 mb-2" />
              <p className="text-xs">Add blocks to this page</p>
            </div>
          ) : (
            page.blocks.map((block, idx) => (
              <CanvasBlock
                key={idx}
                block={block}
                index={idx}
                pageId={page.id}
                isSelected={selectedBlockIndex === idx}
                onSelect={() => selectBlock(idx)}
              />
            ))
          )}
        </div>

        {/* Add block bar */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-1.5 flex-wrap">
            {[
              { type: 'headline' as const, label: 'H' },
              { type: 'body' as const, label: 'T' },
              { type: 'eyebrow' as const, label: 'E' },
              { type: 'cta' as const, label: 'CTA' },
              { type: 'image' as const, label: '📷' },
              { type: 'spacer' as const, label: '—' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="w-8 h-8 rounded border border-gray-200 bg-white text-xs font-medium text-gray-500 hover:border-brand-dark hover:text-brand-dark transition-colors"
                title={`Add ${type} block`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

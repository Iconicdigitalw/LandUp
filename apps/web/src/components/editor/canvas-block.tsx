'use client'

import { useEditorStore } from '@/store/editor-store'
import { Button } from '@landup/ui'
import { Sparkles, Trash2, GripVertical } from 'lucide-react'
import type { Block } from '@landup/types'

interface CanvasBlockProps {
  block: Block
  index: number
  pageId: string
  isSelected: boolean
  onSelect: () => void
}

export function CanvasBlock({ block, index, pageId, isSelected, onSelect }: CanvasBlockProps) {
  const { removeBlock, openAIEdit } = useEditorStore()

  function handleAIEdit(e: React.MouseEvent) {
    e.stopPropagation()
    openAIEdit({ scope: 'block', pageId, blockIndex: index })
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      className={`relative group rounded-lg transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-brand-dark ring-offset-1'
          : 'hover:ring-1 hover:ring-gray-300'
      }`}
    >
      {/* Block controls (show on hover/select) */}
      <div
        className={`absolute -top-7 left-0 right-0 flex items-center justify-between transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-1">
          <GripVertical className="w-3.5 h-3.5 text-gray-400 cursor-grab" />
          <span className="text-[10px] text-gray-400 font-medium uppercase">{block.type}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* AI edit this block */}
          <button
            onClick={handleAIEdit}
            className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-dark text-white rounded text-[10px] font-medium hover:bg-brand-dark/90 transition-colors"
            title="AI edit this block"
          >
            <Sparkles className="w-2.5 h-2.5" />
            AI Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeBlock(pageId, index) }}
            className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Block preview */}
      <div className="p-2">
        <BlockPreview block={block} />
      </div>
    </div>
  )
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'eyebrow':
      return (
        <p className="text-xs font-bold uppercase tracking-wider text-[#34386a]">
          {block.text}
        </p>
      )

    case 'headline':
      return (
        <h2
          className={`font-extrabold text-gray-900 leading-tight ${
            block.size === '2xl' ? 'text-2xl' : block.size === 'xl' ? 'text-xl' : 'text-lg'
          }`}
        >
          {block.text}
        </h2>
      )

    case 'subheadline':
      return <h3 className="text-base font-semibold text-gray-800">{block.text}</h3>

    case 'body':
      return <p className="text-sm text-gray-500 leading-relaxed">{block.text}</p>

    case 'cta':
      return (
        <button
          className={`w-full py-3.5 rounded-xl font-bold text-sm ${
            block.style === 'ghost'
              ? 'border-2 border-[#34386a] text-[#34386a]'
              : 'bg-[#34386a] text-white'
          }`}
        >
          {block.text}
        </button>
      )

    case 'image':
      return (
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">
          {block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt} className="w-full h-full object-cover rounded-lg" />
          ) : (
            '📷 Image'
          )}
        </div>
      )

    case 'logo':
      return (
        <div className="flex justify-center py-1">
          <div className="w-8 h-8 rounded bg-[#34386a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
        </div>
      )

    case 'spacer':
      return (
        <div
          className={`w-full bg-gray-50 border border-dashed border-gray-200 rounded text-center text-[10px] text-gray-300 ${
            block.size === 'lg' ? 'h-10' : block.size === 'sm' ? 'h-3' : 'h-6'
          }`}
        >
          spacer
        </div>
      )

    case 'social_proof':
      return (
        <div className="flex items-center gap-2 py-1">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
            ))}
          </div>
          <div>
            <div className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(block.rating ?? 5))}</div>
            <p className="text-[10px] text-gray-500">{block.text}</p>
          </div>
        </div>
      )

    case 'form':
      return (
        <div className="space-y-2">
          {block.fields.map((f) => (
            <div key={f} className="h-9 bg-gray-100 rounded-lg border border-gray-200 px-3 flex items-center">
              <span className="text-xs text-gray-400 capitalize">{f}</span>
            </div>
          ))}
          <button className="w-full py-3 bg-[#34386a] text-white rounded-xl font-bold text-sm">
            {block.ctaText}
          </button>
        </div>
      )

    case 'quiz_radio':
    case 'quiz_list':
      return (
        <div className="space-y-2">
          <p className="font-semibold text-sm text-gray-900">{block.question}</p>
          <div className="space-y-1.5">
            {block.options.slice(0, 4).map((opt) => (
              <div key={opt.id} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg text-xs text-gray-600">
                {opt.emoji && <span>{opt.emoji}</span>}
                <span className="flex-1">{opt.text}</span>
                {block.type === 'quiz_radio' && (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      )

    case 'quiz_button':
      return (
        <div className="space-y-2">
          <p className="font-semibold text-sm text-gray-900">{block.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {block.options.slice(0, 4).map((opt) => (
              <button key={opt.id} className="p-3 bg-[#34386a] text-white rounded-xl text-xs font-bold text-center">
                {opt.emoji && <div>{opt.emoji}</div>}
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )

    case 'quiz_image':
      return (
        <div className="space-y-2">
          <p className="font-semibold text-sm text-gray-900">{block.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {block.options.slice(0, 4).map((opt) => (
              <div key={opt.id} className="aspect-square bg-gray-200 rounded-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-[#34386a] text-white text-[10px] font-bold p-1.5 text-center">
                  {opt.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'divider':
      return <hr className="border-gray-200" />

    default:
      return (
        <div className="text-xs text-gray-400 bg-gray-50 rounded p-2 text-center">
          {block.type} block
        </div>
      )
  }
}

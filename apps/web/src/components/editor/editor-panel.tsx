'use client'

import { useEditorStore } from '@/store/editor-store'
import { ScrollArea, Input, Label, Button, Textarea } from '@landup/ui'
import { Settings, Sparkles } from 'lucide-react'
import type { FunnelPage, Block } from '@landup/types'

interface EditorPanelProps {
  page: FunnelPage | null
}

export function EditorPanel({ page }: EditorPanelProps) {
  const { selectedBlockIndex, updateBlock, openAIEdit } = useEditorStore()

  if (!page) {
    return (
      <aside className="w-64 bg-white border-l flex items-center justify-center">
        <p className="text-xs text-gray-400">Select a page</p>
      </aside>
    )
  }

  const selectedBlock =
    selectedBlockIndex !== null ? page.blocks[selectedBlockIndex] : null

  return (
    <aside className="w-64 bg-white border-l flex flex-col shrink-0">
      <div className="p-3 border-b flex items-center gap-2">
        <Settings className="w-4 h-4 text-gray-400" />
        <p className="text-xs font-semibold text-gray-600">
          {selectedBlock ? `${selectedBlock.type} settings` : 'Page settings'}
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {selectedBlock !== null && selectedBlock !== undefined && selectedBlockIndex !== null ? (
            <BlockSettings
              block={selectedBlock}
              onUpdate={(updated) => updateBlock(page.id, selectedBlockIndex, updated)}
              onAIEdit={() => openAIEdit({ scope: 'block', pageId: page.id, blockIndex: selectedBlockIndex })}
            />
          ) : (
            <PageSettings page={page} />
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

function BlockSettings({
  block,
  onUpdate,
  onAIEdit,
}: {
  block: Block
  onUpdate: (b: Block) => void
  onAIEdit: () => void
}) {
  return (
    <div className="space-y-4">
      {/* AI quick edit button */}
      <Button size="sm" className="w-full gap-2" onClick={onAIEdit}>
        <Sparkles className="w-3.5 h-3.5" />
        AI Edit this block
      </Button>

      {/* Text blocks */}
      {'text' in block && (
        <div>
          <Label className="text-xs">Text</Label>
          <Textarea
            className="mt-1 text-sm"
            value={block.text}
            rows={4}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ ...block, text: e.target.value } as Block)}
          />
        </div>
      )}

      {/* CTA */}
      {block.type === 'cta' && (
        <>
          <div>
            <Label className="text-xs">Button text</Label>
            <Input
              className="mt-1 text-sm"
              value={block.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...block, text: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Link to (page ID or URL)</Label>
            <Input
              className="mt-1 text-sm"
              value={block.linkTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...block, linkTo: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Style</Label>
            <select
              className="mt-1 w-full text-sm border border-input rounded-md px-2 py-1.5"
              value={block.style ?? 'primary'}
              onChange={(e) => onUpdate({ ...block, style: e.target.value as 'primary' | 'ghost' })}
            >
              <option value="primary">Primary</option>
              <option value="ghost">Ghost / Outline</option>
            </select>
          </div>
        </>
      )}

      {/* Headline size */}
      {block.type === 'headline' && (
        <div>
          <Label className="text-xs">Size</Label>
          <select
            className="mt-1 w-full text-sm border border-input rounded-md px-2 py-1.5"
            value={block.size ?? 'xl'}
            onChange={(e) => onUpdate({ ...block, size: e.target.value as 'lg' | 'xl' | '2xl' })}
          >
            <option value="lg">Large</option>
            <option value="xl">XL</option>
            <option value="2xl">2XL</option>
          </select>
        </div>
      )}

      {/* Spacer size */}
      {block.type === 'spacer' && (
        <div>
          <Label className="text-xs">Size</Label>
          <select
            className="mt-1 w-full text-sm border border-input rounded-md px-2 py-1.5"
            value={block.size ?? 'md'}
            onChange={(e) => onUpdate({ ...block, size: e.target.value as 'sm' | 'md' | 'lg' })}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      )}
    </div>
  )
}

function PageSettings({ page }: { page: FunnelPage }) {
  const { updatePage, openAIEdit } = useEditorStore()

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Page name</Label>
        <Input
          className="mt-1 text-sm"
          value={page.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePage(page.id, { name: e.target.value })}
        />
      </div>
      <div>
        <Label className="text-xs">Page type</Label>
        <select
          className="mt-1 w-full text-sm border border-input rounded-md px-2 py-1.5"
          value={page.type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            updatePage(page.id, { type: e.target.value as FunnelPage['type'] })
          }
        >
          <option value="HERO">Hero</option>
          <option value="BRIDGE">Bridge</option>
          <option value="QUIZ">Quiz</option>
          <option value="OPTIN">Opt-In</option>
          <option value="RESULT">Result</option>
        </select>
      </div>
      <Button
        size="sm"
        className="w-full gap-2"
        onClick={() => openAIEdit({ scope: 'page', pageId: page.id })}
      >
        <Sparkles className="w-3.5 h-3.5" />
        AI Edit this page
      </Button>
    </div>
  )
}

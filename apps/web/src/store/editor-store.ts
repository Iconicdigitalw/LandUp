import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Block, FunnelPage } from '@landup/types'

export type AIEditTarget =
  | { scope: 'block'; pageId: string; blockIndex: number }
  | { scope: 'page'; pageId: string }
  | { scope: 'funnel' }
  | null

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface EditorState {
  // Core state
  funnelId: string
  funnelName: string
  pages: FunnelPage[]
  activePageId: string | null

  // Selection
  selectedBlockIndex: number | null

  // AI edit
  aiTarget: AIEditTarget
  aiChatOpen: boolean
  aiMessages: ChatMessage[]
  aiIsStreaming: boolean

  // Publishing
  isDirty: boolean
  isSaving: boolean

  // Actions
  setActivePage: (pageId: string) => void
  selectBlock: (blockIndex: number | null) => void
  updateBlock: (pageId: string, blockIndex: number, block: Block) => void
  addBlock: (pageId: string, block: Block, afterIndex?: number) => void
  removeBlock: (pageId: string, blockIndex: number) => void
  moveBlock: (pageId: string, fromIndex: number, toIndex: number) => void
  updatePage: (pageId: string, data: Partial<FunnelPage>) => void
  addPage: (page: FunnelPage, afterIndex?: number) => void
  removePage: (pageId: string) => void
  reorderPages: (newOrder: FunnelPage[]) => void

  // AI
  openAIEdit: (target: AIEditTarget) => void
  closeAIEdit: () => void
  toggleAIChat: () => void
  addChatMessage: (msg: ChatMessage) => void
  setAIStreaming: (streaming: boolean) => void
  applyAIChanges: (changes: Array<{ pageId: string; blockIndex: number; updatedBlock: Block }>) => void

  // Save
  markDirty: () => void
  markSaved: () => void
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    funnelId: '',
    funnelName: '',
    pages: [],
    activePageId: null,
    selectedBlockIndex: null,
    aiTarget: null,
    aiChatOpen: false,
    aiMessages: [],
    aiIsStreaming: false,
    isDirty: false,
    isSaving: false,

    setActivePage: (pageId) =>
      set((state) => {
        state.activePageId = pageId
        state.selectedBlockIndex = null
      }),

    selectBlock: (blockIndex) =>
      set((state) => {
        state.selectedBlockIndex = blockIndex
      }),

    updateBlock: (pageId, blockIndex, block) =>
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId)
        if (page) {
          page.blocks[blockIndex] = block
          state.isDirty = true
        }
      }),

    addBlock: (pageId, block, afterIndex) =>
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId)
        if (page) {
          const idx = afterIndex !== undefined ? afterIndex + 1 : page.blocks.length
          page.blocks.splice(idx, 0, block)
          state.isDirty = true
        }
      }),

    removeBlock: (pageId, blockIndex) =>
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId)
        if (page) {
          page.blocks.splice(blockIndex, 1)
          state.isDirty = true
          if (state.selectedBlockIndex === blockIndex) state.selectedBlockIndex = null
        }
      }),

    moveBlock: (pageId, fromIndex, toIndex) =>
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId)
        if (page) {
          const [block] = page.blocks.splice(fromIndex, 1)
          if (block) page.blocks.splice(toIndex, 0, block)
          state.isDirty = true
        }
      }),

    updatePage: (pageId, data) =>
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId)
        if (page) {
          Object.assign(page, data)
          state.isDirty = true
        }
      }),

    addPage: (page, afterIndex) =>
      set((state) => {
        const idx = afterIndex !== undefined ? afterIndex + 1 : state.pages.length
        state.pages.splice(idx, 0, page)
        state.activePageId = page.id
        state.isDirty = true
      }),

    removePage: (pageId) =>
      set((state) => {
        const idx = state.pages.findIndex((p) => p.id === pageId)
        if (idx !== -1) {
          state.pages.splice(idx, 1)
          if (state.activePageId === pageId) {
            state.activePageId = state.pages[0]?.id ?? null
          }
          state.isDirty = true
        }
      }),

    reorderPages: (newOrder) =>
      set((state) => {
        state.pages = newOrder
        state.isDirty = true
      }),

    openAIEdit: (target) =>
      set((state) => {
        state.aiTarget = target
        state.aiChatOpen = true
      }),

    closeAIEdit: () =>
      set((state) => {
        state.aiTarget = null
        state.aiChatOpen = false
      }),

    toggleAIChat: () =>
      set((state) => {
        state.aiChatOpen = !state.aiChatOpen
      }),

    addChatMessage: (msg) =>
      set((state) => {
        state.aiMessages.push(msg)
      }),

    setAIStreaming: (streaming) =>
      set((state) => {
        state.aiIsStreaming = streaming
      }),

    applyAIChanges: (changes) =>
      set((state) => {
        for (const change of changes) {
          const page = state.pages.find((p) => p.id === change.pageId)
          if (page && page.blocks[change.blockIndex]) {
            page.blocks[change.blockIndex] = change.updatedBlock as Block
          }
        }
        state.isDirty = true
      }),

    markDirty: () => set((state) => { state.isDirty = true }),
    markSaved: () => set((state) => { state.isDirty = false; state.isSaving = false }),
  }))
)

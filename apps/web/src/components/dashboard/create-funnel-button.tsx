'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
} from '@landup/ui'
import { STARTER_TEMPLATES } from '@/lib/templates'

export function CreateFunnelButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'template' | 'name'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setIsCreating(true)
    const res = await fetch('/api/funnels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, templateId: selectedTemplate }),
    })
    const data = await res.json()
    setIsCreating(false)
    setOpen(false)
    router.push(`/editor/${data.id}`)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" />
        New Funnel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a new funnel</DialogTitle>
            <DialogDescription>
              {step === 'template'
                ? 'Pick a template to get started quickly, or start from scratch.'
                : 'Give your funnel a name.'}
            </DialogDescription>
          </DialogHeader>

          {step === 'template' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STARTER_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id)
                      setName(t.name)
                      setStep('name')
                    }}
                    className={`text-left border rounded-xl p-4 hover:border-brand-dark hover:bg-brand-bg-light transition-colors ${
                      selectedTemplate === t.id ? 'border-brand-dark bg-brand-bg-light' : ''
                    }`}
                  >
                    <div className="text-2xl mb-2">{t.emoji}</div>
                    <div className="font-semibold text-sm text-brand-dark">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedTemplate(null)
                    setName('')
                    setStep('name')
                  }}
                  className="text-left border rounded-xl p-4 hover:border-brand-dark hover:bg-brand-bg-light transition-colors border-dashed"
                >
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-semibold text-sm text-brand-dark">Blank</div>
                  <div className="text-xs text-gray-500 mt-0.5">Start from scratch</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="funnel-name">Funnel name</Label>
                <Input
                  id="funnel-name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="e.g. My Coaching Funnel"
                  className="mt-1"
                  autoFocus
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep('template')}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={isCreating || !name.trim()}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create funnel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

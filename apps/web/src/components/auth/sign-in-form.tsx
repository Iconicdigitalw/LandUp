'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button, Input, Label, Separator } from '@landup/ui'
import { Chrome, Mail, Loader2 } from 'lucide-react'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setIsEmailLoading(true)
    await signIn('resend', { email, callbackUrl: '/dashboard', redirect: false })
    setIsEmailLoading(false)
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="w-12 h-12 bg-brand-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-brand-dark" />
        </div>
        <h2 className="font-semibold text-brand-dark mb-2">Check your email</h2>
        <p className="text-sm text-gray-500">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in.
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-xs text-brand-dark underline mt-4"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-8 space-y-4">
      {/* Google */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Chrome className="w-4 h-4" />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-gray-400">or</span>
        <Separator className="flex-1" />
      </div>

      {/* Email magic link */}
      <form onSubmit={handleEmailSignIn} className="space-y-3">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isEmailLoading}>
          {isEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Send magic link
        </Button>
      </form>
    </div>
  )
}

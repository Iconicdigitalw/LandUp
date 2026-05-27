import { SignInForm } from '@/components/auth/sign-in-form'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-brand-dark text-xl">LandUp!</span>
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark mt-6 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to build your funnels</p>
        </div>

        <SignInForm />

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in you agree to our{' '}
          <Link href="/terms" className="underline hover:text-brand-dark">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-brand-dark">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

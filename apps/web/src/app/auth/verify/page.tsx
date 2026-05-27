import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-brand-bg-light flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-brand-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-brand-dark" />
        </div>
        <h1 className="text-xl font-bold text-brand-dark mb-2">Check your inbox</h1>
        <p className="text-sm text-gray-500 mb-6">
          A magic link has been sent to your email. Click it to complete sign in.
          The link expires in 10 minutes.
        </p>
        <Link href="/auth/signin" className="text-sm text-brand-dark underline">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}

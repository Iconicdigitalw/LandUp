import Link from 'next/link'
import { Button } from '@landup/ui'
import { Zap, BarChart3, Brain, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-bg-light">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-brand-dark text-lg">LandUp!</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-dark/10 text-brand-dark rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Brain className="w-4 h-4" />
          AI-powered quiz funnels
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-brand-dark leading-tight mb-6">
          Turn visitors into
          <span className="text-brand-accent"> qualified leads</span>
          <br />in under 5 minutes
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Paste your URL. Pick a template. Get a fully personalised, mobile-first quiz funnel
          with AI copy — better analytics, fairer pricing, zero billing surprises.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="xl" className="w-full sm:w-auto">
              Start building for free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              See how it works
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">14-day free trial · No credit card required</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'AI that writes your funnel',
              desc: 'Paste your website URL and our AI scrapes your brand, rewrites every page, and builds a funnel that sounds like you — in under 6 minutes.',
            },
            {
              icon: Zap,
              title: 'Quiz-first lead qualification',
              desc: 'Pre-qualify leads with 3–5 questions before asking for contact details. Sunk cost = higher completion. Better leads = better calls.',
            },
            {
              icon: BarChart3,
              title: 'Real analytics + lead scoring',
              desc: 'Track drop-off per page, answer distributions, and score every lead automatically. Know who to call first.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-8 border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-brand-bg-light flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-dark" />
              </div>
              <h3 className="font-bold text-lg text-brand-dark mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to replace Perspective.co?</h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Better analytics, lead scoring, back-button navigation, and AI that edits on demand.
          Start free — no credit card needed.
        </p>
        <Link href="/auth/signin">
          <Button size="xl" variant="accent">
            Build your first funnel free
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      <footer className="bg-white border-t py-8 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Iconic Digital World · LandUp! ·{' '}
        <Link href="#" className="hover:underline">Privacy</Link> ·{' '}
        <Link href="#" className="hover:underline">Terms</Link>
      </footer>
    </main>
  )
}

import { nanoid } from 'nanoid'
import type { Block } from '@landup/types'

export type StarterTemplate = {
  id: string
  name: string
  emoji: string
  description: string
  niche: string
  pages: Array<{
    name: string
    type: 'HERO' | 'BRIDGE' | 'QUIZ' | 'OPTIN' | 'RESULT'
    isResult?: boolean
    blocks: Block[]
  }>
}

// ─── Helper to create a quiz option ──────────────────────────────────────────

function quizOption(text: string, emoji?: string, score = 2) {
  return {
    id: nanoid(8),
    text,
    emoji,
    score,
    linkTo: 'next', // resolved at runtime
    conditions: [],
  }
}

// ─── Coach Template ───────────────────────────────────────────────────────────

export const coachTemplate: StarterTemplate = {
  id: 'coach',
  name: 'Coach',
  emoji: '🎯',
  description: '8 pages, quiz-first, discovery call booking',
  niche: 'Life & business coaches',
  pages: [
    {
      name: 'Start',
      type: 'HERO',
      blocks: [
        { type: 'logo' },
        { type: 'eyebrow', text: 'For Coaches & Consultants' },
        {
          type: 'headline',
          text: "Finally attract high-ticket clients — without cold outreach or paid ads",
          size: '2xl',
        },
        {
          type: 'body',
          text: 'Learn how our proven quiz funnel system pre-qualifies your leads and fills your calendar with serious prospects who are ready to invest.',
        },
        { type: 'cta', text: 'Get my free strategy call', linkTo: 'next', style: 'primary' },
        {
          type: 'social_proof',
          rating: 5,
          text: 'Trusted by over 200 coaches across North America',
        },
        { type: 'spacer', size: 'lg' },
      ],
    },
    {
      name: 'Intro',
      type: 'BRIDGE',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'md' },
        { type: 'eyebrow', text: 'Free Discovery Call' },
        { type: 'headline', text: "Let's find out if we're a great fit!", size: 'xl' },
        {
          type: 'body',
          text: "We'll need a few details about your current coaching situation so we can prepare a personalised strategy for your discovery call.",
        },
        { type: 'cta', text: 'Start my assessment', linkTo: 'next', style: 'primary' },
      ],
    },
    {
      name: 'Goal',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 1 of 4' },
        {
          type: 'quiz_radio',
          question: "What's your biggest coaching challenge right now?",
          options: [
            quizOption('Attracting consistent high-ticket clients', '🎯', 4),
            quizOption('Converting leads into paying clients', '💎', 4),
            quizOption('Pricing my coaching packages confidently', '💰', 3),
            quizOption('Standing out in a crowded market', '🌟', 3),
            quizOption('Building a scalable coaching business', '🚀', 2),
            quizOption('Managing my time and energy effectively', '⚡', 2),
          ],
        },
      ],
    },
    {
      name: 'Investment',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 2 of 4' },
        {
          type: 'quiz_button',
          question: "What's your ideal monthly investment for coaching support?",
          options: [
            quizOption('Less than $500/month', '💛', 1),
            quizOption('$500 – $1,500/month', '🌟', 2),
            quizOption('$1,500 – $3,000/month', '🔥', 3),
            quizOption('$3,000+/month', '⭐', 4),
          ],
        },
      ],
    },
    {
      name: 'Stage',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 3 of 4' },
        {
          type: 'quiz_button',
          question: 'How many paying coaching clients do you currently have?',
          options: [
            quizOption("I'm just starting out", '🌱', 1),
            quizOption('1 – 3 clients', '🌿', 2),
            quizOption('4 – 10 clients', '🌳', 3),
            quizOption('10+ clients', '🏆', 4),
          ],
        },
      ],
    },
    {
      name: 'Readiness',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 4 of 4' },
        {
          type: 'quiz_list',
          question: 'When are you ready to start working on this?',
          options: [
            quizOption('Right now — I need this urgently', '🚨', 4),
            quizOption('Within the next 2 weeks', '⚡', 3),
            quizOption('In the next 1–2 months', '📅', 2),
            quizOption("Just exploring for now", '🔍', 1),
          ],
        },
      ],
    },
    {
      name: 'Opt-In',
      type: 'OPTIN',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        {
          type: 'eyebrow',
          text: "Final step. Please only book if you're seriously committed to transforming your coaching business 🙏",
        },
        {
          type: 'headline',
          text: 'Ready to fill your calendar with ideal clients? Book your free discovery call now!',
          size: 'xl',
        },
        {
          type: 'form',
          fields: ['name', 'email', 'phone'],
          ctaText: 'Proceed to choose a date',
          disclaimer: 'I have read and agree to the Terms of Use and Privacy Policy',
        },
      ],
    },
    {
      name: 'Thank You',
      type: 'RESULT',
      isResult: true,
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Congratulations! Your Discovery Call is Confirmed!' },
        { type: 'headline', text: "Your booking was successful — we're excited to speak with you!", size: 'xl' },
        {
          type: 'body',
          text: "We'll review your assessment answers before the call so we can make the most of our time together. To maximise your results, please watch this short video before we speak.",
        },
        { type: 'cta', text: 'Watch my pre-call video', linkTo: '#', style: 'primary' },
      ],
    },
  ],
}

// ─── Consultant Template ──────────────────────────────────────────────────────

export const consultantTemplate: StarterTemplate = {
  id: 'consultant',
  name: 'Consultant',
  emoji: '📊',
  description: '7 pages, qualification-focused, strategy session',
  niche: 'Business & strategy consultants',
  pages: [
    {
      name: 'Start',
      type: 'HERO',
      blocks: [
        { type: 'logo' },
        { type: 'eyebrow', text: 'For Growing Businesses' },
        { type: 'headline', text: "Scale your business without the guesswork — get a proven growth strategy in 45 minutes", size: '2xl' },
        { type: 'body', text: 'We\'ll diagnose your biggest growth bottleneck and give you a clear, actionable roadmap on our free strategy session.' },
        { type: 'cta', text: 'Book my free strategy session', linkTo: 'next', style: 'primary' },
        { type: 'social_proof', rating: 5, text: 'Trusted by 150+ companies across 12 industries' },
      ],
    },
    {
      name: 'Intro',
      type: 'BRIDGE',
      blocks: [
        { type: 'logo' },
        { type: 'spacer', size: 'md' },
        { type: 'eyebrow', text: 'Free Strategy Session' },
        { type: 'headline', text: "Let's diagnose your growth bottleneck", size: 'xl' },
        { type: 'body', text: 'Answer 4 quick questions so we can prepare a tailored growth strategy for your business before we speak.' },
        { type: 'cta', text: 'Start the assessment', linkTo: 'next', style: 'primary' },
      ],
    },
    {
      name: 'Challenge',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 1 of 4' },
        { type: 'quiz_radio', question: "What's your company's primary growth challenge?", options: [
          quizOption('Generating consistent qualified leads', '🎯', 4),
          quizOption('Converting leads into customers', '💎', 4),
          quizOption('Scaling operations without chaos', '⚙️', 3),
          quizOption('Building and retaining a strong team', '👥', 3),
          quizOption('Improving profitability & margins', '📈', 3),
          quizOption('Expanding into new markets', '🌍', 2),
        ]},
      ],
    },
    {
      name: 'Revenue',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 2 of 4' },
        { type: 'quiz_image', question: "What's your company's current annual revenue?", options: [
          quizOption('Under $500K', undefined, 1),
          quizOption('$500K – $2M', undefined, 2),
          quizOption('$2M – $10M', undefined, 3),
          quizOption('$10M+', undefined, 4),
        ]},
      ],
    },
    {
      name: 'Authority',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 3 of 4' },
        { type: 'quiz_button', question: 'Are you the decision-maker for this investment?', options: [
          quizOption('Yes — it\'s my decision', '✅', 4),
          quizOption('Shared decision with a partner', '🤝', 3),
          quizOption('I need to consult the board', '📋', 2),
          quizOption('I\'m researching for someone else', '🔍', 1),
        ]},
      ],
    },
    {
      name: 'Timeline',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 4 of 4' },
        { type: 'quiz_list', question: 'What\'s your target timeline for seeing results?', options: [
          quizOption('ASAP — this is urgent', '🚨', 4),
          quizOption('Within 90 days', '⚡', 3),
          quizOption('This quarter', '📅', 2),
          quizOption('Long-term planning', '🗓️', 1),
        ]},
      ],
    },
    {
      name: 'Opt-In',
      type: 'OPTIN',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: "Final step. Please only apply if you're ready to invest in real growth 🙏" },
        { type: 'headline', text: 'Book your free 45-minute strategy session', size: 'xl' },
        { type: 'form', fields: ['name', 'email', 'phone'], ctaText: 'Claim my strategy session', disclaimer: 'I agree to the Terms and Privacy Policy' },
      ],
    },
    {
      name: 'Confirmed',
      type: 'RESULT',
      isResult: true,
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Congratulations! Your Strategy Session is Booked!' },
        { type: 'headline', text: "Your session is confirmed — expect a confirmation email shortly", size: 'xl' },
        { type: 'body', text: "We'll review your assessment answers to ensure we cover your most critical growth opportunities. Please review our pre-session resources in the meantime." },
        { type: 'cta', text: 'View growth resources', linkTo: '#', style: 'primary' },
      ],
    },
  ],
}

// ─── Local Business Template ──────────────────────────────────────────────────

export const localBizTemplate: StarterTemplate = {
  id: 'local-biz',
  name: 'Local Business',
  emoji: '🏪',
  description: '6 pages, appointment booking, local trust signals',
  niche: 'Local service businesses',
  pages: [
    {
      name: 'Start',
      type: 'HERO',
      blocks: [
        { type: 'logo' },
        { type: 'eyebrow', text: 'Serving Your Community' },
        { type: 'headline', text: "Get expert help fast — book your free consultation today", size: '2xl' },
        { type: 'body', text: 'Answer 3 quick questions and we\'ll match you with the right solution for your specific situation.' },
        { type: 'cta', text: 'Book my free consultation', linkTo: 'next', style: 'primary' },
        { type: 'social_proof', rating: 5, text: 'Trusted by over 500 local families' },
      ],
    },
    {
      name: 'Concern',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 1 of 3' },
        { type: 'quiz_radio', question: "What brings you here today?", options: [
          quizOption('I have an urgent issue that needs fixing', '🚨', 4),
          quizOption('I\'m doing routine maintenance / check-up', '🔧', 3),
          quizOption('I want a second opinion', '💭', 3),
          quizOption('I\'m planning ahead for the future', '📅', 2),
        ]},
      ],
    },
    {
      name: 'Urgency',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 2 of 3' },
        { type: 'quiz_button', question: 'How soon do you need help?', options: [
          quizOption('Today or tomorrow', '⚡', 4),
          quizOption('This week', '🗓️', 3),
          quizOption('This month', '📅', 2),
          quizOption('Just exploring options', '🔍', 1),
        ]},
      ],
    },
    {
      name: 'Budget',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 3 of 3' },
        { type: 'quiz_list', question: 'Do you have a budget range in mind?', options: [
          quizOption('Under $500', '💛', 1),
          quizOption('$500 – $2,000', '🌟', 2),
          quizOption('$2,000 – $5,000', '🔥', 3),
          quizOption('$5,000+', '⭐', 4),
        ]},
      ],
    },
    {
      name: 'Opt-In',
      type: 'OPTIN',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Last step — book your free appointment below' },
        { type: 'headline', text: 'Book your free no-obligation consultation', size: 'xl' },
        { type: 'form', fields: ['name', 'email', 'phone'], ctaText: 'Book my free appointment', disclaimer: 'We\'ll never share your details. Privacy Policy applies.' },
      ],
    },
    {
      name: 'Booked',
      type: 'RESULT',
      isResult: true,
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Your appointment is confirmed! 🎉' },
        { type: 'headline', text: "We'll see you soon — check your email for details", size: 'xl' },
        { type: 'body', text: "We'll send you a confirmation with everything you need to prepare. Feel free to call us if you have any questions before then." },
        { type: 'cta', text: 'View our reviews', linkTo: '#', style: 'ghost' },
      ],
    },
  ],
}

// ─── Agency Template ──────────────────────────────────────────────────────────

export const agencyTemplate: StarterTemplate = {
  id: 'agency',
  name: 'Agency',
  emoji: '🏢',
  description: '7 pages, project enquiry, portfolio positioning',
  niche: 'Digital agencies & creative studios',
  pages: [
    {
      name: 'Start',
      type: 'HERO',
      blocks: [
        { type: 'logo' },
        { type: 'eyebrow', text: 'For Ambitious Brands' },
        { type: 'headline', text: "Transform your digital presence into a growth engine — without the agency runaround", size: '2xl' },
        { type: 'body', text: 'Tell us about your project and we\'ll give you a clear strategy and honest quote within 24 hours.' },
        { type: 'cta', text: 'Get my free project assessment', linkTo: 'next', style: 'primary' },
        { type: 'social_proof', rating: 5, text: 'Delivered 300+ projects across 15 industries' },
      ],
    },
    {
      name: 'Intro',
      type: 'BRIDGE',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'md' },
        { type: 'eyebrow', text: 'Free Project Assessment' },
        { type: 'headline', text: "Let's understand your project", size: 'xl' },
        { type: 'body', text: 'Answer 4 questions about your project and goals. We\'ll review your answers and prepare a tailored proposal.' },
        { type: 'cta', text: 'Start the assessment', linkTo: 'next', style: 'primary' },
      ],
    },
    {
      name: 'Service',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 1 of 4' },
        { type: 'quiz_radio', question: "What do you need help with?", options: [
          quizOption('Website design & development', '🌐', 4),
          quizOption('Brand identity & strategy', '🎨', 4),
          quizOption('Digital marketing & SEO', '📈', 3),
          quizOption('E-commerce & online store', '🛍️', 3),
          quizOption('App design or development', '📱', 3),
          quizOption('Ongoing marketing retainer', '🔄', 4),
        ]},
      ],
    },
    {
      name: 'Budget',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 2 of 4' },
        { type: 'quiz_image', question: "What's your approximate project budget?", options: [
          quizOption('Under $5,000', undefined, 1),
          quizOption('$5,000 – $15,000', undefined, 2),
          quizOption('$15,000 – $50,000', undefined, 3),
          quizOption('$50,000+', undefined, 4),
        ]},
      ],
    },
    {
      name: 'Timeline',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 3 of 4' },
        { type: 'quiz_button', question: "When do you need this completed?", options: [
          quizOption('ASAP — urgent project', '🚨', 4),
          quizOption('Within 1 month', '⚡', 3),
          quizOption('2–3 months', '📅', 2),
          quizOption('3+ months, planning ahead', '🗓️', 1),
        ]},
      ],
    },
    {
      name: 'Opt-In',
      type: 'OPTIN',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: "Last step — tell us where to send your proposal 🙏" },
        { type: 'headline', text: "Get your free project proposal within 24 hours", size: 'xl' },
        { type: 'form', fields: ['name', 'email', 'phone'], ctaText: 'Send me my proposal', disclaimer: 'No spam. We\'ll only contact you about your project.' },
      ],
    },
    {
      name: 'Submitted',
      type: 'RESULT',
      isResult: true,
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Enquiry received! We\'ll be in touch within 24 hours 🎉' },
        { type: 'headline', text: "Thanks — your project assessment is on its way", size: 'xl' },
        { type: 'body', text: "One of our strategists will review your answers and reach out within 24 hours with a tailored proposal. In the meantime, explore our recent work below." },
        { type: 'cta', text: 'View our portfolio', linkTo: '#', style: 'primary' },
      ],
    },
  ],
}

// ─── SaaS Demo Template ───────────────────────────────────────────────────────

export const saasTemplate: StarterTemplate = {
  id: 'saas-demo',
  name: 'SaaS Demo',
  emoji: '⚡',
  description: '6 pages, demo/trial signup, qualification',
  niche: 'SaaS & software companies',
  pages: [
    {
      name: 'Start',
      type: 'HERO',
      blocks: [
        { type: 'logo' },
        { type: 'eyebrow', text: 'See It In Action' },
        { type: 'headline', text: "See exactly how [Product] solves your biggest problem in a personalised 20-minute demo", size: '2xl' },
        { type: 'body', text: 'Tell us about your current situation and we\'ll show you the features that matter most to you — no generic demos.' },
        { type: 'cta', text: 'Book my personalised demo', linkTo: 'next', style: 'primary' },
        { type: 'social_proof', rating: 5, text: 'Trusted by 1,000+ teams worldwide' },
      ],
    },
    {
      name: 'Role',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 1 of 3' },
        { type: 'quiz_button', question: "Which best describes your role?", options: [
          quizOption('Founder / CEO', '👑', 4),
          quizOption('Head of Marketing', '📣', 4),
          quizOption('Sales Leader', '🎯', 3),
          quizOption('Operations / Product', '⚙️', 3),
        ]},
      ],
    },
    {
      name: 'Team Size',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 2 of 3' },
        { type: 'quiz_list', question: "How big is your team?", options: [
          quizOption('Just me', '🧑', 1),
          quizOption('2 – 10 people', '👥', 2),
          quizOption('11 – 50 people', '🏢', 3),
          quizOption('50+ people', '🏭', 4),
        ]},
      ],
    },
    {
      name: 'Goal',
      type: 'QUIZ',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Question 3 of 3' },
        { type: 'quiz_radio', question: "What's your primary goal for the next 90 days?", options: [
          quizOption('Generate more qualified leads', '🎯', 4),
          quizOption('Improve conversion rates', '📈', 4),
          quizOption('Reduce churn & improve retention', '🔄', 3),
          quizOption('Scale without hiring more people', '🚀', 3),
          quizOption('Better reporting & analytics', '📊', 2),
        ]},
      ],
    },
    {
      name: 'Opt-In',
      type: 'OPTIN',
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'One last step — where should we send your demo details?' },
        { type: 'headline', text: "Reserve your personalised demo slot", size: 'xl' },
        { type: 'form', fields: ['name', 'email'], ctaText: 'Book my demo', disclaimer: 'No spam. Unsubscribe anytime.' },
      ],
    },
    {
      name: 'Confirmed',
      type: 'RESULT',
      isResult: true,
      blocks: [
        { type: 'logo' }, { type: 'spacer', size: 'sm' },
        { type: 'eyebrow', text: 'Your demo is booked! 🎉' },
        { type: 'headline', text: "See you soon — check your email for your calendar invite", size: 'xl' },
        { type: 'body', text: "Your personalised demo is confirmed. We\'ve noted your goals and will tailor the session specifically for you. Check your email for your calendar invite." },
        { type: 'cta', text: 'Start your free trial now', linkTo: '#', style: 'primary' },
      ],
    },
  ],
}

// ─── Template Registry ────────────────────────────────────────────────────────

export const STARTER_TEMPLATES: StarterTemplate[] = [
  coachTemplate,
  consultantTemplate,
  localBizTemplate,
  agencyTemplate,
  saasTemplate,
]

export function getTemplate(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id)
}

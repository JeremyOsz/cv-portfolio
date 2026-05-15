/**
 * Chat service — handles sending messages and getting AI responses.
 *
 * Uses OpenAI API when VITE_OPENAI_API_KEY is set.
 * Falls back to rich mock responses otherwise.
 *
 * To enable real AI:
 *   1. Create .env in apps/cv-portfolio/ with: VITE_OPENAI_API_KEY=sk-...
 *   2. Restart dev server
 *
 * For production, replace the client-side call with a serverless function
 * to avoid exposing the API key.
 */

import OpenAI from 'openai'
import type { CV, ChatMessage } from '@/types/cv'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const AI_ENABLED = !!API_KEY

let openaiClient: OpenAI | null = null
if (AI_ENABLED) {
  openaiClient = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true, // OK for dev; use serverless fn for prod
  })
}

/**
 * Build a system prompt from the CV context for LLM consumption.
 */
export function buildSystemPrompt(cv: CV): string {
  const parts = [
    `You are an AI assistant on the portfolio website of ${cv.name}, who is a ${cv.title?.replace(/\.$/, '')}.`,
    `Answer questions about their experience, skills, leadership, and approach honestly and specifically.`,
    `Use the context below to inform your answers. Be professional but personable.`,
    `Focus on work, career, and professional skills.`,
    `Use markdown formatting (bold, bullets, headers) for readability.`,
    `If you genuinely don't have enough information, say so honestly — do not make things up.`,
    `Keep answers concise but thorough — aim for 150-250 words.`,
    '',
    '--- CAREER CONTEXT ---',
    '',
  ]

  if (cv.summary) parts.push('## Introduction', cv.summary, '')

  if (cv.experience?.length) {
    parts.push('## Experience')
    cv.experience.forEach((exp) => {
      parts.push(`### ${exp.role} at ${exp.org} (${exp.dates})`)
      if (exp.highlights?.length) {
        exp.highlights.forEach((h) => parts.push(`- ${h}`))
      }
      parts.push('')
    })
  }

  if (cv.education?.length) {
    parts.push('## Education')
    cv.education.forEach((e) => parts.push(`- ${e.degree}, ${e.school} (${e.dates})`))
    parts.push('')
  }

  if (cv.skillsAndStack) parts.push('## Skills & Tech Stack', cv.skillsAndStack, '')
  if (cv.interviewPrep) parts.push('## Strengths & Interview Prep', cv.interviewPrep, '')
  if (cv.careerPositioning) parts.push('## Career Positioning', cv.careerPositioning, '')
  if (cv.workSummary) parts.push('## Work Summary', cv.workSummary, '')
  if (cv.aiStrategy) parts.push('## AI Strategy', cv.aiStrategy, '')
  if (cv.aiInitiatives) parts.push('## AI Initiatives', cv.aiInitiatives, '')
  if (cv.documentationEpic) parts.push('## Documentation Epic', cv.documentationEpic, '')
  if (cv.teamComposition) parts.push('## Team & Hiring', cv.teamComposition, '')
  if (cv.rawSections?.workReadme) parts.push('## Recent Work Notes', cv.rawSections.workReadme, '')

  return parts.join('\n')
}

/**
 * Send a message and get a response.
 * Uses OpenAI if API key is available, otherwise falls back to mock.
 */
export async function sendMessage(
  userMessage: string,
  cv: CV,
  conversationHistory: ChatMessage[] = []
): Promise<ChatMessage> {
  if (AI_ENABLED && openaiClient) {
    return sendMessageAI(userMessage, cv, conversationHistory)
  }
  return sendMessageMock(userMessage, cv)
}

/** Whether the chatbot is using real AI */
export function isAIEnabled(): boolean {
  return AI_ENABLED
}

// --- Real AI via OpenAI ---

async function sendMessageAI(
  userMessage: string,
  cv: CV,
  conversationHistory: ChatMessage[]
): Promise<ChatMessage> {
  const systemPrompt = buildSystemPrompt(cv)

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  try {
    const response = await openaiClient!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    })

    return {
      role: 'assistant',
      content: response.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.",
    }
  } catch (err) {
    console.error('OpenAI API error:', err)
    return {
      role: 'assistant',
      content: 'Sorry, there was an error connecting to the AI service. Please try again.',
    }
  }
}

// --- Mock responses (fallback when no API key) ---

async function sendMessageMock(userMessage: string, cv: CV): Promise<ChatMessage> {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 700))

  const q = userMessage.toLowerCase()
  const name = cv.name || 'Jeremy Osztreicher'

  if (q.includes('lead') || q.includes('leadership') || q.includes('manage') || q.includes('manager')) {
    return {
      role: 'assistant',
      content: `${name} is an **engineering leader** who combines hands-on technical work with people management:

**At the Royal Opera House (Tech Lead, Apr 2024 – present):**
- **Line manager of 7 developers** (senior through junior) — 1:1s, mentoring, career growth
- **Hiring** — recently led the process for 9 FTE agency positions; designed the interview framework and team composition analysis
- **AI strategy** — authored the department's responsible AI proposal, including workshops, hack days, and a living policy
- **Agency transition** — managing handover between agencies while maintaining quality
- **Workshop facilitation** — modularisation workshops for digital architecture

**Previously:** Line-managed 3 junior developers as Senior Developer at ROH.

**Philosophy:** *"I want to multiply impact through others and shape how teams treat content and data. Happy, motivated developers deliver better products."*`,
    }
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('language') || q.includes('tool')) {
    return {
      role: 'assistant',
      content: `${name}'s stack spans production platforms, cultural data products, AI-assisted systems, and sonic systems:

**Languages:** TypeScript (primary), JavaScript/Node.js, Python, HCL (Terraform), some Go and Rust
**Frontend:** React 17/18/19, Next.js, SvelteKit, Vike (SSR), Styled Components, Tailwind, Radix UI
**State & data:** React Query, Zustand, Redux/Saga
**CMS:** Sanity (led migration at Movember), Prismic, Strapi
**Backend:** AWS Lambda (6+ services), Express, Serverless framework
**Infrastructure:** AWS (Lambda, S3, DynamoDB, CloudWatch, IAM, ALB, ECR, Amplify), Cloudflare Workers/Durable Objects/R2/KV, Terraform (multi-env), Fastly, Akamai, Docker
**Creative systems:** Web Audio API, p5.js, D3, adaptive music systems, generative synthesis
**Testing:** Jest, Vitest, Testing Library, k6 (load testing)
**Validation:** Joi, Zod

Recent public projects include London Dance Calendar, Osztrology, Hero Syndrome's adaptive music engine, Opera Archive Explorer, Aroma Herbarium, and browser-based sound design sketches.`,
    }
  }

  if (q.includes('architect') || q.includes('code review') || q.includes('technical decision')) {
    return {
      role: 'assistant',
      content: `${name} owns technical direction and is hands-on in architecture and code review:

**Architecture:**
- Shaped the web platform for ticketing, checkout, accounts, seat mapping, and content delivery
- Led content architecture migration to **Sanity** at Movember — owned models, integration, and editor experience
- Designed an aggregation/cache layer (Pocketbase) for complex casting data — surgical updates, lower load
- APIs and data models consumed by 6+ internal teams: Content, Ballet, Opera, Front of House, Rehearsal, IT

**Code review:** Reviews PRs regularly — uses it as both quality gate and teaching moment. Orders by freshness/size for throughput.

**Thinking style:** Systems-first — flow, composability, abstraction layers. Not dogmatic about tech: evaluates tradeoffs and picks what fits the problem.`,
    }
  }

  if (q.includes('content') || q.includes('cms') || q.includes('sanity') || q.includes('headless') || q.includes('prismic')) {
    return {
      role: 'assistant',
      content: `**Content and headless CMS is ${name}'s core speciality** — a career throughline, not a side skill:

**Movember:** Led migration from proprietary CMS to **Sanity**. Owned content architecture, models, and integration. Educated the org on content as structured data. Outcomes: brand consistency, reduced proprietary dependency, better workflow.

**Royal Opera House:** Shapes content workflows for complex processes (casting) with **Prismic** and **Strapi**. Complex casting data from enterprise systems; Pocketbase aggregation layer. Learning platform and streaming as multi-consumer data products.

**The thread:** *"Content as real-time, structured data — not just 'build a page.' I've designed the shape of data and the editor experience, worked with architects, content authors, translation, and BAs, and iterated from their feedback."*`,
    }
  }

  if (q.includes('fit') || q.includes('good for') || q.includes('startup') || q.includes('hire') || q.includes('strength') || q.includes('why')) {
    return {
      role: 'assistant',
      content: `Here's what ${name} brings — and where the fit is strongest:

**Core strengths:**
- **Headless CMS & content-as-data specialist** — career thread from Sanity at Movember through Prismic/Strapi at ROH
- **Hands-on leader** — architecture, code review, and key integrations while managing 7 developers
- **Systems thinker** — composability, abstraction layers, data flow; shows up in product architecture and how teams are run
- **Bridges strategy and execution** — AI strategy, agency transition, CDN change, modularisation. Shapes direction *and* delivers
- **Platform builder** — APIs and data models that 6+ internal teams depend on

**Best fit:**
- Content, data, or platform-first companies (CMS, developer tools, media, marketplaces)
- Hands-on EM or Tech Lead where strategy and people are the main job
- Complex, multi-stakeholder environments (ticketing, e-commerce, live events)
- Scale-ups where the EM shapes both stack and team`,
    }
  }

  if (q.includes('fail') || q.includes('challenge') || q.includes('difficult') || q.includes('weakness') || q.includes('biggest')) {
    return {
      role: 'assistant',
      content: `${name} is honest about challenges — these come from their own reflections:

**Prioritisation under ambiguity:** The most draining part of work is *"working out what to do at any time."* Built systems to cope: a personal knowledge repo, back-burner triage, weekly reviews.

**IC vs management tension:** *"Intended to review more PRs this week; didn't get to them."* Consciously plans focus blocks and accepts some weeks are meeting-heavy.

**Underselling strengths:** From their own prep: *"I tend to undersell or forget these."* Actively works on recognising and articulating what they bring.

These are patterns they've noticed, named, and are adjusting — self-aware rather than stuck.`,
    }
  }

  if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('strategy')) {
    return {
      role: 'assistant',
      content: `${name} is actively shaping AI adoption in engineering — strategy, not just tool use:

**AI Proposal:** Authored *"A Proposal for Responsible AI Usage in Digital Products"* with two principles: (1) improve quality before breaking new ground, (2) enhance expertise, not replace it.

**Five initiatives:** Working group, living policy, developer workshop (hands-on), DP&A workshop (awareness), hack day.

**Documentation epic:** AI-assisted docs across 15+ codebases — standardised prompts → review → refine → gaps. The team's first shared AI workflow.

**Prototype:** Built an Opera Explorer Archive app with Cursor in days — 846+ recordings, search, playback, metadata analysis.

**Personal:** Built an AI-augmented knowledge system (this very repo) for structured capture, triage, and context.`,
    }
  }

  if (q.includes('music') || q.includes('sound') || q.includes('sonic') || q.includes('p5') || q.includes('creative')) {
    return {
      role: 'assistant',
      content: `${name}'s sonic systems work sits at the intersection of software engineering and artistic practice:

**Hero Syndrome:** Working on the adaptive music engine for a mobile web art piece that turns sensor-derived state vectors into composition plans and generated songs, then manages playback through a Web Audio queue.

**C3 Sound Sketches:** Browser-based synthesis and sound-design sketches using p5.js and the Web Audio API: FM/AM experiments, wavetable and subtractive synths, and a mini groovebox.

**Public speaking:** Presenting "Understanding sound design using p5.js" at c3s Code x Music on 21 May 2026.

This complements the more conventional engineering work: it shows systems thinking applied to time, interaction, generated sound, and cultural tools.`,
    }
  }

  // Default
  return {
    role: 'assistant',
    content: `**${name}** is a software engineer, technology strategist, and sonic systems artist. He combines hands-on architecture and code review (TypeScript, React, AWS/Cloudflare) with people leadership, cultural data products, AI-assisted systems, and browser-based sound tools.

**Current public work:** London Dance Calendar, Osztrology, Hero Syndrome's adaptive music engine, Opera Archive Explorer, Aroma Herbarium, and p5.js/Web Audio sound design for c3s Code x Music.

**Key specialities:** Headless CMS & content-as-data, platform engineering, AI strategy, cultural discovery products, team building, and sonic systems.

**Try asking about:**
- Leadership experience and team management
- Technical stack and architecture approach
- Content and CMS specialisation (Sanity, Prismic)
- AI strategy and how they're rolling it out
- Music, sound, and creative coding projects
- Challenges and self-awareness
- What kind of role or organisation they fit`,
  }
}

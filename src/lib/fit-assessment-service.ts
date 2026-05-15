/**
 * Honest Fit Assessment — paste a job description, get structured assessment.
 * Uses OpenAI when VITE_OPENAI_API_KEY is set; otherwise returns a mock.
 */

import OpenAI from 'openai'
import type { CV, FitAssessmentResult, FitVerdict } from '@/types/cv'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const AI_ENABLED = !!API_KEY

let openaiClient: OpenAI | null = null
if (AI_ENABLED) {
  openaiClient = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
  })
}

const FIT_SYSTEM_PROMPT = `You are an honest career fit assessor. You have full context about the candidate's CV, experience, strengths, and gaps.

CRITICAL — Anti-sycophancy:
- Do NOT default to "I could pick that up" or "my strong fundamentals would allow me to learn quickly." That is the opposite of what we need.
- You have explicit permission to say the candidate is NOT a good fit. When the role clearly does not match their background, say so. Rejection is valuable.
- Commit to a verdict. Do not hedge across paragraphs. Pick one: strong fit, worth conversation, or probably not.
- Be specific. Use the candidate's real experience and real gaps from the context. No generic fluff.

Given a job description, return a JSON object (only valid JSON, no markdown or extra text) with this exact shape:

{
  "verdict": "strong_fit" | "worth_conversation" | "probably_not",
  "summary": "Short headline. Use: 'Strong Fit — Let's Talk' for strong_fit; 'Worth a Conversation' or similar for worth_conversation; 'Honest Assessment: Probably Not Your Person' for probably_not.",
  "summaryReason": "One sentence explaining why this verdict.",
  "matches": [
    { "title": "Short label", "detail": "2-3 sentences with specific evidence from the candidate's experience." }
  ],
  "gaps": [
    { "title": "Short label", "detail": "1-2 sentences: what the role wants that the candidate doesn't have. Be direct." }
  ],
  "recommendation": "2-4 sentences in first person, as the candidate. For strong_fit: why they'd be useful. For worth_conversation: nuance, what transfers, what doesn't. For probably_not: acknowledge mismatch, name what might transfer, suggest they look elsewhere for this role but reach out if other roles match."
}

Calibration — what honest sounds like:
- Strong fit: "Your requirements align well with my experience. Here's the specific evidence:" then concrete matches. Recommendation: "I'd be genuinely useful here because..."
- Probably not: "This role needs X. My entire career has been Y. I understand the concepts from reading but haven't done Z. For this specific position, I'm probably not your person. But if you have roles that match what I actually do, let's talk." Still list any matches and gaps; recommendation should be honest and helpful, not desperate.

Rules:
- verdict is required. Use probably_not when the role's core requirements (e.g. 5+ years mobile, consumer B2C, growth team) are clearly outside the candidate's background.
- matches and gaps must be arrays (can be empty). For probably_not, gaps should clearly explain the mismatch.
- Use only the candidate's real experience from the context. No invented projects or skills.
- recommendation = candidate speaking in first person ("I'd be...", "My experience...", "I'm not the right fit because...").
- Output only the JSON object, no code fence or preamble.`

function buildContextBlock(cv: CV): string {
  const parts: string[] = []
  if (cv.summary) parts.push('## Summary', cv.summary, '')
  if (cv.experience?.length) {
    parts.push('## Experience')
    cv.experience.forEach((exp) => {
      parts.push(`${exp.role} at ${exp.org} (${exp.dates})`)
      exp.highlights?.forEach((h) => parts.push(`- ${h}`))
      parts.push('')
    })
  }
  if (cv.skillsAndStack) parts.push('## Skills', cv.skillsAndStack, '')
  if (cv.interviewPrep) parts.push('## Strengths', cv.interviewPrep.slice(0, 2000), '')
  if (cv.careerPositioning) parts.push('## Career positioning', cv.careerPositioning.slice(0, 1500), '')
  return parts.join('\n')
}

function parseAssessmentJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null
  try {
    return JSON.parse(jsonMatch[0]) as Record<string, unknown>
  } catch {
    return null
  }
}

const VERDICTS: FitVerdict[] = ['strong_fit', 'worth_conversation', 'probably_not']

/**
 * Get a structured fit assessment for the given job description.
 */
export async function getFitAssessment(
  jobDescription: string,
  cv: CV
): Promise<FitAssessmentResult | null> {
  if (!jobDescription?.trim()) return null

  if (AI_ENABLED && openaiClient) {
    try {
      const context = buildContextBlock(cv)
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: FIT_SYSTEM_PROMPT + '\n\n--- CANDIDATE CONTEXT ---\n\n' + context },
          { role: 'user', content: jobDescription.trim() },
        ],
        max_tokens: 1200,
        temperature: 0.4,
      })
      const content = response.choices[0]?.message?.content
      if (!content) return null
      const parsed = parseAssessmentJson(content)
      if (parsed && Array.isArray(parsed.matches) && Array.isArray(parsed.gaps)) {
        const verdict: FitVerdict = VERDICTS.includes(parsed.verdict as FitVerdict)
          ? (parsed.verdict as FitVerdict)
          : (parsed.matches?.length >= 2 && parsed.gaps?.length <= 1 ? 'strong_fit' : 'worth_conversation')
        return {
          verdict,
          summary: (parsed.summary as string) || 'Assessment',
          summaryReason: (parsed.summaryReason as string) || '',
          matches: (parsed.matches as FitAssessmentResult['matches']) || [],
          gaps: (parsed.gaps as FitAssessmentResult['gaps']) || [],
          recommendation: (parsed.recommendation as string) || '',
        }
      }
    } catch (err) {
      console.error('Fit assessment API error:', err)
      return getMockFitAssessment(jobDescription, cv)
    }
  }

  await new Promise((r) => setTimeout(r, 800))
  return getMockFitAssessment(jobDescription, cv)
}

/**
 * Mock assessment based on simple keyword matching (when no API key).
 */
function getMockFitAssessment(jobDescription: string, cv: CV): FitAssessmentResult {
  const jd = jobDescription.toLowerCase()
  const name = cv.name || 'Jeremy Osztreicher'

  const isContentRole = /content|cms|headless|sanity|prismic|strapi|structured data|editor experience/.test(jd)
  const isLeadershipRole = /manager|tech lead|engineering manager|em\b|lead\b|head of/.test(jd)
  const isPlatformRole = /api|platform|integration|data model/.test(jd)
  const isMobileRole = /mobile|react native|ios|android/.test(jd)
  const isConsumerRole = /consumer|b2c|growth|experimentation/.test(jd)
  const isTVOrStreamingRole = /tv|streaming|ott|set-top|roku|tvos|android tv/.test(jd)

  const matches: FitAssessmentResult['matches'] = []
  const gaps: FitAssessmentResult['gaps'] = []

  if (isTVOrStreamingRole || (isMobileRole && /react native/.test(jd))) {
    matches.push({
      title: 'React Native (TV / streaming)',
      detail: `${name} has React Native experience on the RBO TV app at the Royal Opera House — streaming for TV, not consumer mobile. Same stack (React Native, TypeScript), different platform and use case.`,
    })
  }
  if (isContentRole || isLeadershipRole) {
    matches.push({
      title: 'Content & headless CMS',
      detail: `${name} led the migration to Sanity at Movember (content architecture, models, integration) and shapes content workflows at the Royal Opera House with Prismic and Strapi. Thinks in content-as-structured-data and has designed editor experience and data shape.`,
    })
  }
  if (isLeadershipRole) {
    matches.push({
      title: 'Hands-on engineering leadership',
      detail: `Line manager of 7 developers; hiring, 1:1s, mentoring. Drives technical direction, architecture, and code review while owning delivery. Has led agency transition, workshops on modularisation, and AI product strategy.`,
    })
  }
  if (isPlatformRole) {
    matches.push({
      title: 'APIs and platform mindset',
      detail: `Designs and owns APIs and data models consumed by multiple business functions (Content, Ballet, Opera, Front of House, IT). Built aggregation/cache layer for people pages; real-time, high-availability experiences including on-sale events.`,
    })
  }
  if (!matches.length) {
    matches.push({
      title: 'Technical leadership and delivery',
      detail: `${name} combines hands-on architecture and code review with people management. TypeScript, React, Node.js, AWS; headless CMS specialist; 8 years in software, 4+ leading teams.`,
    })
  }

  if (isMobileRole) {
    gaps.push({
      title: 'Consumer mobile (iOS/Android)',
      detail: 'React Native experience is in TV/streaming (RBO TV app at ROH), not consumer mobile — no app store releases, iOS/Android consumer apps, or growth-focused mobile at scale.',
    })
  }
  if (isConsumerRole) {
    gaps.push({
      title: 'Consumer product and growth',
      detail: 'Experience is in B2B, arts/culture, and internal platforms. Has not shipped consumer-facing product at scale or run growth/experimentation teams.',
    })
  }

  const strongFit = matches.length >= 2 && gaps.length <= 1
  const probablyNot = gaps.length >= 2 && (isMobileRole || isConsumerRole)
  const verdict: FitVerdict = probablyNot ? 'probably_not' : strongFit ? 'strong_fit' : 'worth_conversation'
  const summary = probablyNot
    ? 'Honest Assessment: Probably Not Your Person'
    : strongFit
      ? "Strong Fit — Let's Talk"
      : 'Worth a Conversation'
  const summaryReason = probablyNot
    ? "This role's core requirements don't match my background. Here's the honest picture:"
    : strongFit
      ? "Your requirements align well with my experience. Here's the specific evidence:"
      : 'Some requirements align; a few areas to be upfront about:'
  const recommendation = probablyNot
    ? "My experience is in B2B, content/platform, and web—not consumer mobile or growth at scale. For this specific role I'm probably not your person. If you have roles that match content, platform, or hands-on EM work, I'd be glad to talk."
    : strongFit
      ? "I'd be genuinely useful here. The content and platform work is directly transferable, and I've led similar technical and team challenges. Happy to discuss how my experience maps to your priorities."
      : "Worth a conversation. I have strong overlap in several areas; the gaps I've noted are things I'm transparent about so we can decide fit together."

  return {
    verdict,
    summary,
    summaryReason,
    matches,
    gaps,
    recommendation,
  }
}

export function isFitAssessmentAIEnabled(): boolean {
  return AI_ENABLED
}

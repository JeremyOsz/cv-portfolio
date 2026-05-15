/** Single experience entry from experience.json / cv-context */
export interface ExperienceEntry {
  role: string
  org: string
  location?: string
  dates: string
  highlights: string[]
}

/** Single education entry */
export interface EducationEntry {
  degree: string
  school: string
  location?: string
  dates: string
}

/** Raw sections from export (work readme, interview intro, etc.) */
export interface CVRawSections {
  workReadme: string | null
  interviewIntro: string | null
  contextWorkFocus: string | null
  structure: string | null
}

/** CV context as loaded from cv-context.json */
export interface CV {
  name: string
  title: string
  summary: string | null
  generatedAt?: string
  source?: string
  confidential?: boolean
  experience: ExperienceEntry[]
  workFocus: string[]
  keyPeople?: string[]
  education?: EducationEntry[]
  otherTraining?: string[]
  skillsAndStack?: string | null
  interviewPrep?: string | null
  careerPositioning?: string | null
  workSummary?: string | null
  aiStrategy?: string | null
  aiInitiatives?: string | null
  documentationEpic?: string | null
  teamComposition?: string | null
  intendedRoles?: string | null
  interviewQuestions?: string | null
  recentActivity?: string | null
  projects?: string | null
  learning?: string | null
  annualWork?: string | null
  decisions?: string | null
  insights?: string | null
  rawSections?: CVRawSections
}

/** One match or gap in fit assessment */
export interface FitMatchOrGap {
  title: string
  detail: string
}

/** Verdict from fit assessment */
export type FitVerdict = 'strong_fit' | 'worth_conversation' | 'probably_not'

/** Result of fit assessment (JD analyzer) */
export interface FitAssessmentResult {
  verdict: FitVerdict
  summary: string
  summaryReason: string
  matches: FitMatchOrGap[]
  gaps: FitMatchOrGap[]
  recommendation: string
}

/** One message in the chat */
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

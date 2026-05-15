import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Check, Circle, Loader2, AlertCircle } from 'lucide-react'
import { getFitAssessment, isFitAssessmentAIEnabled } from '@/lib/fit-assessment-service'
import type { CV, FitAssessmentResult } from '@/types/cv'

const STRONG_FIT_EXAMPLE = `Engineering Manager — Content Platform (London)

We're a content-first company building the platform that powers structured content for hundreds of brands. We need a hands-on Engineering Manager who can lead a team of 6–8 engineers while staying close to architecture and code.

Requirements:
- Experience with headless CMS, content-as-data, or content APIs (Sanity, Contentful, Prismic, or similar)
- TypeScript, Node.js, React in production
- Track record of technical leadership: architecture decisions, code review, setting technical direction
- People management: hiring, 1:1s, mentoring, growing engineers
- Comfort with ambiguity; able to shape roadmap with product and design
- Strong communicator; go-to for cross-functional stakeholders

Nice to have: AI/product strategy, platform thinking (APIs consumed by multiple teams), migration or agency handover experience.`

const WEAK_FIT_EXAMPLE = `Senior Mobile Engineer — Consumer App (Remote)

We're a high-growth B2C startup. Our app is used by millions of consumers daily. We need a Senior Mobile Engineer to own the React Native experience on iOS and Android.

Requirements:
- 5+ years mobile development (React Native required; native iOS/Android a plus)
- Shipped consumer apps with large DAU; experience with growth, A/B testing, and experimentation
- Deep experience with app store releases, performance, and offline-first mobile architecture
- Comfort in a fast-moving growth team with frequent releases

Nice to have: Backend or API experience, team lead experience.`

interface FitAssessmentProps {
  cv: CV
}

export default function FitAssessment({ cv }: FitAssessmentProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [assessment, setAssessment] = useState<FitAssessmentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runAssessment(jd?: string) {
    const text = (jd ?? jobDescription).trim()
    if (!text) return
    setLoading(true)
    setError(null)
    setAssessment(null)
    try {
      const result = await getFitAssessment(text, cv)
      setAssessment(result ?? null)
      if (jd) setJobDescription(jd)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        Honest Fit Assessment
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Paste a job description. Get an honest assessment of whether I'm the right person — including when I'm not.
      </p>

      {/* Example buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => runAssessment(STRONG_FIT_EXAMPLE)}
          disabled={loading}
          className="border-primary/50 text-primary hover:bg-primary/10"
        >
          Strong Fit Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => runAssessment(WEAK_FIT_EXAMPLE)}
          disabled={loading}
          className="border-border text-muted-foreground hover:bg-secondary"
        >
          Weak Fit Example
        </Button>
      </div>

      {/* Job description input */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Job description to analyze
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={6}
                className="w-full rounded-lg bg-secondary/30 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                disabled={loading}
              />
              <Button
                onClick={() => runAssessment()}
                disabled={!jobDescription.trim() || loading}
                className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Assessing…
                  </>
                ) : (
                  'Get assessment'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}

      {assessment && (
        <div className="space-y-6">
          {/* Summary card — style by verdict (Nate: bidirectional, "probably not" is honest signal) */}
          {assessment.verdict === 'probably_not' ? (
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-5 flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {assessment.summary}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assessment.summaryReason}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-primary/15 border-primary/30">
              <CardContent className="p-5 flex items-start gap-4">
                <Check className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {assessment.summary}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assessment.summaryReason}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Where I match */}
          {assessment.matches?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Where I match
              </p>
              <div className="space-y-3">
                {assessment.matches.map((m, i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{m.detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Gaps to note */}
          {assessment.gaps?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Gaps to note
              </p>
              <div className="space-y-3">
                {assessment.gaps.map((g, i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{g.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{g.detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* My recommendation */}
          {assessment.recommendation && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                My recommendation
              </p>
              <Card className="bg-primary/15 border-primary/30">
                <CardContent className="p-5">
                  <p className="text-sm text-foreground">{assessment.recommendation}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {isFitAssessmentAIEnabled() && (
        <p className="text-xs text-muted-foreground mt-4">
          Assessment powered by AI with your full career context.
        </p>
      )}
    </section>
  )
}

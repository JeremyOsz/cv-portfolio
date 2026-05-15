import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  ExternalLink,
  Github,
  Grid3X3,
  List,
  MessageCircle,
  MoonStar,
  Palette,
  Sparkles,
  TerminalSquare,
  X,
} from 'lucide-react'
import ChatPanel from '@/components/ChatPanel'
import FitAssessment from '@/components/FitAssessment'
import type { CV, ExperienceEntry } from '@/types/cv'
import aromaHerbariumScreenshot from '@/assets/screenshots/aroma-herbarium.png'
import londonDanceCalendarScreenshot from '@/assets/screenshots/london-dance-calendar.png'
import operaArchiveExplorerScreenshot from '@/assets/screenshots/opera-archive-explorer.png'
import osztrologyScreenshot from '@/assets/screenshots/osztrology.png'
import rboScreenshot from '@/assets/screenshots/rbo.png'
import './App.css'
import './index.css'

type ProjectCategory =
  | 'Featured'
  | 'Creative systems'
  | 'Tools and utilities'
  | 'Work platforms'

interface ProjectEntry {
  title: string
  category: ProjectCategory
  scope: 'Personal' | 'Work'
  status: string
  stack: string[]
  path: string
  screenshot?: string
  liveUrl?: string
  repoUrl?: string
  eventUrl?: string
  role?: string
  summary: string
}

type PortfolioFilter = 'All' | 'Work' | 'Personal' | ProjectCategory
type VariationSlug = 'edge' | 'classical' | 'poetic' | 'artist' | 'clean'

const portfolioPositioning = {
  name: 'Jeremy Osztreicher',
  headline: 'Software engineer. Creative systems builder.',
  summary:
    'Production software engineering, cultural tools, sound systems, archive explorers, and artist-facing web work. The throughline is practical systems with a strong point of view.',
  career:
    'Senior product engineering, React/TypeScript, platform work, design systems, APIs, AWS/serverless, technical direction, and pragmatic delivery inside real organisations.',
  creative:
    'Browser instruments, Web Audio, cultural data products, astrology and archive interfaces, live-coding references, and public tools that treat software as a studio medium.',
  proofPoints: [
    'Production platform experience at Royal Ballet & Opera',
    'Public cultural products with live URLs and source links',
    'Creative coding practice across sound, movement, archives, and esoteric tools',
  ],
}

const audienceCopy: Record<VariationSlug, {
  eyebrow: string
  tagline: string
  summary: string
  careerLabel: string
  creativeLabel: string
}> = {
  edge: {
    eyebrow: 'product edge / cultural data / hireable systems',
    tagline: 'Products, scrapers, signal.',
    summary:
      'Proof of execution for product teams, with enough cultural signal for creative collaborators.',
    careerLabel: 'Production edge',
    creativeLabel: 'Cultural signal',
  },
  classical: {
    eyebrow: 'technical temperament / symbolic interfaces / durable craft',
    tagline: 'Careful systems, unusual interfaces.',
    summary:
      'A slower route for judgement, taste, and evidence of long-form craft.',
    careerLabel: 'Professional houses',
    creativeLabel: 'Creative aspects',
  },
  poetic: {
    eyebrow: '~/work-and-practice',
    tagline: 'Infrastructure, notebook, instrument.',
    summary:
      'For people who read through source, systems, notes, and small decisions.',
    careerLabel: 'job_mode',
    creativeLabel: 'studio_mode',
  },
  artist: {
    eyebrow: 'selected projects / scope / status',
    tagline: '',
    summary: '',
    careerLabel: 'Delivery context',
    creativeLabel: 'Creative technology work',
  },
  clean: {
    eyebrow: 'portfolio archive / work explorer / current position',
    tagline: 'Engineering and creative work, scanned cleanly.',
    summary:
      'A fast comparison route for engineering teams, recruiters, and collaborators.',
    careerLabel: 'Full-time fit',
    creativeLabel: 'Creative output',
  },
}

const portfolioProjects: ProjectEntry[] = [
  {
    title: 'London Dance Calendar',
    category: 'Featured',
    scope: 'Personal',
    status: 'Live cultural product',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cheerio', 'Vitest', 'Playwright'],
    path: '/Users/jeremy/Documents/Code/code-projects/dance-scraper',
    screenshot: londonDanceCalendarScreenshot,
    liveUrl: 'https://www.londondancecalendar.com/?mode=calendar&view=week',
    repoUrl: 'https://github.com/JeremyOsz/dance-scraper',
    role: 'Creator and maintainer',
    summary: 'Cultural discovery product compiling London adult dance and movement classes from studio sources. Built around scraper adapters, a normalized session contract, filterable API routes, daily GitHub data updates, and smoke-tested calendar views.',
  },
  {
    title: 'Osztrology',
    category: 'Featured',
    scope: 'Personal',
    status: 'Live astrology app',
    stack: ['SvelteKit', 'TypeScript', 'Swiss Ephemeris', 'D3', 'Tailwind CSS', 'shadcn/ui'],
    path: '/Users/jeremy/Documents/Code/code-projects/astro-svelte-app',
    screenshot: osztrologyScreenshot,
    liveUrl: 'https://osztrology.vercel.app/chart',
    repoUrl: 'https://github.com/JeremyOsz/astro-svelte-app',
    role: 'Creator',
    summary: 'Astrology chart application with natal charts, transits, daily horoscopes, synastry, tarot references, chart storage, URL sharing, and interactive D3 visualisations backed by high-precision ephemeris calculations.',
  },
  {
    title: 'Hero Syndrome',
    category: 'Featured',
    scope: 'Personal',
    status: 'Music engine in progress',
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Anthropic', 'ElevenLabs', 'Web Audio'],
    path: '/Users/jeremy/Documents/Code/code-projects/hero-syndrome',
    repoUrl: 'https://github.com/vibe-coding-collective/hero-syndrome',
    role: 'Music Engine Curator - designed the rules, logic and curated lexicon of musical tools for the prompt builder',
    summary: 'Collaborative mobile web art PWA that scores everyday life in real time. The music engine turns sensor-derived state vectors into structured composition plans, renders adaptive songs, and manages back-to-back playback through a Web Audio queue.',
  },
  {
    title: 'C3 Sound Sketches',
    category: 'Creative systems',
    scope: 'Personal',
    status: 'Interactive sketch suite',
    stack: ['JavaScript', 'p5.js', 'Web Audio API', 'HTML/CSS', 'Synthesis', 'Sequencing'],
    path: '/Users/jeremy/Documents/Code/code-projects/extended-mind/apps/c3-sound-sketches',
    repoUrl: 'https://github.com/JeremyOsz/extended-mind/tree/main/apps/c3-sound-sketches',
    eventUrl: 'https://luma.com/zb4n6c2g',
    role: 'Artist and presenter',
    summary: 'Browser-based sound design and synthesis sketches used for sonic experiments and teaching: FM/AM patches, wavetable and subtractive synths, a mini groovebox, and p5.js sound design material for c3s Code x Music.',
  },
  {
    title: 'Royal Ballet & Opera Digital Platform',
    category: 'Work platforms',
    scope: 'Work',
    status: 'Production ecosystem',
    stack: ['React', 'TypeScript', 'AWS Lambda', 'Terraform', 'Design systems'],
    path: '/Users/jeremy/Documents/Code/work-code',
    screenshot: rboScreenshot,
    summary: 'RBO site and product ecosystem presented as one body of work: frontend platform, account and checkout services, information layer, seatmap, TV app, design system, and infrastructure.',
  },
  {
    title: 'Opera Archive Explorer',
    category: 'Featured',
    scope: 'Personal',
    status: 'Live archive explorer',
    stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Internet Archive API'],
    path: '/Users/jeremy/Documents/Code/code-projects/opera-archive-explorer',
    screenshot: operaArchiveExplorerScreenshot,
    liveUrl: 'https://opera-archive-explorer.vercel.app',
    repoUrl: 'https://github.com/JeremyOsz/opera-archive-explorer',
    role: 'Creator',
    summary: 'Search and exploration interface for 846+ opera recordings from the Internet Archive vinyl collection, with rich metadata, instant autocomplete, a 436KB build-time cache, API docs, and serverless-ready deployment.',
  },
  {
    title: 'Aroma Herbarium',
    category: 'Tools and utilities',
    scope: 'Personal',
    status: 'Live explorer app',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Explorer UI'],
    path: '/Users/jeremy/Documents/Code/code-projects/aroma-herbarium',
    screenshot: aromaHerbariumScreenshot,
    liveUrl: 'https://aroma-herbarium.vercel.app',
    repoUrl: 'https://github.com/JeremyOsz/aroma-herbarium',
    role: 'Creator',
    summary: 'Vintage-inspired aromatherapy herbarium and reusable explorer-app pattern built around cards, list views, filters, modal detail views, multiple exploration modes, and compliant Amazon affiliate-link handling.',
  },
  {
    title: 'CV Portfolio',
    category: 'Tools and utilities',
    scope: 'Personal',
    status: 'Active app',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'OpenAI API'],
    path: '/Users/jeremy/Documents/Code/code-projects/extended-mind/apps/cv-portfolio',
    repoUrl: 'https://github.com/JeremyOsz/extended-mind/tree/main/apps/cv-portfolio',
    summary: 'AI-assisted CV and portfolio surface with role history, fit analysis, interactive project filtering, and a live positioning layer for current public work.',
  },
  {
    title: 'Extended Mind',
    category: 'Tools and utilities',
    scope: 'Personal',
    status: 'Active system',
    stack: ['Markdown', 'Node.js', 'Vite', 'React', 'Agent workflows'],
    path: '/Users/jeremy/Documents/Code/code-projects/extended-mind',
    summary: 'LLM-first external brain for organising work, life, context, and agent-assisted workflows. It turns notes and dumps into structured operating context for software, strategy, and creative projects.',
  },
]

const variationSummaries: Array<{
  slug: VariationSlug
  title: string
  subtitle: string
  mode: 'Grid' | 'List' | 'Hybrid'
}> = [
  {
    slug: 'edge',
    title: 'Edge Index',
    subtitle: 'High-contrast cultural data product, inspired by London Dance Calendar.',
    mode: 'Grid',
  },
  {
    slug: 'classical',
    title: 'Ephemeris Room',
    subtitle: 'Esoteric, classical, chart-like, and slower to read.',
    mode: 'Hybrid',
  },
  {
    slug: 'poetic',
    title: 'Poetic Terminal',
    subtitle: 'Pixel-web, developer-core, small signals and hand-built texture.',
    mode: 'List',
  },
  {
    slug: 'artist',
    title: 'Studio Portfolio',
    subtitle: 'Selected projects with scope, status, and links.',
    mode: 'Grid',
  },
  {
    slug: 'clean',
    title: 'Archive Console',
    subtitle: 'Clean modern explorer surface, closer to an operational archive.',
    mode: 'List',
  },
]

const projectPriority: Record<string, number> = {
  'London Dance Calendar': 0,
  Osztrology: 1,
  'Hero Syndrome': 2,
  'C3 Sound Sketches': 3,
  'Royal Ballet & Opera Digital Platform': 4,
  'Opera Archive Explorer': 5,
  'Aroma Herbarium': 6,
  'CV Portfolio': 7,
  'Extended Mind': 8,
}

const categoryOrder: Record<ProjectCategory, number> = {
  Featured: 0,
  'Creative systems': 1,
  'Work platforms': 2,
  'Tools and utilities': 3,
}

function getOrderedProjects(projects = portfolioProjects) {
  return [...projects].sort((a, b) => {
    const explicitPriorityA = projectPriority[a.title] ?? 999
    const explicitPriorityB = projectPriority[b.title] ?? 999
    if (explicitPriorityA !== explicitPriorityB) return explicitPriorityA - explicitPriorityB

    const categoryPriorityA = categoryOrder[a.category]
    const categoryPriorityB = categoryOrder[b.category]
    if (categoryPriorityA !== categoryPriorityB) return categoryPriorityA - categoryPriorityB

    return a.title.localeCompare(b.title)
  })
}

function ProjectScreenshot({
  project,
  className = '',
}: {
  project: ProjectEntry
  className?: string
}) {
  if (!project.screenshot) return null

  return (
    <div className={`project-screenshot ${className}`.trim()}>
      <img src={project.screenshot} alt={`${project.title} screenshot`} loading="lazy" />
    </div>
  )
}

function ProjectLinks({ project }: { project: ProjectEntry }) {
  return (
    <div className="variation-links">
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live project`}>
          <ExternalLink aria-hidden="true" />
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source`}>
          <Github aria-hidden="true" />
        </a>
      )}
    </div>
  )
}

function VariationPositioning({ active }: { active: VariationSlug }) {
  const copy = audienceCopy[active]
  const isArtist = active === 'artist'
  const careerHeading = active === 'artist' ? 'Software engineering work' : 'Full-time software work'
  const creativeHeading = active === 'artist' ? 'Creative technology work' : 'Creative systems practice'

  return (
    <section className="variation-positioning" aria-label="Portfolio positioning">
      <div className="variation-positioning-intro">
        <p>Shared position</p>
        <h2>{portfolioPositioning.headline}</h2>
        <span>{portfolioPositioning.summary}</span>
      </div>
      <div className="variation-positioning-panels">
        <article>
          <BriefcaseBusiness aria-hidden="true" />
          <p>{copy.careerLabel}</p>
          {!isArtist ? <h3>{careerHeading}</h3> : null}
          <span>{portfolioPositioning.career}</span>
        </article>
        <article>
          <Palette aria-hidden="true" />
          <p>{copy.creativeLabel}</p>
          {!isArtist ? <h3>{creativeHeading}</h3> : null}
          <span>{portfolioPositioning.creative}</span>
        </article>
      </div>
      <ul className="variation-proof-list" aria-label="Shared proof points">
        {portfolioPositioning.proofPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  )
}

function VariationContact() {
  return (
    <section className="variation-contact" aria-label="Contact">
      <div>
        <p>Contact</p>
        <h2>Senior frontend/platform and creative technology roles.</h2>
        <span>
          Strong fit for teams building product platforms, cultural tools, archive interfaces, and design-system
          adjacent products.
        </span>
      </div>
      <div className="variation-contact-links">
        <a href="mailto:j.osztreicher@gmail.com">Email</a>
        <a href="https://github.com/Jeremyosz" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/jeremy-osztreicher-72236a125/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </section>
  )
}

function VariationNav({ active }: { active?: VariationSlug }) {
  return (
    <nav className="variation-nav" aria-label="Portfolio variations">
      <a href="/">Main</a>
      {variationSummaries.map((variation) => (
        <a
          key={variation.slug}
          href={`/variations/${variation.slug}`}
          aria-current={active === variation.slug ? 'page' : undefined}
        >
          {variation.title}
        </a>
      ))}
    </nav>
  )
}

function VariationsIndex() {
  return (
    <div className="variation-shell variation-index">
      <VariationNav />
      <header className="variation-index-hero">
        <p>Portfolio direction paths</p>
        <h1>{portfolioPositioning.name}</h1>
        <span>
          {portfolioPositioning.headline} Choose the format that helps you scan the work quickly
          while keeping the same core evidence.
        </span>
      </header>
      <section className="variation-index-grid" aria-label="Variation paths">
        {variationSummaries.map((variation, index) => (
          <a key={variation.slug} href={`/variations/${variation.slug}`} className={`variation-index-card path-${variation.slug}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{variation.title}</h2>
            <p>{variation.subtitle}</p>
            <em>{variation.mode}</em>
          </a>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function EdgeVariation() {
  const projects = getOrderedProjects()
  const copy = audienceCopy.edge
  return (
    <div className="variation-shell variation-edge">
      <VariationNav active="edge" />
      <header className="edge-hero">
        <div>
          <p>{copy.eyebrow}</p>
          <h1>Jeremy Osztreicher</h1>
          <span>{copy.summary}</span>
        </div>
        <div className="edge-stats" aria-label="Portfolio stats">
          <span>{projects.length} projects</span>
          <span>React / TS / Web Audio</span>
          <span>London</span>
        </div>
      </header>
      <VariationPositioning active="edge" />
      <section className="edge-grid">
        {projects.map((project, index) => (
          <article key={project.title} className="edge-card">
            <div className="edge-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{project.scope}</b>
            </div>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <div className="edge-card-bottom">
              <span>{project.category}</span>
              <ProjectLinks project={project} />
            </div>
          </article>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function ClassicalVariation() {
  const featured = getOrderedProjects().slice(0, 5)
  const copy = audienceCopy.classical
  return (
    <div className="variation-shell variation-classical">
      <VariationNav active="classical" />
      <header className="classical-hero">
        <MoonStar aria-hidden="true" />
        <p>{copy.eyebrow}</p>
        <h1>{portfolioPositioning.name}</h1>
        <h2>{copy.tagline}</h2>
        <span>{copy.summary}</span>
      </header>
      <VariationPositioning active="classical" />
      <section className="classical-map" aria-label="Featured constellations">
        {featured.map((project, index) => (
          <article key={project.title} className={`classical-orb orb-${index}`}>
            <span>{project.category}</span>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <ProjectLinks project={project} />
          </article>
        ))}
      </section>
      <section className="classical-table">
        {getOrderedProjects().map((project) => (
          <a key={project.title} href={project.liveUrl ?? project.repoUrl ?? '#'} target="_blank" rel="noreferrer">
            <div>
              <span>{project.title}</span>
              <p>{project.summary}</p>
            </div>
            <em>{project.status}</em>
            <b>{project.stack.slice(0, 3).join(' / ')}</b>
          </a>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function PoeticVariation() {
  const copy = audienceCopy.poetic
  return (
    <div className="variation-shell variation-poetic">
      <VariationNav active="poetic" />
      <header className="poetic-hero">
        <TerminalSquare aria-hidden="true" />
        <p>{copy.eyebrow}</p>
        <h1>{portfolioPositioning.name}</h1>
        <h2>{copy.tagline}</h2>
        <span>{copy.summary}</span>
      </header>
      <VariationPositioning active="poetic" />
      <section className="poetic-list">
        {getOrderedProjects().map((project) => (
          <article key={project.title}>
            <div className="poetic-pixel" aria-hidden="true" />
            <div>
              <p>
                <span>{project.scope.toLowerCase()}</span>
                <span>{project.category.toLowerCase()}</span>
              </p>
              <h2>{project.title}</h2>
              <em>{project.summary}</em>
              <div className="poetic-stack">{project.stack.slice(0, 5).map((item) => <b key={item}>{item}</b>)}</div>
            </div>
            <ProjectLinks project={project} />
          </article>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function ArtistVariation() {
  const projects = getOrderedProjects()
  const copy = audienceCopy.artist
  return (
    <div className="variation-shell variation-artist">
      <VariationNav active="artist" />
      <header className="artist-hero">
        <div>
          <p>{copy.eyebrow}</p>
          <h1>{portfolioPositioning.name}</h1>
          {copy.tagline ? <h2>{copy.tagline}</h2> : null}
        </div>
        {copy.summary ? <span>{copy.summary}</span> : null}
      </header>
      <VariationPositioning active="artist" />
      <section className="artist-grid">
        {projects.map((project, index) => (
          <article key={project.title} className={index === 0 ? 'artist-feature' : undefined}>
            <div className={`artist-image${project.screenshot ? ' artist-image--photo' : ''}`} aria-hidden={project.screenshot ? undefined : true}>
              {project.screenshot ? (
                <img src={project.screenshot} alt="" />
              ) : (
                <span>{project.title.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="artist-caption">
              <p>{project.scope} · {project.status}</p>
              <h2>{project.title}</h2>
              <em>{project.category}</em>
              <span>{project.summary}</span>
              <ProjectLinks project={project} />
            </div>
          </article>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function CleanVariation() {
  const copy = audienceCopy.clean
  return (
    <div className="variation-shell variation-clean">
      <VariationNav active="clean" />
      <header className="clean-hero">
        <div>
          <p>{copy.eyebrow}</p>
          <h1>{portfolioPositioning.name}</h1>
          <h2>{copy.tagline}</h2>
          <span>{copy.summary}</span>
        </div>
        <div className="clean-controls" aria-label="View modes">
          <button type="button" aria-pressed="true"><List aria-hidden="true" /> List</button>
          <button type="button"><Grid3X3 aria-hidden="true" /> Grid</button>
        </div>
      </header>
      <VariationPositioning active="clean" />
      <section className="clean-table" aria-label="Portfolio project list">
        {getOrderedProjects().map((project) => (
          <article key={project.title}>
            <div>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
            </div>
            <span>{project.status}</span>
            <span>{project.stack.slice(0, 4).join(', ')}</span>
            <ProjectLinks project={project} />
          </article>
        ))}
      </section>
      <VariationContact />
    </div>
  )
}

function PortfolioVariationRouter() {
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1) as VariationSlug | undefined

  if (slug === 'edge') return <EdgeVariation />
  if (slug === 'classical') return <ClassicalVariation />
  if (slug === 'poetic') return <PoeticVariation />
  if (slug === 'artist') return <ArtistVariation />
  if (slug === 'clean') return <CleanVariation />

  return <VariationsIndex />
}

function ExperienceCard({ exp }: { exp: ExperienceEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="p-6">
        <div className="mb-1 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-foreground">{exp.org}</h3>
          <span className="whitespace-nowrap text-sm text-muted-foreground">{exp.dates}</span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{exp.role}</p>

        <div className="space-y-2.5">
          {exp.highlights?.slice(0, 3).map((highlight) => (
            <div key={highlight} className="flex items-start gap-2.5">
              <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-sm text-foreground/80">{highlight}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          <Sparkles className="h-3 w-3" />
          View AI Context
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 rounded-xl border border-border/70 bg-secondary/45 p-4 text-sm text-muted-foreground">
            {exp.highlights?.slice(3).map((highlight) => (
              <div key={highlight} className="flex items-start gap-2.5">
                <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-primary/60" />
                <span>{highlight}</span>
              </div>
            ))}
            {exp.location && <p className="mt-2 text-xs">Location: {exp.location}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StrengthsSection() {
  const strong = [
    'Content Architecture & Headless CMS',
    'API Design & Data Modelling',
    'Technical Strategy & Direction',
    'Cross-functional Leadership',
    'Team Building & Hiring',
    'Developer Experience',
  ]
  const moderate = [
    'Infrastructure & DevOps',
    'Product Discovery & Metrics',
    'High-scale / High-traffic Systems',
  ]
  const gaps = [
    'Mobile Development',
    'Product-led SaaS',
    'Formal Growth Engineering',
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-primary/20 bg-card/85">
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Strong
          </p>
          <div className="space-y-2">
            {strong.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-foreground/90">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card/85">
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Moderate
          </p>
          <div className="space-y-2">
            {moderate.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-foreground/70">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-amber-500/30 bg-card/85">
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
            Gaps
          </p>
          <div className="space-y-2">
            {gaps.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <X className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span className="text-foreground/70">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <Card className="project-card overflow-hidden border-border/70 bg-card/88 backdrop-blur">
      <ProjectScreenshot project={project} />
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase">
                {project.category}
              </Badge>
              <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase">
                {project.scope}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{project.title}</h3>
          </div>
          <span className="rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {project.status}
          </span>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-foreground/80">{project.summary}</p>

        {project.role && (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            {project.role}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-1 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {project.liveUrl && (
            <div>
              <span className="font-medium text-foreground/70">Live:</span>{' '}
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Open live project
              </a>
            </div>
          )}
          {project.eventUrl && (
            <div>
              <span className="font-medium text-foreground/70">Event:</span>{' '}
              <a href={project.eventUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                View event
              </a>
            </div>
          )}
          {project.repoUrl ? (
            <div>
              <span className="font-medium text-foreground/70">Repository:</span>{' '}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                View source
              </a>
            </div>
          ) : (
            <div>
              <span className="font-medium text-foreground/70">Repository:</span> Private work (available on request)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function App() {
  const [cv, setCv] = useState<CV | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>('All')
  const isVariationPath = window.location.pathname.startsWith('/variations')

  useEffect(() => {
    if (isVariationPath) {
      setLoading(false)
      return
    }

    fetch('/cv-context.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load CV data')
        return res.json()
      })
      .then(setCv)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [isVariationPath])

  if (isVariationPath) {
    return <PortfolioVariationRouter />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-destructive">
        Error: {error.message}
      </div>
    )
  }

  if (!cv) return null

  const firstName = cv.name?.split(' ')[0] || 'Jeremy'
  const education = cv.education ?? []
  const otherTraining = cv.otherTraining ?? []
  const technologySummary = {
    core: ['TypeScript', 'React', 'Node.js', 'SvelteKit', 'Next.js', 'Python'],
    platform: ['AWS Lambda', 'Terraform', 'Cloudflare Workers', 'Vercel Functions', 'GitHub Actions', 'Docker'],
    sonic: ['Web Audio API', 'p5.js', 'Adaptive music systems', 'Generative synthesis', 'D3', 'Cultural data products'],
  }
  const recentWork = [
    {
      label: 'Speaking',
      title: 'Understanding sound design using p5.js',
      detail: 'c3s Code x Music, 21 May 2026',
      href: 'https://luma.com/zb4n6c2g',
    },
    {
      label: 'Building',
      title: 'London Dance Calendar',
      detail: 'A live cultural data product for dance classes across London',
      href: 'https://www.londondancecalendar.com/?mode=calendar&view=week',
    },
    {
      label: 'Composing systems',
      title: 'Hero Syndrome music engine',
      detail: 'Adaptive generated music from sensor-derived state vectors',
      href: 'https://github.com/vibe-coding-collective/hero-syndrome',
    },
  ]
  const filterOptions: PortfolioFilter[] = [
    'All',
    'Work',
    'Personal',
    'Featured',
    'Work platforms',
    'Creative systems',
    'Tools and utilities',
  ]
  const filteredProjects = portfolioProjects.filter((project) => {
    if (portfolioFilter === 'All') return true
    if (portfolioFilter === 'Work') return project.scope === 'Work'
    if (portfolioFilter === 'Personal') return project.scope === 'Personal'
    return project.category === portfolioFilter
  })
  const orderedProjects = getOrderedProjects(filteredProjects)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-14">
          <div className="portfolio-hero rounded-[2rem] border border-border/60 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Jeremy Osztreicher • Portfolio
                </p>
                <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Software Engineer. Technology Strategist. Creative Systems Builder.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/78 sm:text-lg">
                  London-based engineer working across production platforms, cultural data products,
                  AI-assisted systems, and browser-based sound tools. I build practical software with
                  a systems sensibility: APIs, frontend architecture, creative coding, and adaptive music.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  <a
                    href="https://github.com/Jeremyosz"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-foreground hover:border-primary/60"
                  >
                    github.com/Jeremyosz
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jeremy-osztreicher-72236a125/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-foreground hover:border-primary/60"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:j.osztreicher@gmail.com"
                    className="rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-foreground hover:border-primary/60"
                  >
                    j.osztreicher@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Button
                  onClick={() => setChatOpen(true)}
                  className="gap-2 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask AI
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
              {recentWork.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-border/65 bg-card/76 p-4 transition-colors hover:border-primary/60"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                </a>
              ))}
            </div>

          </div>
        </header>

        <section className="mb-14">
          <div className="mb-6">
            <h2 className="font-serif text-3xl tracking-tight text-foreground">Technologies & Skills</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Core stack and domain capabilities used across product engineering, platform strategy, cultural data products, and sonic systems.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-border/70 bg-card/85">
              <CardContent className="p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Core engineering</p>
                <div className="flex flex-wrap gap-2">
                  {technologySummary.core.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/85">
              <CardContent className="p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Platform and infra</p>
                <div className="flex flex-wrap gap-2">
                  {technologySummary.platform.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/85">
              <CardContent className="p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Sonic systems</p>
                <div className="flex flex-wrap gap-2">
                  {technologySummary.sonic.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl tracking-tight text-foreground">Portfolio</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Recent public systems first, followed by production platform work and selected tools.
                Use filters to focus the grid.
              </p>
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const count = portfolioProjects.filter((project) => {
                if (option === 'All') return true
                if (option === 'Work') return project.scope === 'Work'
                if (option === 'Personal') return project.scope === 'Personal'
                return project.category === option
              }).length

              const isActive = portfolioFilter === option
              return (
                <button
                  key={option}
                  onClick={() => setPortfolioFilter(option)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/70 bg-card/80 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {option} ({count})
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {orderedProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="font-serif text-3xl tracking-tight text-foreground">Experience</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Career history with expandable AI context behind each role.
            </p>
          </div>
          <div className="space-y-4">
            {cv.experience?.map((exp) => (
              <ExperienceCard key={`${exp.org}-${exp.role}`} exp={exp} />
            ))}
          </div>
        </section>

        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-3xl tracking-tight text-foreground">Education</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {education.map((edu) => (
                <Card key={`${edu.school}-${edu.degree}`} className="border-border/70 bg-card/85">
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">{edu.school}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{edu.dates}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {otherTraining.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-3xl tracking-tight text-foreground">Other Training</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {otherTraining.map((item) => (
                <Card key={item} className="border-border/70 bg-card/85">
                  <CardContent className="p-4 text-sm text-foreground/88">{item}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Separator className="my-12" />

        <section className="mb-12">
          <h2 className="mb-4 font-serif text-3xl tracking-tight text-foreground">Strengths Snapshot</h2>
          <StrengthsSection />
        </section>

        <FitAssessment cv={cv} />

        <div className="py-10 text-center">
          <Button
            onClick={() => setChatOpen(true)}
            size="lg"
            className="gap-2 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Ask AI about {firstName}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Powered by AI with full career context
          </p>
        </div>

        <Separator className="my-8" />

        <footer className="text-center text-xs text-muted-foreground">
          Project inventory sourced from local workspaces.{' '}
          {cv.generatedAt ? `Career context last updated ${new Date(cv.generatedAt).toLocaleDateString()}.` : ''}
        </footer>
      </main>

      <ChatPanel cv={cv} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

export default App

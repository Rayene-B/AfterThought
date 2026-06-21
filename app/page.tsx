import { Calendar, Sparkles } from 'lucide-react'
import { SearchAIExperience } from '@/components/ai-answer-experience'
import { InsightCard } from '@/components/insight-card'
import { examplePrompts, topKeywords, decisionTimeline, peopleMentions } from '@/lib/data'
import { generateCalendarEvents } from '@/lib/calendar'
import { askMeetingAI, relatedResults } from '@/lib/meeting-ai'
import { findMeeting, getLocalMeetings } from '@/lib/meeting-store'
import { Tags, GitCommitVertical, Users } from 'lucide-react'

type DashboardPageProps = {
  searchParams: Promise<{
    meetingId?: string
    q?: string
  }>
}

const sizeMap: Record<string, string> = {
  sm: 'text-sm text-muted-foreground',
  md: 'text-base text-foreground/80',
  lg: 'text-xl font-medium text-foreground',
  xl: 'text-2xl font-semibold text-primary',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const journeyPages = [
  { id: 'home', label: 'Home' },
  { id: 'search', label: 'Search' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'insights', label: 'Insights' },
]

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const meetings = getLocalMeetings()
  const events = generateCalendarEvents(meetings)
  const maxMentions = Math.max(...peopleMentions.map((person) => person.mentions), 1)
  const selectedMeeting = params.meetingId ? findMeeting(params.meetingId) : null
  const hasServerQuestion = Boolean(selectedMeeting && params.q?.trim())
  const initialAnswer = hasServerQuestion
    ? await askMeetingAI(params.q!.trim(), selectedMeeting!)
    : ''
  const initialResults = hasServerQuestion
    ? relatedResults(params.q!.trim(), [selectedMeeting!])
    : []

  return (
    <div className="journey-shell">
      <nav className="journey-page-dots" aria-label="Page sections">
        {journeyPages.map((page, index) => (
          <a key={page.id} href={`#${page.id}`} aria-label={`Go to ${page.label}`}>
            <span>{index + 1}</span>
          </a>
        ))}
      </nav>

      <section id="home" className="journey-section journey-home">
        <div className="journey-empty-home">
          <div className="afterthought-particles" aria-hidden="true">
            {Array.from({ length: 34 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="afterthought-corner-planet" aria-hidden="true">
            <span />
          </div>
          <div className="afterthought-hero-lockup" aria-label="AfterThought AI meeting memory engine">
            <div className="afterthought-wordmark-row">
              <span className="afterthought-line" />
              <span className="afterthought-name">AFTERTHOUGHT</span>
            </div>
            <div className="afterthought-at-mark">
              <span>AT</span>
              <span className="afterthought-dot" />
            </div>
            <p className="afterthought-subtitle">
              AI <span>MEETING MEMORY</span> ENGINE
            </p>
            <p className="afterthought-copy">
              Every meeting. Every decision.
              <br />
              Perfectly remembered.
            </p>
            <p className="afterthought-credits">By Rayene &amp; Umar</p>
          </div>
        </div>
        <a href="#search" aria-label="Scroll to search" className="journey-scroll-cue">
          <span />
        </a>
        <div className="journey-fade-bottom" />
      </section>

      <section id="search" className="journey-section journey-search">
        <div className="journey-fade-top" />
        <div className="journey-content">
          <div className="mb-7 flex flex-col gap-4">
            <span className="grid size-12 place-items-center rounded-2xl border border-glass-border bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </span>
            <div>
              <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground">
                Search your meeting memory
              </h1>
              <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
                Select a meeting, ask a question, and AfterThought answers using
                that meeting transcript.
              </p>
            </div>
          </div>

          <SearchAIExperience
            meetings={meetings}
            selectedMeetingId={params.meetingId}
            initialQuestion={params.q}
            initialAnswer={initialAnswer}
            initialResults={initialResults}
            prompts={['create a summary', ...examplePrompts]}
            basePath="/"
            sectionHash="search"
          />
        </div>
        <div className="journey-fade-bottom" />
      </section>

      <section id="calendar" className="journey-section">
        <div className="journey-content">
          <div className="mb-6 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-pink" />
              Auto-saved from meeting memory
            </span>
            <h2 className="flex items-center gap-3 font-heading text-3xl font-bold tracking-tight text-foreground">
              <Calendar className="size-8 text-primary" />
              Calendar
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Deadlines and dated action items are automatically pulled from
              meeting transcripts and saved here with context.
            </p>
          </div>

          <div className="grid gap-4">
            {events.slice(0, 5).map((event) => (
              <article
                key={event.id}
                className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="rounded-full border border-pink/20 bg-pink/10 px-2.5 py-1 text-xs text-pink">
                      Auto-saved
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                    {formatDate(event.date)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="journey-section">
        <div className="journey-content">
          <div className="mb-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Cross-Meeting Insights
            </h2>
            <p className="mt-2 text-pretty text-muted-foreground">
              Intelligence aggregated across every meeting in your memory.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InsightCard icon={Tags} title="Keyword Cloud">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2">
                {topKeywords.map((keyword) => (
                  <span
                    key={keyword.label}
                    className={`${sizeMap[keyword.size]} cursor-default leading-none transition-colors hover:text-primary`}
                  >
                    {keyword.label}
                  </span>
                ))}
              </div>
            </InsightCard>

            <InsightCard icon={GitCommitVertical} title="Major Decisions">
              <ol className="relative flex flex-col gap-5 pl-5">
                <span className="absolute left-[3px] top-1 h-[calc(100%-0.5rem)] w-px bg-glass-border" />
                {decisionTimeline.slice(0, 4).map((decision) => (
                  <li key={decision.title} className="relative flex flex-col gap-0.5">
                    <span className="absolute -left-[18px] top-1 size-2 rounded-full bg-primary ring-4 ring-background" />
                    <span className="text-xs text-muted-foreground">{decision.date}</span>
                    <span className="text-sm font-medium text-foreground">
                      {decision.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {decision.meeting}
                    </span>
                  </li>
                ))}
              </ol>
            </InsightCard>

            <InsightCard icon={Users} title="People Mentioned">
              <ul className="flex flex-col gap-3">
                {peopleMentions.slice(0, 5).map((person) => (
                  <li key={person.name} className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-glass-border bg-secondary text-[11px] font-semibold text-secondary-foreground">
                      {person.initials}
                    </span>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{person.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {person.mentions}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(person.mentions / maxMentions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </InsightCard>
          </div>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Clock, Users, Network } from 'lucide-react'
import { meetings, meetingSummary } from '@/lib/data'
import { SummaryCard } from '@/components/summary-card'
import { MindMapCanvas } from '@/components/mind-map-canvas'
import { MeetingInsightsTranscript } from '@/components/meeting-insights-transcript'
import { ParticipantStack } from '@/components/meeting-card'

export function generateStaticParams() {
  return meetings.map((m) => ({ id: m.id }))
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const meeting = meetings.find((m) => m.id === id)
  if (!meeting) notFound()

  return (
    <div className="flex flex-col gap-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{meeting.title}</span>
      </nav>

      {/* A) Header */}
      <header className="glass flex flex-col gap-5 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-glass-border bg-glass px-2.5 py-1 text-xs text-muted-foreground">
            {meeting.topic}
          </span>
          <span className="size-1.5 rounded-full bg-pink" title="New insights" />
        </div>
        <h1 className="text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {meeting.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            {meeting.date} · {meeting.time}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            {meeting.duration}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            {meeting.participants.length} participants
          </span>
          <ParticipantStack participants={meeting.participants} max={5} />
        </div>
      </header>

      {/* B) Summary */}
      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetingSummary.map((s) => (
            <SummaryCard key={s.category} summary={s} />
          ))}
        </div>
      </section>

      {/* C) Mind map */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Network className="size-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Mind-Map Summary
          </h2>
        </div>
        <MindMapCanvas />
      </section>

      {/* D + E) Insights + Transcript */}
      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Insights &amp; Transcript
        </h2>
        <MeetingInsightsTranscript />
      </section>
    </div>
  )
}

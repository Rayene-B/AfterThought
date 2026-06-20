'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Calendar, Clock, Users, Network, Loader2 } from 'lucide-react'
import type { Meeting, SummaryItem } from '@/lib/data'
import { SummaryCard } from '@/components/summary-card'
import { MindMapCanvas } from '@/components/mind-map-canvas'
import { MeetingInsightsTranscript } from '@/components/meeting-insights-transcript'
import { ParticipantStack } from '@/components/meeting-card'

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [summaries, setSummaries] = useState<SummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadMeetingDetails() {
      try {
        // Fetch meetings to find the current one
        const meetingsRes = await fetch('/api/meetings')
        const meetingsData = await meetingsRes.json()
        
        // Fetch summaries
        const summaryRes = await fetch('/api/summary')
        const summaryData = await summaryRes.json()
        
        if (meetingsData.ok && meetingsData.meetings) {
          const found = meetingsData.meetings.find((m: any) => m.id === id)
          setMeeting(found || null)
          if (!found) {
            setError(true)
          }
        } else {
          setError(true)
        }
        if (summaryData.ok && summaryData.summaries) {
          setSummaries(summaryData.summaries)
        }
      } catch (err) {
        console.error('Failed to load meeting details', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadMeetingDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !meeting) {
    notFound()
  }

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
          {summaries.map((s) => (
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

'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Tags, SmilePlus, Loader2 } from 'lucide-react'
import { InsightCard } from '@/components/insight-card'
import { TranscriptBlock } from '@/components/transcript-block'
import { GlassPanel } from '@/components/glass-panel'
import type { TranscriptLine } from '@/lib/data'

export function MeetingInsightsTranscript() {
  const [transcriptData, setTranscriptData] = useState<TranscriptLine[]>([])
  const [topTopics, setTopTopics] = useState<{ label: string; weight: number }[]>([])
  const [topKeywords, setTopKeywords] = useState<{ label: string; size: string }[]>([])
  const [sentiment, setSentiment] = useState<{ positive: number; neutral: number; negative: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/insights')
        const data = await res.json()
        if (data.ok) {
          setTranscriptData(data.transcript || [])
          setTopTopics(data.topTopics || [])
          setTopKeywords(data.topKeywords || [])
          setSentiment(data.sentiment || null)
        }
      } catch (err) {
        console.error('Failed to load insights and transcript', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  function scrollToTranscript(keyword: string) {
    const match = transcriptData.find((l) =>
      l.keywords?.some((k) => k.toLowerCase().includes(keyword.toLowerCase())),
    )
    const target = match ? document.getElementById(`t-${match.id}`) : null
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target?.animate(
      [
        { backgroundColor: 'oklch(0.72 0.16 248 / 0.18)' },
        { backgroundColor: 'transparent' },
      ],
      { duration: 1200 },
    )
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-glass-border bg-glass">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Insights panel */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        <InsightCard icon={TrendingUp} title="Most Discussed Topics">
          <ul className="flex flex-col gap-3">
            {topTopics.map((t) => (
              <li key={t.label}>
                <button
                  onClick={() => scrollToTranscript(t.label)}
                  className="group flex w-full flex-col gap-1.5 text-left"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground transition-colors group-hover:text-primary">
                      {t.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.weight}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${t.weight}%` }}
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard icon={Tags} title="Top Keywords">
          <div className="flex flex-wrap gap-2">
            {topKeywords.map((k) => (
              <button
                key={k.label}
                onClick={() => scrollToTranscript(k.label)}
                className="rounded-full border border-glass-border bg-glass px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                {k.label}
              </button>
            ))}
          </div>
        </InsightCard>

        {sentiment && (
          <InsightCard icon={SmilePlus} title="Sentiment">
            <div className="flex flex-col gap-3">
              <div className="flex h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${sentiment.positive}%` }}
                  title={`Positive ${sentiment.positive}%`}
                />
                <div
                  className="h-full bg-muted-foreground/50"
                  style={{ width: `${sentiment.neutral}%` }}
                  title={`Neutral ${sentiment.neutral}%`}
                />
                <div
                  className="h-full bg-pink"
                  style={{ width: `${sentiment.negative}%` }}
                  title={`Negative ${sentiment.negative}%`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  Positive {sentiment.positive}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/50" />
                  Neutral {sentiment.neutral}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-pink" />
                  Negative {sentiment.negative}%
                </span>
              </div>
            </div>
          </InsightCard>
        )}
      </div>

      {/* Transcript viewer */}
      <GlassPanel className="flex flex-col lg:col-span-3">
        <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Transcript
          </h3>
          <span className="text-xs text-muted-foreground">
            {transcriptData.length} segments
          </span>
        </div>
        <div className="max-h-[560px] overflow-y-auto scroll-slim p-2">
          {transcriptData.map((line) => (
            <TranscriptBlock key={line.id} line={line} />
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}

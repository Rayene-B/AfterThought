import {
  BarChart3,
  Tags,
  GitCommitVertical,
  Users,
  SlidersHorizontal,
} from 'lucide-react'
import { InsightCard } from '@/components/insight-card'
import {
  topicFrequency,
  topKeywords,
  decisionTimeline,
  peopleMentions,
} from '@/lib/data'

const sizeMap: Record<string, string> = {
  sm: 'text-sm text-muted-foreground',
  md: 'text-base text-foreground/80',
  lg: 'text-xl font-medium text-foreground',
  xl: 'text-2xl font-semibold text-primary',
}

const filters = ['Last 30 days', 'All participants', 'All topics']

export default function InsightsPage() {
  const maxVal = Math.max(
    ...topicFrequency.flatMap((w) => [w.Roadmap, w.Pricing, w.Search]),
  )
  const maxMentions = Math.max(...peopleMentions.map((p) => p.mentions))

  return (
    <div className="flex flex-col gap-8">
      {/* Header + filters */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Cross-Meeting Insights
          </h1>
          <p className="text-pretty text-muted-foreground">
            Intelligence aggregated across every meeting in your memory.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            Filters
          </span>
          {filters.map((f) => (
            <button
              key={f}
              className="glass rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Topic frequency graph */}
        <InsightCard icon={BarChart3} title="Topic Frequency">
          <div className="flex h-52 items-end justify-between gap-4 pt-2">
            {topicFrequency.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1.5">
                  {(['Roadmap', 'Pricing', 'Search'] as const).map((key, i) => (
                    <div
                      key={key}
                      className="w-3 rounded-t-md"
                      style={{
                        height: `${(w[key] / maxVal) * 100}%`,
                        backgroundColor: [
                          'var(--chart-1)',
                          'var(--chart-2)',
                          'var(--chart-5)',
                        ][i],
                      }}
                      title={`${key}: ${w[key]}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{w.week}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 border-t border-glass-border pt-3 text-xs text-muted-foreground">
            {[
              { l: 'Roadmap', c: 'var(--chart-1)' },
              { l: 'Pricing', c: 'var(--chart-2)' },
              { l: 'Search', c: 'var(--chart-5)' },
            ].map((x) => (
              <span key={x.l} className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: x.c }}
                />
                {x.l}
              </span>
            ))}
          </div>
        </InsightCard>

        {/* Keyword cloud */}
        <InsightCard icon={Tags} title="Keyword Cloud">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2">
            {topKeywords.map((k) => (
              <span
                key={k.label}
                className={`${sizeMap[k.size]} cursor-default leading-none transition-colors hover:text-primary`}
              >
                {k.label}
              </span>
            ))}
          </div>
        </InsightCard>

        {/* Decision timeline */}
        <InsightCard icon={GitCommitVertical} title="Timeline of Major Decisions">
          <ol className="relative flex flex-col gap-5 pl-5">
            <span className="absolute left-[3px] top-1 h-[calc(100%-0.5rem)] w-px bg-glass-border" />
            {decisionTimeline.map((d) => (
              <li key={d.title} className="relative flex flex-col gap-0.5">
                <span className="absolute -left-[18px] top-1 size-2 rounded-full bg-primary ring-4 ring-background" />
                <span className="text-xs text-muted-foreground">{d.date}</span>
                <span className="text-sm font-medium text-foreground">
                  {d.title}
                </span>
                <span className="text-xs text-muted-foreground">{d.meeting}</span>
              </li>
            ))}
          </ol>
        </InsightCard>

        {/* People mentioned */}
        <InsightCard icon={Users} title="People Mentioned Most Often">
          <ul className="flex flex-col gap-3">
            {peopleMentions.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-glass-border bg-secondary text-[11px] font-semibold text-secondary-foreground">
                  {p.initials}
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.mentions}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(p.mentions / maxMentions) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </InsightCard>
      </div>
    </div>
  )
}

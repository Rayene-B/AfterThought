import {
  BarChart3,
  GitCommitVertical,
  SlidersHorizontal,
  Tags,
  Users,
} from 'lucide-react'
import { InsightCard } from '@/components/insight-card'
import {
  decisionTimeline,
  peopleMentions,
  topicFrequency,
  topKeywords,
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
    ...topicFrequency.flatMap((week) => [week.Roadmap, week.Pricing, week.Search]),
    1,
  )
  const maxMentions = Math.max(...peopleMentions.map((person) => person.mentions), 1)

  return (
    <div className="flex flex-col gap-8">
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
          {filters.map((filter) => (
            <span
              key={filter}
              className="glass rounded-full px-3 py-1.5 text-sm text-muted-foreground"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InsightCard icon={BarChart3} title="Topic Frequency">
          <div className="flex h-52 items-end justify-between gap-4 pt-2">
            {topicFrequency.map((week) => (
              <div key={week.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1.5">
                  {(['Roadmap', 'Pricing', 'Search'] as const).map((key, index) => (
                    <div
                      key={key}
                      className="w-3 rounded-t-md"
                      style={{
                        height: `${(week[key] / maxVal) * 100}%`,
                        backgroundColor: [
                          'var(--chart-1)',
                          'var(--chart-2)',
                          'var(--chart-5)',
                        ][index],
                      }}
                      title={`${key}: ${week[key]}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{week.week}</span>
              </div>
            ))}
          </div>
        </InsightCard>

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

        <InsightCard icon={GitCommitVertical} title="Timeline of Major Decisions">
          <ol className="relative flex flex-col gap-5 pl-5">
            <span className="absolute left-[3px] top-1 h-[calc(100%-0.5rem)] w-px bg-glass-border" />
            {decisionTimeline.map((decision) => (
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

        <InsightCard icon={Users} title="People Mentioned Most Often">
          <ul className="flex flex-col gap-3">
            {peopleMentions.map((person) => (
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
  )
}

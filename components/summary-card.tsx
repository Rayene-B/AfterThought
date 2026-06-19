import {
  CheckCircle2,
  CalendarClock,
  ListTodo,
  AlertTriangle,
  Hash,
  type LucideIcon,
} from 'lucide-react'
import type { SummaryItem } from '@/lib/data'

const iconMap: Record<SummaryItem['category'], LucideIcon> = {
  Decisions: CheckCircle2,
  Deadlines: CalendarClock,
  'Action Items': ListTodo,
  Blockers: AlertTriangle,
  Topics: Hash,
}

export function SummaryCard({ summary }: { summary: SummaryItem }) {
  const Icon = iconMap[summary.category]
  const isBlocker = summary.category === 'Blockers'

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl border border-glass-border ${
            isBlocker ? 'bg-pink/10 text-pink' : 'bg-primary/10 text-primary'
          }`}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
            {summary.category}
          </h3>
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
            {summary.description}
          </p>
        </div>
        <span className="ml-auto grid size-6 shrink-0 place-items-center rounded-full border border-glass-border bg-glass text-xs font-medium text-muted-foreground">
          {summary.items.length}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {summary.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                isBlocker ? 'bg-pink' : 'bg-primary'
              }`}
              aria-hidden
            />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

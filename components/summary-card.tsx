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
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl border border-glass-border bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
          {summary.category}
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
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

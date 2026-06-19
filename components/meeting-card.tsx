import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react'
import type { Meeting } from '@/lib/data'
import { cn } from '@/lib/utils'

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export function ParticipantStack({
  participants,
  max = 4,
}: {
  participants: string[]
  max?: number
}) {
  const shown = participants.slice(0, max)
  const extra = participants.length - shown.length
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <span
          key={p}
          title={p}
          className="grid size-7 place-items-center rounded-full border border-glass-border bg-secondary text-[10px] font-semibold text-secondary-foreground ring-2 ring-background"
        >
          {initialsOf(p)}
        </span>
      ))}
      {extra > 0 && (
        <span className="grid size-7 place-items-center rounded-full border border-glass-border bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  )
}

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const processing = meeting.status === 'processing'

  return (
    <article className="glass group relative flex flex-col gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:neon-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-glass-border bg-glass px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {meeting.topic}
          </span>
          {meeting.unread && (
            <span
              className="size-1.5 rounded-full bg-pink"
              aria-label="New insights"
              title="New insights"
            />
          )}
        </div>
        {processing ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Analyzing
          </span>
        ) : (
          <span className="text-xs text-primary">Analyzed</span>
        )}
      </div>

      <h3 className="text-balance font-heading text-lg font-semibold leading-snug text-foreground">
        {meeting.title}
      </h3>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {meeting.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {meeting.duration}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <ParticipantStack participants={meeting.participants} />
        <Link
          href={`/meeting/${meeting.id}`}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20',
            processing && 'pointer-events-none opacity-50',
          )}
        >
          View Summary
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

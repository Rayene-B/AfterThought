import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  FileText,
  ListTodo,
  MessageSquareText,
} from 'lucide-react'
import type { Meeting } from '@/lib/data'
import { cn } from '@/lib/utils'

type MeetingWithTranscript = Omit<Meeting, 'segments'> & {
  segments: Array<{
    speaker: string
    text: string
    timestamp?: string
  }>
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function MeetingCard({ meeting }: { meeting: MeetingWithTranscript }) {
  const actionCount = meeting.action_items?.length ?? 0

  return (
    <details className="glass group relative flex flex-col gap-4 rounded-2xl p-5 transition-all duration-300 open:border-primary/40 open:shadow-[0_0_40px_rgba(47,123,255,0.16)] hover:-translate-y-0.5 hover:border-primary/30 hover:neon-glow">
      <summary className="flex cursor-pointer list-none flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-glass-border bg-glass px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Meeting
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-primary">
            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            <span className="group-open:hidden">Click to expand</span>
            <span className="hidden group-open:inline">Transcript open</span>
          </span>
        </div>

        <h3 className="text-balance font-heading text-lg font-semibold leading-snug text-foreground">
          {meeting.title}
        </h3>

        {meeting.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {meeting.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(meeting.created_at)}
          </span>
          {actionCount > 0 && (
            <span className="flex items-center gap-1.5">
              <ListTodo className="size-3.5" />
              {actionCount} action item{actionCount !== 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MessageSquareText className="size-3.5" />
            {meeting.segments?.length ?? 0} transcript moments
          </span>
        </div>
      </summary>

      <div className="mt-4 max-h-[28rem] overflow-y-auto rounded-2xl border border-primary/20 bg-background/30 p-3 scroll-slim">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
          <FileText className="size-3.5" />
          Full transcript
        </div>
        <div className="flex flex-col gap-3">
          {meeting.segments.map((segment, index) => (
            <div
              key={`${segment.speaker}-${segment.text}-${index}`}
              className="rounded-xl border border-glass-border bg-glass p-3"
            >
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {segment.speaker}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {segment.timestamp ?? `${String(index).padStart(2, '0')}:00`}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {segment.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link
          href={`/search?meetingId=${encodeURIComponent(meeting.id)}`}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20',
          )}
        >
          Ask AI
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </details>
  )
}

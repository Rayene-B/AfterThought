import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  UserRound,
} from 'lucide-react'
import {
  generateCalendarEvents,
  type SavedCalendarEvent,
} from '@/lib/calendar'
import { getLocalMeetings } from '@/lib/meeting-store'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function sourceLabel(source: SavedCalendarEvent['source']) {
  return source === 'action_item' ? 'Action item' : 'Transcript date'
}

export default function CalendarPage() {
  const events = generateCalendarEvents(getLocalMeetings())

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-pink" />
          Auto-saved from meeting memory
        </span>
        <div>
          <h1 className="flex items-center gap-3 font-heading text-3xl font-bold tracking-tight text-foreground">
            <Calendar className="size-8 text-primary" />
            Calendar
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Deadlines and dated action items are automatically pulled from meeting
            transcripts and saved here with context.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Saved dates</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
            {events.length}
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Action deadlines</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
            {events.filter((event) => event.source === 'action_item').length}
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Transcript dates</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
            {events.filter((event) => event.source === 'transcript').length}
          </p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event, index) => (
            <article
              key={event.id}
              className={cn(
                'glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(47,123,255,0.14)]',
                index === 0 && 'border-primary/30',
              )}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-pink/10" />
              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-glass-border bg-background/30 px-2.5 py-1 text-xs text-muted-foreground">
                        {sourceLabel(event.source)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-pink/20 bg-pink/10 px-2.5 py-1 text-xs text-pink">
                        <Sparkles className="size-3" />
                        Auto-saved
                      </span>
                    </div>

                    <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-foreground">
                      {event.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-4 text-primary" />
                        {formatDate(event.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4 text-primary" />
                        {event.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="size-4 text-primary" />
                        {event.assignee}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="size-4 text-primary" />
                        {event.meetingTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center text-muted-foreground">
          <AlertTriangle className="size-8 opacity-50" />
          <p>No deadlines or dates found yet.</p>
        </div>
      )}
    </div>
  )
}

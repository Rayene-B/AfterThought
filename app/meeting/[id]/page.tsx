import { notFound } from 'next/navigation'
import { Calendar, CheckCircle2, MessageSquareText } from 'lucide-react'
import { getLocalMeetings } from '@/lib/meeting-store'

type MeetingDetailPageProps = {
  params: Promise<{ id: string }>
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params
  const meeting = getLocalMeetings().find((item) => item.id === id)

  if (!meeting) notFound()

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-pink" />
          Meeting details
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {meeting.title}
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 text-primary" />
          {formatDate(meeting.created_at)}
        </p>
      </header>

      <section className="glass rounded-2xl p-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
          Summary
        </h2>
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
          {meeting.summary || 'No summary available.'}
        </p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <CheckCircle2 className="size-5 text-primary" />
          Action Items
        </h2>
        {meeting.action_items?.length ? (
          <ul className="flex flex-col gap-2.5">
            {meeting.action_items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No action items detected.</p>
        )}
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <MessageSquareText className="size-5 text-primary" />
          Transcript
        </h2>
        {meeting.segments?.length ? (
          <div className="space-y-3">
            {meeting.segments.map((segment, index) => (
              <div
                key={`${segment.speaker}-${segment.text}-${index}`}
                className="glass rounded-xl p-4"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {segment.speaker}
                  </p>
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
        ) : (
          <p className="text-muted-foreground">Transcript not available.</p>
        )}
      </section>
    </div>
  )
}

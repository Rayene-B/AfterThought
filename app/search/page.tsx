import { Sparkles } from 'lucide-react'
import { SearchAIExperience } from '@/components/ai-answer-experience'
import { examplePrompts } from '@/lib/data'
import { askMeetingAI, relatedResults } from '@/lib/meeting-ai'
import { findMeeting, getLocalMeetings } from '@/lib/meeting-store'

type SearchPageProps = {
  searchParams: Promise<{
    meetingId?: string
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const meetings = getLocalMeetings()
  const selectedMeeting = params.meetingId ? findMeeting(params.meetingId) : null
  const hasServerQuestion = Boolean(selectedMeeting && params.q?.trim())
  const initialAnswer = hasServerQuestion
    ? await askMeetingAI(params.q!.trim(), selectedMeeting!)
    : ''
  const initialResults = hasServerQuestion
    ? relatedResults(params.q!.trim(), [selectedMeeting!])
    : []

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-7">
      <div className="flex flex-col gap-4">
        <span className="grid size-12 place-items-center rounded-2xl border border-glass-border bg-primary/10 text-primary">
          <Sparkles className="size-6" />
        </span>
        <div>
          <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground">
            Search your meeting memory
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
            Select a meeting, ask a question, and AfterThought answers using
            that meeting transcript.
          </p>
        </div>
      </div>

      <SearchAIExperience
        meetings={meetings}
        selectedMeetingId={params.meetingId}
        initialQuestion={params.q}
        initialAnswer={initialAnswer}
        initialResults={initialResults}
        prompts={['create a summary', ...examplePrompts]}
      />
    </div>
  )
}

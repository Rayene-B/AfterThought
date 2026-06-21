import { NextResponse } from 'next/server'
import { askMeetingAI, relatedResults } from '@/lib/meeting-ai'
import { findMeeting, getLocalMeetings } from '@/lib/meeting-store'

type SearchBody = {
  q?: string
  question?: string
  meetingId?: string
}

async function handleSearch(question: string, meetingId?: string | null) {
  const meetings = getLocalMeetings()
  const selectedMeeting = findMeeting(meetingId)
  const answer = await askMeetingAI(question, selectedMeeting)

  return NextResponse.json({
    ok: true,
    query: question,
    selectedMeetingId: selectedMeeting.id,
    answer,
    results: relatedResults(question, meetings),
    meetings,
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const question = searchParams.get('q') ?? ''
  const meetingId = searchParams.get('meetingId')

  if (!question.trim()) {
    return NextResponse.json({
      ok: true,
      query: '',
      answer: '',
      results: [],
      meetings: getLocalMeetings(),
    })
  }

  try {
    return await handleSearch(question, meetingId)
  } catch (error) {
    console.error('Search AI failed:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as SearchBody
  const question = body.question ?? body.q ?? ''

  if (!question.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Question is required' },
      { status: 400 },
    )
  }

  try {
    return await handleSearch(question, body.meetingId)
  } catch (error) {
    console.error('Search AI failed:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 },
    )
  }
}

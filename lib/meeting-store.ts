import type { Meeting } from './data'
import { demoMeetings } from './demo-meetings'

type MeetingSegment = {
  speaker: string
  text: string
  timestamp?: string
}

export type StoredMeeting = Omit<Meeting, 'segments'> & {
  segments: MeetingSegment[]
}

const globalStore = globalThis as typeof globalThis & {
  __afterThoughtMeetings?: StoredMeeting[]
}

if (!globalStore.__afterThoughtMeetings) {
  globalStore.__afterThoughtMeetings = demoMeetings
}

export function getLocalMeetings() {
  const meetings = globalStore.__afterThoughtMeetings!
  const seededDemo = demoMeetings.find((meeting) => meeting.id === 'demo-api-redesign')
  const storedDemo = meetings.find((meeting) => meeting.id === 'demo-api-redesign')

  if (seededDemo && (!storedDemo || storedDemo.segments.length < seededDemo.segments.length)) {
    globalStore.__afterThoughtMeetings = [
      seededDemo,
      ...meetings.filter((meeting) => meeting.id !== seededDemo.id),
    ]
  }

  return globalStore.__afterThoughtMeetings!
}

export function addLocalMeeting(meeting: StoredMeeting) {
  const meetings = getLocalMeetings()
  const withoutExisting = meetings.filter((item) => item.id !== meeting.id)
  globalStore.__afterThoughtMeetings = [meeting, ...withoutExisting]
  return meeting
}

export function normalizeMeeting(meeting: any): StoredMeeting {
  return {
    id: String(meeting.id),
    title: meeting.title || 'Untitled Meeting',
    summary: meeting.summary || '',
    action_items: Array.isArray(meeting.action_items) ? meeting.action_items : [],
    segments: Array.isArray(meeting.segments) ? meeting.segments : [],
    created_at: meeting.created_at || new Date().toISOString(),
  }
}

export function mergeMeetings(remoteMeetings: any[] = []) {
  const local = getLocalMeetings()
  const normalizedRemote = remoteMeetings.map(normalizeMeeting)
  const byId = new Map<string, StoredMeeting>()

  for (const meeting of [...local, ...normalizedRemote]) {
    byId.set(meeting.id, meeting)
  }

  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function findMeeting(id?: string | null) {
  const meetings = getLocalMeetings()
  if (!id) return meetings[0]
  return meetings.find((meeting) => meeting.id === id) ?? meetings[0]
}

export function transcriptFromMeeting(meeting: StoredMeeting) {
  return meeting.segments
    .map((segment) => `${segment.speaker}: ${segment.text}`)
    .join('\n')
}

import type { StoredMeeting } from './meeting-store'

export type SavedCalendarEvent = {
  id: string
  title: string
  description: string
  date: string
  time: string
  assignee: string
  meetingId: string
  meetingTitle: string
  source: 'action_item' | 'transcript'
}

type DateMatch = {
  label: string
  date: Date
}

const weekdayIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function nextWeekday(baseDate: Date, weekday: number, forceNextWeek = false) {
  const current = baseDate.getDay()
  let distance = (weekday - current + 7) % 7

  if (distance === 0 || forceNextWeek) {
    distance += 7
  }

  return addDays(baseDate, distance)
}

function extractDate(text: string, meetingDate: Date): DateMatch | null {
  const lower = text.toLowerCase()
  const weekday = Object.keys(weekdayIndex).find((day) => lower.includes(day))

  if (weekday) {
    return {
      label: weekday.replace(/^\w/, (letter) => letter.toUpperCase()),
      date: nextWeekday(
        meetingDate,
        weekdayIndex[weekday],
        lower.includes(`next ${weekday}`),
      ),
    }
  }

  if (/\btomorrow\b/.test(lower)) {
    return { label: 'Tomorrow', date: addDays(meetingDate, 1) }
  }

  const monthDate = text.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})\b/i,
  )

  if (monthDate) {
    const parsed = new Date(`${monthDate[1]} ${monthDate[2]}, ${meetingDate.getFullYear()}`)
    if (!Number.isNaN(parsed.getTime())) {
      return { label: monthDate[0], date: parsed }
    }
  }

  return null
}

function extractAssignee(text: string, fallback = 'Unassigned') {
  const direct = text.match(/^([A-Z][a-z]+)\s+(?:to|will|owns?|needs?|can)\b/)
  if (direct) return direct[1]

  const speaker = text.match(/^([A-Z][a-z]+):/)
  if (speaker) return speaker[1]

  return fallback
}

function eventTitle(text: string) {
  return text
    .replace(/^[A-Z][a-z]+:\s*/, '')
    .replace(/\b(before|by|on|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(.{86}).+$/, '$1...')
}

function toEvent(
  meeting: StoredMeeting,
  text: string,
  source: SavedCalendarEvent['source'],
  index: number,
): SavedCalendarEvent | null {
  const meetingDate = new Date(meeting.created_at)
  const match = extractDate(text, meetingDate)

  if (!match) return null

  const assignee = extractAssignee(text)
  const title = eventTitle(text)

  return {
    id: `${meeting.id}-${source}-${index}-${slug(text)}`,
    title: title || 'Follow up from meeting',
    description: `${match.label} deadline from "${meeting.title}". Source: ${text}`,
    date: match.date.toISOString(),
    time: '09:00 AM',
    assignee,
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    source,
  }
}

export function generateCalendarEvents(meetings: StoredMeeting[]) {
  const events = meetings.flatMap((meeting) => {
    const actionEvents = (meeting.action_items ?? [])
      .map((item, index) => toEvent(meeting, item, 'action_item', index))
      .filter(Boolean) as SavedCalendarEvent[]

    const transcriptEvents = (meeting.segments ?? [])
      .map((segment, index) =>
        toEvent(
          meeting,
          `${segment.speaker}: ${segment.text}`,
          'transcript',
          index,
        ),
      )
      .filter(Boolean) as SavedCalendarEvent[]

    return [...actionEvents, ...transcriptEvents]
  })

  const byEvent = new Map<string, SavedCalendarEvent>()

  for (const event of events) {
    const key = `${event.meetingId}-${event.date}-${event.title}`
    byEvent.set(key, event)
  }

  return Array.from(byEvent.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
}

export async function createCalendarEvent(actionItem: string, meetingId: string) {
  console.log(
    `[Calendar] Local event will be generated for meeting ${meetingId}: ${actionItem}`,
  )
}

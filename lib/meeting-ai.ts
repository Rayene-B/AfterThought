import {
  transcriptFromMeeting,
  type StoredMeeting,
} from '@/lib/meeting-store'

export type SearchResult = {
  text: string
  speaker?: string
  timestamp?: string
  meetingId?: string
  meetingTitle?: string
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

export function relatedResults(
  question: string,
  meetings: StoredMeeting[],
): SearchResult[] {
  const terms = tokenize(question)

  return meetings
    .flatMap((meeting) =>
      meeting.segments.map((segment, index) => {
        const source = `${segment.speaker}: ${segment.text}`.toLowerCase()
        const score = terms.reduce(
          (total, term) => total + (source.includes(term) ? 1 : 0),
          0,
        )

        return {
          score,
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          speaker: segment.speaker,
          text: segment.text,
          timestamp: segment.timestamp ?? `${String(index).padStart(2, '0')}:00`,
        }
      }),
    )
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...result }) => result)
}

export async function askMeetingAI(question: string, meeting: StoredMeeting) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY

  if (!apiKey) {
    return 'OpenRouter is not configured. Add OPENROUTER_API_KEY to .env.local to enable AI answers.'
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://127.0.0.1:3011',
      'X-Title': 'AfterThought',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content:
            'You are AfterThought, a precise meeting memory assistant. Answer only from the selected meeting transcript. If the answer has multiple items, format them as short bullet points. Mention owners, decisions, and deadlines when relevant.',
        },
        {
          role: 'user',
          content: `Selected meeting: ${meeting.title}\n\nTranscript:\n${transcriptFromMeeting(meeting)}\n\nQuestion: ${question}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    return `AI request failed: ${await response.text()}`
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content?.trim() || 'No answer returned.'
}

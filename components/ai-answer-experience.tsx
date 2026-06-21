'use client'

import {
  CheckCircle2,
  Clock3,
  FileText,
  Lightbulb,
  Mic,
  MessageSquareText,
  OctagonAlert,
  Square,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { GlassPanel } from '@/components/glass-panel'
import { cn } from '@/lib/utils'

type MeetingSegment = {
  speaker: string
  text: string
  timestamp?: string
}

type Meeting = {
  id: string
  title: string
  summary: string
  action_items: string[]
  segments: MeetingSegment[]
  created_at: string
}

type SearchResult = {
  text: string
  speaker?: string
  timestamp?: string
  meetingId?: string
  meetingTitle?: string
}

type SearchResponse = {
  ok: boolean
  answer?: string
  results?: SearchResult[]
  error?: string
}

type CreateMeetingResponse = {
  ok: boolean
  meeting?: Meeting
  error?: string
}

type BubbleStyle = CSSProperties & {
  '--start-x': string
  '--start-y': string
  '--cluster-x': string
  '--cluster-y': string
  '--bubble-delay': string
  '--bubble-scale': string
}

const thinkingStages = [
  'Searching transcript moments...',
  'Finding decisions...',
  'Connecting action items...',
  'Synthesizing memory...',
]

const bubblePositions = [
  ['clamp(-260px, -28vw, -96px)', 'clamp(-170px, -22vw, -72px)', '-44px', '-26px', '1.15'],
  ['clamp(-180px, -20vw, -68px)', 'clamp(120px, 18vw, 190px)', '-18px', '38px', '0.92'],
  ['clamp(130px, 18vw, 210px)', 'clamp(-160px, -18vw, -70px)', '42px', '-34px', '1.05'],
  ['clamp(190px, 25vw, 280px)', 'clamp(92px, 14vw, 160px)', '50px', '28px', '0.86'],
  ['clamp(-310px, -34vw, -130px)', 'clamp(35px, 8vw, 95px)', '-62px', '12px', '0.78'],
  ['clamp(260px, 30vw, 330px)', 'clamp(-40px, -7vw, -18px)', '66px', '-4px', '0.72'],
  ['clamp(-80px, -9vw, -28px)', 'clamp(-240px, -28vw, -108px)', '0px', '-62px', '0.84'],
  ['clamp(45px, 9vw, 120px)', 'clamp(185px, 24vw, 260px)', '16px', '58px', '0.76'],
  ['clamp(-230px, -25vw, -105px)', 'clamp(-20px, -3vw, -8px)', '-34px', '6px', '0.68'],
  ['clamp(210px, 24vw, 290px)', 'clamp(165px, 22vw, 245px)', '36px', '48px', '0.66'],
  ['clamp(-35px, -5vw, -16px)', 'clamp(90px, 13vw, 150px)', '-4px', '34px', '0.64'],
  ['clamp(90px, 13vw, 155px)', 'clamp(-36px, -6vw, -18px)', '24px', '-8px', '0.7'],
] as const

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function splitAnswer(answer: string) {
  const lines = answer
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^([-*]|\d+\.)\s+/, '').trim())
    .filter(Boolean)

  return lines.length > 1 ? lines : [answer].filter(Boolean)
}

function parseAnswerItem(item: string) {
  const markdownLabel = item.match(/^\*\*([^*]+):\*\*\s*(.*)$/)
  const plainLabel = item.match(/^([A-Z][A-Za-z ]{1,24}):\s+(.+)$/)
  const match = markdownLabel || plainLabel

  if (!match) {
    return {
      label: '',
      body: item.replace(/\*\*/g, ''),
    }
  }

  return {
    label: match[1],
    body: match[2].replace(/\*\*/g, ''),
  }
}

function buildSearchHref(
  basePath: string,
  meetingId?: string,
  question?: string,
  sectionHash?: string,
) {
  const params = new URLSearchParams()

  if (meetingId) params.set('meetingId', meetingId)
  if (question) params.set('q', question)

  const query = params.toString()
  const hash = sectionHash ? `#${sectionHash}` : ''

  return query ? `${basePath}?${query}${hash}` : `${basePath}${hash}`
}

function textIncludesAny(text: string, terms: string[]) {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).slice(0, 4)
}

function scrollToAnswerElement(element: HTMLElement | null) {
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - 96

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'smooth',
  })
}

function sectionItems(meeting: Meeting, kind: 'decisions' | 'deadlines' | 'blockers') {
  const rules = {
    decisions: ['decision', 'decided', 'agreed', 'approved', 'deploy'],
    deadlines: ['friday', 'monday', 'tuesday', 'wednesday', 'thursday', 'deadline', 'by '],
    blockers: ['blocker', 'blocked', 'risk', 'waiting', 'need ', 'depends'],
  }

  return uniqueItems(
    meeting.segments
      .filter((segment) => textIncludesAny(segment.text, rules[kind]))
      .map((segment) => `${segment.speaker}: ${segment.text}`),
  )
}

function sectionSegments(meeting: Meeting, kind: 'answer' | 'evidence' | 'decisions' | 'actions' | 'deadlines' | 'blockers') {
  const rules = {
    answer: ['problem', 'recommendation', 'decision', 'own', 'blocker', 'deploy'],
    evidence: [],
    decisions: ['decision', 'decided', 'agreed', 'approved', 'deploy'],
    actions: ['own', 'will', 'can you', 'follow up', 'update', 'redesign'],
    deadlines: ['friday', 'monday', 'tuesday', 'wednesday', 'thursday', 'deadline', 'by '],
    blockers: ['blocker', 'blocked', 'risk', 'waiting', 'need ', 'depends'],
  }

  if (kind === 'evidence') return meeting.segments.slice(0, 5)

  const matches = meeting.segments.filter((segment) =>
    textIncludesAny(`${segment.speaker}: ${segment.text}`, rules[kind]),
  )

  return (matches.length ? matches : meeting.segments.slice(0, 4)).slice(0, 7)
}

function buildRecordedMeeting(transcript: string): Meeting {
  const lines = transcript
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const fallbackLines = lines.length ? lines : [transcript.trim()].filter(Boolean)
  const segments = fallbackLines.map((line, index) => {
    const speakerMatch = line.match(/^([^:]{1,32}):\s*(.+)$/)

    return {
      speaker: speakerMatch?.[1] || 'Speaker 1',
      text: speakerMatch?.[2] || line,
      timestamp: `${String(Math.floor(index / 2)).padStart(2, '0')}:${String((index % 2) * 30).padStart(2, '0')}`,
    }
  })

  return {
    id: `recording-${Date.now()}`,
    title: `Recorded Meeting ${new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    summary:
      segments.length > 1
        ? `Voice recording captured ${segments.length} transcript moments. Ask AI to summarize decisions, actions, deadlines, and blockers.`
        : 'Voice recording captured a transcript. Ask AI to summarize the meeting.',
    action_items: [],
    segments,
    created_at: new Date().toISOString(),
  }
}

function bubbleLabelsForMeeting(meeting: Meeting | null) {
  const speakers = meeting
    ? uniqueItems(meeting.segments.map((segment) => segment.speaker)).slice(0, 4)
    : ['Alice', 'Bob']

  return [
    'Decision',
    'Action',
    'Deadline',
    'Risk',
    'Blocker',
    'Owner',
    ...speakers,
    'Summary',
    'Evidence',
    'Context',
  ].slice(0, 12)
}

export function MemoryBubble({
  label,
  index,
  phase,
}: {
  label: string
  index: number
  phase: 'thinking' | 'revealing'
}) {
  const position = bubblePositions[index % bubblePositions.length]
  const style: BubbleStyle = {
    '--start-x': position[0],
    '--start-y': position[1],
    '--cluster-x': position[2],
    '--cluster-y': position[3],
    '--bubble-scale': position[4],
    '--bubble-delay': `${index * 70}ms`,
  }

  return (
    <div className="memory-bubble-shell" data-phase={phase} style={style}>
      <div className="memory-bubble-core">
        <span>{label}</span>
      </div>
    </div>
  )
}

export function ThinkingStageText({ active }: { active: boolean }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!active) return

    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % thinkingStages.length)
    }, 600)

    return () => window.clearInterval(timer)
  }, [active])

  return (
    <div className="memory-stage-text" key={stage}>
      <span className="size-1.5 rounded-full bg-pink shadow-[0_0_18px_rgba(255,77,157,0.9)]" />
      {thinkingStages[stage]}
    </div>
  )
}

export function MemoryBubbleCluster({
  question,
  labels,
  phase,
  onStop,
}: {
  question: string
  labels: string[]
  phase: 'thinking' | 'revealing'
  onStop: () => void
}) {
  return (
    <div className="memory-overlay">
      <div className="memory-shell" data-phase={phase}>
        <div className="memory-header">
          <div className="font-heading text-2xl font-black tracking-tight text-foreground">
            AT<span className="text-pink">.</span>
          </div>
          <button
            type="button"
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-full border border-pink/25 bg-pink/10 px-4 py-2 text-xs font-medium text-pink transition hover:bg-pink/15"
          >
            <X className="size-3.5" />
            Stop thinking
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-xl rounded-full border border-glass-border bg-background/45 px-5 py-3 text-center text-sm text-foreground shadow-[0_0_36px_rgba(47,123,255,0.08)] backdrop-blur-xl sm:text-base">
          {question}
        </div>

        <div className="memory-cluster" data-phase={phase}>
          <div className="memory-core-light" />
          <div className="memory-link memory-link-a" />
          <div className="memory-link memory-link-b" />
          <div className="memory-link memory-link-c" />
          {labels.map((label, index) => (
            <MemoryBubble key={`${label}-${index}`} label={label} index={index} phase={phase} />
          ))}
        </div>

        <ThinkingStageText active={phase === 'thinking'} />
      </div>
    </div>
  )
}

export function EvidenceCard({
  title,
  body,
  meta,
  tone = 'blue',
  icon,
}: {
  title: string
  body: string
  meta?: string
  tone?: 'blue' | 'pink' | 'purple'
  icon?: ReactNode
}) {
  const toneClass = {
    blue: 'border-primary/20 bg-primary/8 text-primary',
    pink: 'border-pink/20 bg-pink/8 text-pink',
    purple: 'border-violet-400/20 bg-violet-400/8 text-violet-300',
  }[tone]

  return (
    <div className="answer-section-card group">
      <div className="flex items-start gap-3">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-2xl border', toneClass)}>
          {icon ?? <Sparkles className="size-4" />}
        </span>
        <div className="min-w-0">
          <h4 className="font-heading text-sm font-semibold text-foreground">
            {title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
          {meta && <p className="mt-3 text-xs text-muted-foreground">{meta}</p>}
        </div>
      </div>
    </div>
  )
}

export function AIAnswerReveal({
  answer,
  results,
  meeting,
}: {
  answer: string
  results: SearchResult[]
  meeting: Meeting
}) {
  const answerItems = splitAnswer(answer)
  const decisions = sectionItems(meeting, 'decisions')
  const deadlines = sectionItems(meeting, 'deadlines')
  const blockers = sectionItems(meeting, 'blockers')
  const actionItems = uniqueItems(meeting.action_items)
  const evidenceItems = (results.length ? results : meeting.segments.slice(0, 4)).slice(0, 4)
  const parsedAnswerItems = answerItems.map(parseAnswerItem)
  const transcriptRef = useRef<HTMLDivElement | null>(null)
  const detailRef = useRef<HTMLElement | null>(null)
  const solarSections = [
    {
      id: 'answer',
      title: 'Answer',
      kicker: 'Core memory',
      count: parsedAnswerItems.length,
      tone: 'pink',
      summary: parsedAnswerItems[0]?.body || answer,
      items: parsedAnswerItems.map((item) =>
        item.label ? `${item.label}: ${item.body}` : item.body,
      ),
      segments: sectionSegments(meeting, 'answer'),
      icon: WandSparkles,
    },
    {
      id: 'evidence',
      title: 'Evidence',
      kicker: 'Transcript signals',
      count: evidenceItems.length,
      tone: 'blue',
      summary: 'The most relevant transcript moments supporting this answer.',
      items: evidenceItems.map(
        (item) => `${item.timestamp ?? '00:00'} - ${item.speaker || 'Transcript'}: ${item.text}`,
      ),
      segments: sectionSegments(meeting, 'evidence'),
      icon: FileText,
    },
    {
      id: 'decisions',
      title: 'Decisions',
      kicker: 'What changed',
      count: decisions.length,
      tone: 'pink',
      summary: decisions[0] || 'No explicit decision was found in this meeting.',
      items: decisions.length ? decisions : ['No explicit decision was found in this meeting.'],
      segments: sectionSegments(meeting, 'decisions'),
      icon: Lightbulb,
    },
    {
      id: 'actions',
      title: 'Actions',
      kicker: 'Ownership',
      count: actionItems.length,
      tone: 'blue',
      summary: actionItems[0] || 'No action items were captured for this meeting.',
      items: actionItems.length ? actionItems : ['No action items were captured for this meeting.'],
      segments: sectionSegments(meeting, 'actions'),
      icon: CheckCircle2,
    },
    {
      id: 'deadlines',
      title: 'Deadlines',
      kicker: 'Dates',
      count: deadlines.length,
      tone: 'purple',
      summary: deadlines[0] || 'No deadline was found in the transcript.',
      items: deadlines.length ? deadlines : ['No deadline was found in the transcript.'],
      segments: sectionSegments(meeting, 'deadlines'),
      icon: Clock3,
    },
    {
      id: 'blockers',
      title: 'Blockers',
      kicker: 'Risks',
      count: blockers.length,
      tone: 'pink',
      summary: blockers[0] || 'No blocker was found in the transcript.',
      items: blockers.length ? blockers : ['No blocker was found in the transcript.'],
      segments: sectionSegments(meeting, 'blockers'),
      icon: OctagonAlert,
    },
  ]
  const [activeSectionId, setActiveSectionId] = useState(solarSections[0].id)
  const activeSection =
    solarSections.find((section) => section.id === activeSectionId) ?? solarSections[0]
  const ActiveIcon = activeSection.icon

  function focusSolarSection(sectionId: string) {
    setActiveSectionId(sectionId)
    window.setTimeout(() => scrollToAnswerElement(detailRef.current), 80)
    window.setTimeout(() => scrollToAnswerElement(detailRef.current), 360)
  }

  function isActiveSegment(segment: MeetingSegment) {
    return activeSection.segments.some(
      (item) =>
        item.timestamp === segment.timestamp &&
        item.speaker === segment.speaker &&
        item.text === segment.text,
    )
  }

  useEffect(() => {
    const timers = [260, 720, 1250].map((delay) =>
      window.setTimeout(() => scrollToAnswerElement(detailRef.current), delay),
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [answer, meeting.id])

  return (
    <div className="answer-reveal">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-52 rounded-full bg-pink/12 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span className="grid size-10 place-items-center rounded-2xl border border-primary/25 bg-primary/10 shadow-[0_0_26px_rgba(47,123,255,0.22)]">
            <WandSparkles className="size-4" />
          </span>
          AI Answer
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
          <CheckCircle2 className="size-3.5" />
          Memory synthesized
        </span>
      </div>

      <section className="solar-answer-system mt-6">
        <aside
          id="solar-answer-detail"
          ref={detailRef}
          className="solar-detail-panel"
          data-tone={activeSection.tone}
        >
          <div className="flex items-start gap-3">
            <span className="solar-detail-icon">
              <ActiveIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-pink">
                {activeSection.kicker}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                {activeSection.title}
              </h3>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {activeSection.summary}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {activeSection.items.map((item, index) => (
              <div
                key={`${activeSection.id}-${index}`}
                className="solar-detail-item"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-full border border-glass-border bg-background/35 px-3 py-2 text-xs text-muted-foreground">
            {activeSection.count} signal{activeSection.count === 1 ? '' : 's'} from {meeting.title}
          </div>
        </aside>

        <div className="solar-map" aria-label="Meeting answer solar system">
          <div className="solar-orbit solar-orbit-one" />
          <div className="solar-orbit solar-orbit-two" />
          <div className="solar-orbit solar-orbit-three" />

          <button
            type="button"
            className="solar-core-planet"
            onClick={() => focusSolarSection('answer')}
          >
            <span className="text-[11px] uppercase tracking-wide text-pink">Main topic</span>
            <strong>{meeting.title}</strong>
          </button>

          {solarSections.map((section, index) => {
            const Icon = section.icon
            const orbitRadii = [
              'clamp(13rem, 24vw, 18rem)',
              'clamp(16rem, 34vw, 27rem)',
              'clamp(14rem, 29vw, 22rem)',
              'clamp(17rem, 38vw, 31rem)',
              'clamp(15rem, 31vw, 24rem)',
              'clamp(16rem, 36vw, 29rem)',
            ]
            const style = {
              '--orbit-angle': `${index * 60 - 18}deg`,
              '--orbit-radius': orbitRadii[index] ?? '24rem',
              '--orbit-delay': `${index * -1.2}s`,
            } as CSSProperties

            return (
              <button
                key={section.id}
                type="button"
                data-active={section.id === activeSection.id}
                data-tone={section.tone}
                className="solar-topic-planet"
                style={style}
                onClick={() => focusSolarSection(section.id)}
              >
                <span className="solar-topic-glow" />
                <Icon className="size-4" />
                <span>{section.title}</span>
              </button>
            )
          })}
        </div>

        <div ref={transcriptRef} className="solar-transcript-panel">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">
                Transcript reference
              </p>
              <h3 className="mt-1 font-heading text-xl font-semibold text-foreground">
                {activeSection.title} source moments
              </h3>
            </div>
            <span className="rounded-full border border-pink/20 bg-pink/10 px-3 py-1 text-xs text-pink">
              {activeSection.segments.length} highlighted
            </span>
          </div>

          <div className="scroll-slim mt-5 max-h-[28rem] overflow-y-auto pr-2">
            {meeting.segments.map((segment) => (
              <article
                key={`${segment.timestamp}-${segment.speaker}-${segment.text}`}
                className={cn(
                  'solar-transcript-row',
                  isActiveSegment(segment) && 'solar-transcript-row-active',
                )}
              >
                <span className="solar-transcript-time">{segment.timestamp ?? '00:00'}</span>
                <div>
                  <p className="solar-transcript-speaker">{segment.speaker}</p>
                  <p className="solar-transcript-text">{segment.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function VoiceMeetingRecorder({
  onMeetingSaved,
}: {
  onMeetingSaved: (meeting: Meeting) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [status, setStatus] = useState('Ready to record a meeting from your microphone.')
  const recognitionRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const transcriptRef = useRef('')

  function stopRecorder() {
    recognitionRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsRecording(false)
  }

  async function saveTranscript(transcript: string) {
    const cleaned = transcript.trim()

    if (!cleaned) {
      setStatus('No speech was captured. Try recording again.')
      return
    }

    setStatus('Saving recording to recent meetings...')
    const draftMeeting = buildRecordedMeeting(cleaned)
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftMeeting),
    })
    const data = (await response.json()) as CreateMeetingResponse

    if (!response.ok || !data.ok || !data.meeting) {
      throw new Error(data.error || 'Could not save recording.')
    }

    onMeetingSaved(data.meeting)
    setLiveTranscript('')
    transcriptRef.current = ''
    setStatus('Recording saved to recent meetings.')
  }

  async function startRecorder() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setStatus('Voice recording needs Chrome or Edge speech recognition support.')
      return
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      transcriptRef.current = ''
      setLiveTranscript('')
      setStatus('Listening... speak naturally. Stop recording when the meeting ends.')

      recognition.onresult = (event: any) => {
        let finalText = transcriptRef.current
        let interimText = ''

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const text = event.results[index][0]?.transcript?.trim()
          if (!text) continue

          if (event.results[index].isFinal) {
            finalText = `${finalText}\nSpeaker 1: ${text}`.trim()
          } else {
            interimText = text
          }
        }

        transcriptRef.current = finalText
        setLiveTranscript([finalText, interimText ? `Speaker 1: ${interimText}` : '']
          .filter(Boolean)
          .join('\n'))
      }

      recognition.onerror = (event: any) => {
        setStatus(`Recording error: ${event.error || 'microphone unavailable'}`)
        setIsRecording(false)
      }

      recognition.onend = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        const captured = transcriptRef.current
        setIsRecording(false)
        void saveTranscript(captured).catch((error) => {
          setStatus(error instanceof Error ? error.message : 'Could not save recording.')
        })
      }

      recognitionRef.current = recognition
      setIsRecording(true)
      recognition.start()
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Microphone permission failed: ${error.message}`
          : 'Microphone permission failed.',
      )
      setIsRecording(false)
    }
  }

  return (
    <div className="voice-recorder-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-pink">Voice capture</p>
          <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
            Record a meeting
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{status}</p>
        </div>
        <button
          type="button"
          onClick={isRecording ? stopRecorder : startRecorder}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-all',
            isRecording
              ? 'border border-pink/35 bg-pink/15 text-pink shadow-[0_0_24px_rgba(255,77,157,0.18)]'
              : 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
          )}
        >
          {isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
          {isRecording ? 'Stop & save' : 'Start recording'}
        </button>
      </div>
      {liveTranscript && (
        <div className="scroll-slim mt-4 max-h-36 overflow-y-auto rounded-2xl border border-glass-border bg-background/35 p-3 text-xs leading-relaxed text-muted-foreground">
          {liveTranscript.split('\n').map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchAIExperience({
  meetings,
  selectedMeetingId,
  initialQuestion,
  initialAnswer = '',
  initialResults = [],
  prompts,
  basePath = '/search',
  sectionHash,
}: {
  meetings: Meeting[]
  selectedMeetingId?: string
  initialQuestion?: string
  initialAnswer?: string
  initialResults?: SearchResult[]
  prompts: string[]
  basePath?: string
  sectionHash?: string
}) {
  const [meetingList, setMeetingList] = useState(meetings)
  const [activeMeetingId, setActiveMeetingId] = useState(selectedMeetingId ?? '')
  const [question, setQuestion] = useState(initialQuestion || 'create a summary')
  const [submittedQuestion, setSubmittedQuestion] = useState(initialQuestion ?? '')
  const [answer, setAnswer] = useState(initialAnswer)
  const [results, setResults] = useState<SearchResult[]>(initialResults)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'revealing'>('idle')
  const [hasAutoRun, setHasAutoRun] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  const activeMeeting = useMemo(
    () => meetingList.find((meeting) => meeting.id === activeMeetingId) ?? null,
    [activeMeetingId, meetingList],
  )
  const bubbleLabels = useMemo(() => bubbleLabelsForMeeting(activeMeeting), [activeMeeting])
  const isThinking = phase !== 'idle'

  function updateSearchUrl(meetingId?: string, nextQuestion?: string) {
    window.history.pushState(
      null,
      '',
      buildSearchHref(basePath, meetingId, nextQuestion, sectionHash),
    )
  }

  async function ask(prompt?: string) {
    const nextQuestion = (prompt ?? question).trim()

    if (!activeMeeting || !nextQuestion || isThinking) {
      if (!activeMeeting) {
        setError('Select a recent meeting first, then ask the AI.')
      }
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller
    setQuestion(nextQuestion)
    setSubmittedQuestion(nextQuestion)
    setAnswer('')
    setResults([])
    setError('')
    setPhase('thinking')

    try {
      const responsePromise = fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          meetingId: activeMeeting.id,
          question: nextQuestion,
        }),
      })

      const [response] = await Promise.all([responsePromise, sleep(2400)])
      const data = (await response.json()) as SearchResponse

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'AI request failed')
      }

      setPhase('revealing')
      await sleep(420)
      setAnswer(data.answer || 'No answer returned.')
      setResults(data.results || [])
      updateSearchUrl(activeMeeting.id, nextQuestion)
    } catch (requestError) {
      if (controller.signal.aborted) return
      setError(requestError instanceof Error ? requestError.message : 'AI request failed.')
    } finally {
      if (!controller.signal.aborted) {
        setPhase('idle')
      }
    }
  }

  function selectMeeting(meetingId: string) {
    if (isThinking) return

    if (meetingId === activeMeetingId) return

    setActiveMeetingId(meetingId)
    setAnswer('')
    setResults([])
    setSubmittedQuestion('')
    updateSearchUrl(meetingId)
  }

  function clearMeetingSelection() {
    if (isThinking) return

    setActiveMeetingId('')
    setQuestion('create a summary')
    setAnswer('')
    setResults([])
    setError('')
    setSubmittedQuestion('')
    updateSearchUrl()
  }

  function toggleMeeting(meetingId: string) {
    if (meetingId === activeMeetingId) {
      clearMeetingSelection()
      return
    }

    selectMeeting(meetingId)
  }

  function stopThinking() {
    controllerRef.current?.abort()
    setPhase('idle')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void ask()
  }

  function handleRecordedMeeting(meeting: Meeting) {
    setMeetingList((current) => [
      meeting,
      ...current.filter((item) => item.id !== meeting.id),
    ])
    setActiveMeetingId(meeting.id)
    setAnswer('')
    setResults([])
    setSubmittedQuestion('')
    updateSearchUrl(meeting.id)
  }

  useEffect(() => {
    if (!initialQuestion || initialAnswer || !activeMeeting || hasAutoRun) return
    setHasAutoRun(true)
    void ask(initialQuestion)
  }, [activeMeeting, hasAutoRun, initialAnswer, initialQuestion])

  return (
    <>
      {isThinking && (
        <MemoryBubbleCluster
          question={submittedQuestion || question}
          labels={bubbleLabels}
          phase={phase}
          onStop={stopThinking}
        />
      )}

      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <GlassPanel className="flex flex-col gap-4 p-5">
          <VoiceMeetingRecorder onMeetingSaved={handleRecordedMeeting} />

          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Recent meetings
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Click a card to select it. Click it again to unselect.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {meetingList.map((meeting) => {
              const selected = meeting.id === activeMeetingId
              return (
                <article
                  key={meeting.id}
                  aria-pressed={selected}
                  className={cn(
                    'group rounded-2xl border p-4 text-left transition-all duration-300 focus-within:ring-2 focus-within:ring-primary',
                    selected
                      ? 'border-primary/70 bg-[radial-gradient(circle_at_top_right,rgba(47,123,255,0.22),transparent_42%),rgba(47,123,255,0.10)] shadow-[0_0_36px_rgba(47,123,255,0.30)]'
                      : 'border-glass-border bg-glass opacity-55 grayscale hover:-translate-y-1 hover:border-primary/50 hover:bg-[radial-gradient(circle_at_top_right,rgba(47,123,255,0.16),transparent_40%),rgba(47,123,255,0.07)] hover:opacity-100 hover:grayscale-0 hover:shadow-[0_0_30px_rgba(47,123,255,0.20)]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleMeeting(meeting.id)}
                    className="block w-full text-left focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground">
                          {meeting.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(meeting.created_at)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition',
                          selected
                            ? 'border-primary/30 bg-primary/15 text-primary'
                            : 'border-glass-border bg-background/30 text-muted-foreground',
                        )}
                      >
                        {selected && <CheckCircle2 className="size-3.5" />}
                        {selected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {meeting.summary || 'No summary yet.'}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-primary">
                        <MessageSquareText className="size-3.5" />
                        {(meeting.segments?.length ?? 0)} transcript moments
                      </span>
                      <span className="font-medium text-muted-foreground transition group-hover:text-primary">
                        {selected ? 'Click to unselect' : 'Click to select'}
                      </span>
                    </div>
                  </button>

                  {selected && (
                    <button
                      type="button"
                      onClick={clearMeetingSelection}
                      disabled={isThinking}
                      className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-xl border border-pink/25 bg-pink/10 text-xs font-semibold text-pink transition hover:bg-pink/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Unselect meeting
                    </button>
                  )}

                  <details className="recent-transcript mt-3">
                    <summary>View full transcript</summary>
                    <div className="scroll-slim mt-3 max-h-72 overflow-y-auto pr-2">
                      {meeting.segments.map((segment) => (
                        <div
                          key={`${meeting.id}-${segment.timestamp}-${segment.speaker}-${segment.text}`}
                          className="recent-transcript-row"
                        >
                          <span>{segment.timestamp ?? '00:00'}</span>
                          <p>
                            <strong>{segment.speaker}:</strong> {segment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </article>
              )
            })}
          </div>
        </GlassPanel>

        <div className="flex flex-col gap-5">
          <GlassPanel
            neon={Boolean(activeMeeting)}
            className={cn(
              'flex flex-col gap-5 p-5 transition-all duration-300',
              !activeMeeting && 'opacity-55 grayscale',
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary">
                  Active meeting
                </p>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {activeMeeting ? activeMeeting.title : 'No meeting selected'}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeMeeting
                    ? 'AI chat is ready for this meeting.'
                    : 'Select a recent meeting to activate the AI chat.'}
                </p>
              </div>

              {activeMeeting && (
                <a
                  href={buildSearchHref(
                    basePath,
                    activeMeeting.id,
                    'create a summary',
                    sectionHash,
                  )}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                >
                  <Sparkles className="size-4" />
                  Summarize
                </a>
              )}
            </div>

            <form
              action={sectionHash ? `${basePath}#${sectionHash}` : basePath}
              method="GET"
              onSubmit={handleSubmit}
              className="glass-neon flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center"
            >
              {activeMeeting && (
                <input type="hidden" name="meetingId" value={activeMeeting.id} />
              )}
              <input
                name="q"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                disabled={!activeMeeting || isThinking}
                placeholder={
                  activeMeeting
                    ? 'Ask for a summary, decisions, owners, blockers...'
                    : 'Select a meeting first...'
                }
                className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!activeMeeting || isThinking}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_24px_rgba(47,123,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                Ask AI
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) =>
                activeMeeting ? (
                  <a
                    key={prompt}
                    href={buildSearchHref(basePath, activeMeeting.id, prompt, sectionHash)}
                    className="glass group rounded-full px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_18px_rgba(47,123,255,0.18)]"
                  >
                    <Sparkles className="mr-1.5 inline-block size-3.5 text-primary transition-transform group-hover:rotate-12" />
                    {prompt}
                  </a>
                ) : (
                  <span
                    key={prompt}
                    className="glass rounded-full px-4 py-2 text-sm text-muted-foreground opacity-45"
                  >
                    {prompt}
                  </span>
                ),
              )}
            </div>
          </GlassPanel>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {activeMeeting && isThinking ? (
            <GlassPanel neon className="relative min-h-[380px] overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-16 size-44 rounded-full bg-pink/10 blur-3xl" />
              <div className="relative flex h-full min-h-[330px] flex-col items-center justify-center text-center">
                <span className="grid size-16 place-items-center rounded-full border border-pink/25 bg-pink/10 text-pink shadow-[0_0_40px_rgba(255,77,157,0.18)]">
                  <Sparkles className="size-7 animate-pulse" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-foreground">
                  Building your answer
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Searching transcript moments and connecting meeting context.
                </p>
              </div>
            </GlassPanel>
          ) : activeMeeting && answer ? (
            <GlassPanel neon className="relative overflow-hidden p-6">
              <AIAnswerReveal answer={answer} results={results} meeting={activeMeeting} />
            </GlassPanel>
          ) : (
            <GlassPanel neon className="relative min-h-[380px] overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-16 size-44 rounded-full bg-pink/10 blur-3xl" />
              <div className="relative flex h-full min-h-[330px] flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-3xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_32px_rgba(47,123,255,0.16)]">
                  <WandSparkles className="size-6" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-foreground">
                  Ask a question to wake the memory engine
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  The answer will form from transcript moments, decisions, action
                  items, deadlines, and blockers.
                </p>
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </>
  )
}

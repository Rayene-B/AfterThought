export type Meeting = {
  id: string
  title: string
  date: string
  time: string
  participants: string[]
  duration: string
  topic: string
  status: 'analyzed' | 'processing'
  unread?: boolean
}

export const meetings: Meeting[] = [
  {
    id: 'q3-product-strategy',
    title: 'Q3 Product Strategy Sync',
    date: 'Jun 18, 2026',
    time: '10:00 AM',
    participants: ['Maya Chen', 'Devon Park', 'Lina Ortiz', 'Sam Reed'],
    duration: '52 min',
    topic: 'Roadmap',
    status: 'analyzed',
    unread: true,
  },
  {
    id: 'design-review',
    title: 'Liquid Glass Design Review',
    date: 'Jun 17, 2026',
    time: '2:30 PM',
    participants: ['Lina Ortiz', 'Theo Walsh', 'Maya Chen'],
    duration: '38 min',
    topic: 'Design',
    status: 'analyzed',
  },
  {
    id: 'eng-standup',
    title: 'Platform Engineering Standup',
    date: 'Jun 17, 2026',
    time: '9:15 AM',
    participants: ['Devon Park', 'Sam Reed', 'Priya Nair', 'Theo Walsh'],
    duration: '24 min',
    topic: 'Engineering',
    status: 'analyzed',
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery — Northwind',
    date: 'Jun 16, 2026',
    time: '11:00 AM',
    participants: ['Sam Reed', 'Priya Nair'],
    duration: '46 min',
    topic: 'Research',
    status: 'analyzed',
  },
  {
    id: 'gtm-planning',
    title: 'Go-To-Market Planning',
    date: 'Jun 15, 2026',
    time: '4:00 PM',
    participants: ['Maya Chen', 'Devon Park', 'Priya Nair', 'Lina Ortiz', 'Theo Walsh'],
    duration: '1h 08min',
    topic: 'Marketing',
    status: 'analyzed',
  },
  {
    id: 'weekly-leadership',
    title: 'Weekly Leadership Review',
    date: 'Jun 12, 2026',
    time: '8:30 AM',
    participants: ['Maya Chen', 'Devon Park'],
    duration: '41 min',
    topic: 'Leadership',
    status: 'processing',
  },
]

export type SummaryItem = {
  category: 'Decisions' | 'Deadlines' | 'Action Items' | 'Blockers' | 'Topics'
  items: string[]
}

export const meetingSummary: SummaryItem[] = [
  {
    category: 'Decisions',
    items: [
      'Adopt the Liquid Glass design language across all surfaces',
      'Ship the meeting memory engine in the Q3 beta cohort',
      'Keep pink strictly as a notification micro-accent',
    ],
  },
  {
    category: 'Deadlines',
    items: [
      'Design system handoff — Jun 24',
      'Beta invite emails — Jul 01',
      'Public launch readiness review — Jul 15',
    ],
  },
  {
    category: 'Action Items',
    items: [
      'Maya to finalize the roadmap one-pager',
      'Devon to spike on real-time transcript indexing',
      'Lina to deliver mind-map component specs',
    ],
  },
  {
    category: 'Blockers',
    items: [
      'Transcription latency above target on long calls',
      'Awaiting legal sign-off on data retention policy',
    ],
  },
  {
    category: 'Topics',
    items: [
      'Roadmap prioritization',
      'Search relevance',
      'Onboarding flow',
      'Pricing tiers',
    ],
  },
]

export type TranscriptLine = {
  id: string
  speaker: string
  initials: string
  timestamp: string
  text: string
  keywords?: string[]
}

export const transcript: TranscriptLine[] = [
  {
    id: 't1',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '00:42',
    text: 'Let us start with the roadmap. I think the meeting memory engine should anchor the Q3 beta.',
    keywords: ['roadmap', 'beta'],
  },
  {
    id: 't2',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '01:18',
    text: 'Agreed. The main blocker is transcription latency on longer calls — we need real-time indexing.',
    keywords: ['blocker', 'transcription latency', 'indexing'],
  },
  {
    id: 't3',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '02:05',
    text: 'On design, I will deliver the mind-map component specs by Friday so engineering can build in parallel.',
    keywords: ['design', 'mind-map'],
  },
  {
    id: 't4',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '03:27',
    text: 'Customer discovery suggests search relevance matters more than raw transcript length. People want answers.',
    keywords: ['search relevance', 'discovery'],
  },
  {
    id: 't5',
    speaker: 'Priya Nair',
    initials: 'PN',
    timestamp: '04:51',
    text: 'For pricing, a usage-based tier on top of a flat team plan tested best with the Northwind account.',
    keywords: ['pricing', 'tiers'],
  },
  {
    id: 't6',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '06:10',
    text: 'Great. Decision: we ship the beta in Q3 and keep the Liquid Glass aesthetic consistent everywhere.',
    keywords: ['decision', 'beta', 'Liquid Glass'],
  },
]

export type Insight = {
  title: string
  value: string
  detail: string
}

export const topTopics = [
  { label: 'Roadmap', weight: 92 },
  { label: 'Search relevance', weight: 78 },
  { label: 'Pricing', weight: 64 },
  { label: 'Onboarding', weight: 51 },
  { label: 'Latency', weight: 44 },
]

export const topKeywords = [
  { label: 'beta', size: 'xl' },
  { label: 'roadmap', size: 'lg' },
  { label: 'mind-map', size: 'md' },
  { label: 'pricing', size: 'lg' },
  { label: 'transcription', size: 'sm' },
  { label: 'search', size: 'xl' },
  { label: 'onboarding', size: 'md' },
  { label: 'retention', size: 'sm' },
  { label: 'Liquid Glass', size: 'lg' },
  { label: 'indexing', size: 'md' },
  { label: 'launch', size: 'sm' },
  { label: 'discovery', size: 'md' },
] as const

export const sentiment = { positive: 68, neutral: 24, negative: 8 }

export const decisionTimeline = [
  { date: 'Jun 18', title: 'Ship beta in Q3', meeting: 'Q3 Product Strategy Sync' },
  { date: 'Jun 17', title: 'Adopt Liquid Glass system', meeting: 'Design Review' },
  { date: 'Jun 16', title: 'Prioritize search relevance', meeting: 'Customer Discovery' },
  { date: 'Jun 15', title: 'Usage-based pricing tier', meeting: 'Go-To-Market Planning' },
]

export const peopleMentions = [
  { name: 'Maya Chen', initials: 'MC', mentions: 48 },
  { name: 'Devon Park', initials: 'DP', mentions: 39 },
  { name: 'Lina Ortiz', initials: 'LO', mentions: 31 },
  { name: 'Sam Reed', initials: 'SR', mentions: 27 },
  { name: 'Priya Nair', initials: 'PN', mentions: 22 },
]

export const examplePrompts = [
  'What did we decide about pricing?',
  'List every action item assigned to Devon',
  'Summarize blockers across last week',
  'When is the beta launching?',
]

export const topicFrequency = [
  { week: 'W1', Roadmap: 12, Pricing: 6, Search: 9 },
  { week: 'W2', Roadmap: 18, Pricing: 11, Search: 14 },
  { week: 'W3', Roadmap: 15, Pricing: 9, Search: 21 },
  { week: 'W4', Roadmap: 22, Pricing: 16, Search: 19 },
]

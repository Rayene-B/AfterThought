export type FakeMeeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  duration: string;
  topic: string;
  status: 'analyzed' | 'processing';
  unread?: boolean;
};

export type FakeTranscriptLine = {
  id: string;
  speaker: string;
  initials: string;
  timestamp: string;
  text: string;
  keywords: string[];
};

export type FakeSummaryItem = {
  category: 'Decisions' | 'Deadlines' | 'Action Items' | 'Blockers' | 'Topics';
  description: string;
  items: string[];
};

export type FakeInsight = {
  id: string;
  title: string;
  body: string;
  confidence: 'High' | 'Medium' | 'Low';
};


export const fakeMeetings: FakeMeeting[] = [
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
];

export const fakeTranscript: FakeTranscriptLine[] = [
  {
    id: 't1',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '00:05',
    text: 'Good morning everyone. Let us dive into the Q3 product strategy. We need to align on the core beta scope.',
    keywords: ['Q3', 'strategy', 'beta scope'],
  },
  {
    id: 't2',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '00:45',
    text: 'Right now, the largest bottleneck is the latency in transcribing long calls. Users are waiting too long.',
    keywords: ['bottleneck', 'latency', 'transcribing'],
  },
  {
    id: 't3',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '01:20',
    text: 'I have finalized the layout guidelines for the Liquid Glass visual theme. It uses frosted surfaces.',
    keywords: ['Liquid Glass', 'layout', 'frosted'],
  },
  {
    id: 't4',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '02:05',
    text: 'Our research with the Northwind account shows they value search precision above raw transcript length.',
    keywords: ['research', 'Northwind', 'search precision'],
  },
  {
    id: 't5',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '02:40',
    text: 'Exactly, search relevance is key. Let us make sure search queries hit both transcript dialogue and category lists.',
    keywords: ['search relevance', 'queries', 'dialogue'],
  },
  {
    id: 't6',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '03:15',
    text: 'For the Chrome Extension, we can capture audio directly from the active tab and stream WebM chunks to the API.',
    keywords: ['Chrome Extension', 'active tab', 'WebM', 'API'],
  },
  {
    id: 't7',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '04:00',
    text: 'I can provide the mind-map specs. The branches will correspond to decisions, blockers, and timelines.',
    keywords: ['mind-map', 'decisions', 'blockers'],
  },
  {
    id: 't8',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '04:35',
    text: 'That would be perfect. We can visualize the relations dynamically. What about the desktop companion?',
    keywords: ['visualize', 'companion', 'desktop'],
  },
  {
    id: 't9',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '05:10',
    text: 'The Electron app will run as a tiny draggable bubble. Clicking it opens a live feed panel with action items.',
    keywords: ['Electron', 'draggable bubble', 'live feed', 'action items'],
  },
  {
    id: 't10',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '05:55',
    text: 'Awesome. On the design side, make sure we keep pink exclusively for micro-dot indicators. No big pink sections.',
    keywords: ['design', 'pink', 'indicators'],
  },
  {
    id: 't11',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '06:30',
    text: 'Agreed, it is a great micro-accent. The rest of the scheme should be charcoal, slate, and silver with neon blue lines.',
    keywords: ['micro-accent', 'charcoal', 'slate', 'neon blue'],
  },
  {
    id: 't12',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '07:10',
    text: 'I will start preparing the GTM strategy based on the pricing tier feedback we got. The flat rate tested well.',
    keywords: ['GTM', 'pricing tier', 'flat rate'],
  },
  {
    id: 't13',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '07:55',
    text: 'Great. Let us lock the Q3 beta cohort launch date. Let us target July 15 for the public readiness review.',
    keywords: ['Q3 beta', 'launch', 'readiness review'],
  },
  {
    id: 't14',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '08:35',
    text: 'To hit that, I need the indexing server completed by June 28. Lina, can you hand off designs by the 24th?',
    keywords: ['indexing server', 'designs', 'handoff'],
  },
  {
    id: 't15',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '09:05',
    text: 'Yes, June 24 is locked. I will deliver the figma tokens and mind-map layout components by then.',
    keywords: ['figma tokens', 'mind-map'],
  },
  {
    id: 't16',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '09:40',
    text: 'I will set up the landing page copy. We should highlight the multi-surface sync—web, extension, and desktop.',
    keywords: ['landing page', 'multi-surface sync'],
  },
  {
    id: 't17',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '10:20',
    text: 'That will be a huge selling point. The ability to record in-browser and see it instantly on desktop is amazing.',
    keywords: ['selling point', 'record', 'desktop'],
  },
  {
    id: 't18',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '10:55',
    text: 'I will verify the security profiles on local storage to make sure our transcripts stay secure.',
    keywords: ['security', 'local storage', 'secure'],
  },
  {
    id: 't19',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '11:30',
    text: 'Should we add some micro-animations when transition panels open? It makes the liquid glass feel responsive.',
    keywords: ['micro-animations', 'transition panels', 'liquid glass'],
  },
  {
    id: 't20',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '12:15',
    text: 'Yes, subtle hover scale effects and linear gradient glows will make it feel premium.',
    keywords: ['hover scale', 'gradient glows', 'premium'],
  },
  {
    id: 't21',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '12:50',
    text: 'We should verify performance on lower-end devices. Frosted blur filters can sometimes drag frame rates.',
    keywords: ['performance', 'blur filters', 'frame rates'],
  },
  {
    id: 't22',
    speaker: 'Devon Park',
    initials: 'DP',
    timestamp: '13:25',
    text: 'Good call. I will benchmark the CPU rendering on the desktop widget during drag operations.',
    keywords: ['benchmark', 'CPU rendering', 'desktop widget'],
  },
  {
    id: 't23',
    speaker: 'Maya Chen',
    initials: 'MC',
    timestamp: '14:00',
    text: 'Perfect. Sounds like we have solid milestones. Let us reconvene next Tuesday for status updates.',
    keywords: ['milestones', 'status updates'],
  },
  {
    id: 't24',
    speaker: 'Lina Ortiz',
    initials: 'LO',
    timestamp: '14:35',
    text: 'Sounds good. I will have the design review templates ready.',
    keywords: ['design review', 'templates'],
  },
  {
    id: 't25',
    speaker: 'Sam Reed',
    initials: 'SR',
    timestamp: '15:10',
    text: 'I will share GTM drafts by email tonight. Bye everyone!',
    keywords: ['GTM drafts', 'email'],
  },
];

export const fakeSummaries: FakeSummaryItem[] = [
  {
    category: 'Decisions',
    description: 'Resolved and agreed by the room',
    items: [
      'Adopt the Liquid Glass design language across all surfaces',
      'Ship the meeting memory engine in the Q3 beta cohort',
      'Keep pink strictly as a notification micro-accent',
    ],
  },
  {
    category: 'Deadlines',
    description: 'Dates committed during the call',
    items: [
      'Design system handoff — Jun 24',
      'Beta invite emails — Jul 01',
      'Public launch readiness review — Jul 15',
    ],
  },
  {
    category: 'Action Items',
    description: 'Owned tasks to follow up on',
    items: [
      'Maya to finalize the roadmap one-pager',
      'Devon to spike on real-time transcript indexing',
      'Lina to deliver mind-map component specs',
    ],
  },
  {
    category: 'Blockers',
    description: 'Risks that need attention',
    items: [
      'Transcription latency above target on long calls',
      'Awaiting legal sign-off on data retention policy',
    ],
  },
  {
    category: 'Topics',
    description: 'Themes discussed across the session',
    items: [
      'Roadmap prioritization',
      'Search relevance',
      'Onboarding flow',
      'Pricing tiers',
    ],
  },
];

export const fakeInsights: FakeInsight[] = [
  {
    id: 'i1',
    title: 'Search relevance is the primary customer concern',
    body: 'Customers repeatedly ask for faster, clearer answers instead of longer transcripts.',
    confidence: 'High',
  },
  {
    id: 'i2',
    title: 'Latency is the main operational blocker',
    body: 'The team agreed that backend speed is the current bottleneck for scale.',
    confidence: 'Medium',
  },
];

export type FakeMindMapNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  dir: 'left' | 'right';
  ping?: boolean;
  children: string[];
};

export const fakeMindMapNodes: FakeMindMapNode[] = [
  {
    id: 'decisions',
    label: 'Decisions',
    x: 22,
    y: 22,
    dir: 'left',
    children: ['Ship Q3 beta', 'Adopt Liquid Glass'],
  },
  {
    id: 'deadlines',
    label: 'Deadlines',
    x: 78,
    y: 20,
    dir: 'right',
    children: ['Handoff Jun 24', 'Launch Jul 15'],
  },
  {
    id: 'topics',
    label: 'Topics',
    x: 86,
    y: 56,
    dir: 'right',
    children: ['Roadmap', 'Search relevance', 'Pricing'],
  },
  {
    id: 'blockers',
    label: 'Blockers',
    x: 70,
    y: 86,
    dir: 'right',
    ping: true,
    children: ['Transcription latency', 'Legal sign-off'],
  },
  {
    id: 'people',
    label: 'People',
    x: 20,
    y: 72,
    dir: 'left',
    children: ['Maya', 'Devon', 'Lina', 'Sam'],
  },
];

export const fakeTopTopics = [
  { label: 'Roadmap', weight: 95 },
  { label: 'Search relevance', weight: 88 },
  { label: 'Latency', weight: 72 },
  { label: 'Liquid Glass', weight: 64 },
  { label: 'Chrome Extension', weight: 55 },
];

export const fakeTopKeywords = [
  { label: 'beta', size: 'xl' },
  { label: 'roadmap', size: 'lg' },
  { label: 'mind-map', size: 'md' },
  { label: 'pricing', size: 'lg' },
  { label: 'transcription', size: 'sm' },
  { label: 'search', size: 'xl' },
  { label: 'onboarding', size: 'md' },
  { label: 'Liquid Glass', size: 'lg' },
  { label: 'indexing', size: 'md' },
  { label: 'latency', size: 'xl' },
  { label: 'draggable', size: 'sm' },
  { label: 'bubble', size: 'md' },
] as const;

export const fakeSentiment = { positive: 70, neutral: 22, negative: 8 };

export const fakePeopleMentions = [
  { name: 'Maya Chen', initials: 'MC', mentions: 48 },
  { name: 'Devon Park', initials: 'DP', mentions: 39 },
  { name: 'Lina Ortiz', initials: 'LO', mentions: 31 },
  { name: 'Sam Reed', initials: 'SR', mentions: 27 },
];

export const fakeDecisionTimeline = [
  { date: 'Jun 18', title: 'Ship beta in Q3', meeting: 'Q3 Product Strategy Sync' },
  { date: 'Jun 17', title: 'Adopt Liquid Glass system', meeting: 'Design Review' },
  { date: 'Jun 16', title: 'Prioritize search relevance', meeting: 'Customer Discovery' },
];

export const fakeTopicFrequency = [
  { week: 'W1', Roadmap: 12, Pricing: 6, Search: 9 },
  { week: 'W2', Roadmap: 18, Pricing: 11, Search: 14 },
  { week: 'W3', Roadmap: 15, Pricing: 9, Search: 21 },
  { week: 'W4', Roadmap: 22, Pricing: 16, Search: 19 },
];


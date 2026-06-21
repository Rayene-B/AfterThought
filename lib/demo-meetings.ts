import type { Meeting } from './data'

export type DemoMeetingSegment = {
  speaker: string
  text: string
  timestamp?: string
}

export type DemoMeeting = Omit<Meeting, 'segments'> & {
  segments: DemoMeetingSegment[]
}

export const demoMeetings: DemoMeeting[] = [
  {
    id: 'demo-api-redesign',
    title: 'Demo Meeting: API Redesign Sync',
    summary:
      'The team reviewed API latency, agreed to redesign the response payload, and set clear ownership for the frontend integration. Ben owns the API redesign before Friday, Carla owns the frontend integration, and analytics tracking requirements remain the main blocker.',
    action_items: [
      'Ben to redesign the API response and remove duplicate fields before Friday',
      'Carla to update the frontend integration by Friday',
      'Analytics team to confirm required tracking fields by Wednesday',
    ],
    segments: [
      {
        speaker: 'Alice',
        timestamp: '00:05',
        text: 'Morning everyone, thanks for joining. I want to focus this sync on the API redesign because the mobile dashboard is still feeling slow for customers.',
      },
      {
        speaker: 'Ben',
        timestamp: '00:28',
        text: 'Morning. I checked the logs before this call, and the slowest path is the account history endpoint. We are sending too many duplicate fields in the response.',
      },
      {
        speaker: 'Carla',
        timestamp: '00:52',
        text: 'That matches what I am seeing on the frontend. The dashboard waits for the whole response before rendering, so large account histories make the page feel frozen.',
      },
      {
        speaker: 'Alice',
        timestamp: '01:18',
        text: 'So the problem is clear: the API is too slow for mobile users, especially when dashboards load large account histories.',
      },
      {
        speaker: 'Ben',
        timestamp: '01:45',
        text: 'My recommendation is to redesign the response payload, remove duplicate fields, and separate summary data from detailed transaction history.',
      },
      {
        speaker: 'Ben',
        timestamp: '02:12',
        text: 'I can own the API redesign. I will redesign the API response and remove duplicate fields before Friday.',
      },
      {
        speaker: 'Alice',
        timestamp: '02:34',
        text: 'That sounds good. Decision made: we will redesign the API response payload instead of trying to optimize the current shape.',
      },
      {
        speaker: 'Carla',
        timestamp: '03:01',
        text: 'Once Ben gives me the new schema, I can update the frontend integration and make sure the dashboard renders progressively.',
      },
      {
        speaker: 'Alice',
        timestamp: '03:24',
        text: 'Carla, can you update the frontend integration by Friday once Ben gives you the schema?',
      },
      {
        speaker: 'Carla',
        timestamp: '03:45',
        text: 'Yes, but I need the final response schema by Wednesday so I can finish safely and avoid reworking the UI twice.',
      },
      {
        speaker: 'Ben',
        timestamp: '04:18',
        text: 'The main blocker is analytics. They have not confirmed which tracking fields are required in the new response.',
      },
      {
        speaker: 'Alice',
        timestamp: '04:44',
        text: 'I will follow up with analytics today and ask them to confirm the required tracking fields by Wednesday.',
      },
      {
        speaker: 'Carla',
        timestamp: '05:09',
        text: 'If we get that confirmation on Wednesday, I am comfortable having the frontend integration ready by Friday.',
      },
      {
        speaker: 'Alice',
        timestamp: '05:36',
        text: 'Great. We agreed to deploy the new version next Tuesday if the integration tests pass. Thanks everyone, that gives us a clear plan.',
      },
    ],
    created_at: '2026-06-21T09:00:00.000Z',
  },
]

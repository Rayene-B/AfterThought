import { NextResponse } from 'next/server'
import {
  fakeInsights,
  fakeTranscript,
  fakeTopTopics,
  fakeTopKeywords,
  fakeSentiment,
  fakePeopleMentions,
  fakeDecisionTimeline,
  fakeTopicFrequency,
} from '@/lib/fakeData'

export async function GET() {
  return NextResponse.json({
    ok: true,
    insights: fakeInsights,
    transcript: fakeTranscript,
    topTopics: fakeTopTopics,
    topKeywords: fakeTopKeywords,
    sentiment: fakeSentiment,
    peopleMentions: fakePeopleMentions,
    decisionTimeline: fakeDecisionTimeline,
    topicFrequency: fakeTopicFrequency,
  })
}

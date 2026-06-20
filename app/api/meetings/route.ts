import { NextResponse } from 'next/server'
import { fakeMeetings } from '@/lib/fakeData'

export async function GET() {
  return NextResponse.json({
    ok: true,
    meetings: fakeMeetings,
  })
}

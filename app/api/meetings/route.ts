import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { addLocalMeeting, mergeMeetings, normalizeMeeting } from "@/lib/meeting-store"

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, meetings: mergeMeetings() })
  }

  try {
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch meetings:", error)
      return NextResponse.json({ ok: true, meetings: mergeMeetings() })
    }

    return NextResponse.json({ ok: true, meetings: mergeMeetings(data ?? []) })
  } catch (error) {
    console.error("Meeting fallback activated:", error)
    return NextResponse.json({ ok: true, meetings: mergeMeetings() })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const meeting = normalizeMeeting({
      ...body,
      id: body.id || crypto.randomUUID(),
      title: body.title || 'Recorded Meeting',
      created_at: body.created_at || new Date().toISOString(),
    })

    addLocalMeeting(meeting)

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = supabaseAdmin()
        await supabase.from("meetings").upsert({
          id: meeting.id,
          title: meeting.title,
          summary: meeting.summary,
          action_items: meeting.action_items,
          segments: meeting.segments,
          created_at: meeting.created_at,
        })
      } catch (error) {
        console.error("Saved locally; Supabase save failed:", error)
      }
    }

    return NextResponse.json({ ok: true, meeting })
  } catch (error) {
    console.error("Create meeting failed:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to create meeting" },
      { status: 500 },
    )
  }
}

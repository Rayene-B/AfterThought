import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { findMeeting } from "@/lib/meeting-store"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const meeting = findMeeting(id)
    return meeting
      ? NextResponse.json({ ok: true, ...meeting })
      : NextResponse.json({ ok: false, error: "Meeting not found" }, { status: 404 })
  }

  try {
    const supabase = supabaseAdmin()

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      const meeting = findMeeting(id)
      return meeting
        ? NextResponse.json({ ok: true, ...meeting })
        : NextResponse.json({ ok: false, error: "Meeting not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true, ...data })
  } catch (error) {
    console.error("Meeting detail fallback activated:", error)
    const meeting = findMeeting(id)
    return meeting
      ? NextResponse.json({ ok: true, ...meeting })
      : NextResponse.json({ ok: false, error: "Meeting not found" }, { status: 404 })
  }
}

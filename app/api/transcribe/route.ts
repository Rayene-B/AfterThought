import { NextResponse } from 'next/server'
import { fakeTranscript } from '@/lib/fakeData'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      const body = await request.json()
      console.log('Received JSON transcription text from desktop companion:', body)
      return NextResponse.json({
        ok: true,
        message: 'Transcription segment appended.',
        transcript: body.text || 'No text received',
      })
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const audioFile = formData.get('audio')
      console.log('Received audio file from extension:', audioFile ? 'file present' : 'no file')
      return NextResponse.json({
        ok: true,
        message: 'Audio received and transcribed successfully.',
        transcript: fakeTranscript.map((line) => `${line.speaker}: ${line.text}`).join('\n'),
        segments: fakeTranscript,
      })
    }

    return NextResponse.json({
      ok: true,
      message: 'Request received.',
      transcript: 'No specific format processed.',
    })
  } catch (error: any) {
    console.error('Error in transcribe route:', error)
    return NextResponse.json({
      ok: false,
      error: error.message,
    }, { status: 500 })
  }
}

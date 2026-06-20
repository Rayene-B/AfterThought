import React, { useEffect, useState } from 'react';

type TranscriptLine = {
  id: string;
  speaker: string;
  text: string;
};

const fallbackTranscript: TranscriptLine[] = [
  { id: '1', speaker: 'Maya Chen', text: 'Let us lock the beta scope before Friday.' },
  { id: '2', speaker: 'Devon Park', text: 'I will own real-time indexing this sprint.' },
  { id: '3', speaker: 'Lina Ortiz', text: 'Mind-map specs are ready for review.' },
];

export function LiveTranscriptFeed() {
  const [transcript, setTranscript] = useState<TranscriptLine[]>(fallbackTranscript);

  useEffect(() => {
    async function fetchLiveTranscript() {
      try {
        const res = await fetch('http://localhost:3000/api/insights');
        const data = await res.json();
        if (data.ok && data.transcript) {
          // Take the last few transcript lines
          setTranscript(data.transcript.slice(-4));
        }
      } catch (err) {
        console.warn('Could not connect to transcribe API, using fallback data:', err);
      }
    }

    fetchLiveTranscript();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchLiveTranscript, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'oklch(0.72 0.16 248)',
        fontWeight: 600,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        Live Transcript Feed
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'oklch(0.68 0.23 354)', // pink accent
          animation: 'pulse 1.5s infinite'
        }} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 180,
        overflowY: 'auto',
        paddingRight: 4
      }}>
        {transcript.map((line) => (
          <div key={line.id} style={{ fontSize: 13, color: 'rgba(238, 242, 255, 0.85)', lineHeight: 1.4 }}>
            <strong style={{ color: '#fff' }}>{line.speaker}:</strong> {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { LiveTranscriptFeed } from './LiveTranscriptFeed';
import { ActionItemsList } from './ActionItemsList';

export function ExpandedAssistantPanel({ onClose }: { onClose: () => void }) {
  return (
    <section
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(17, 20, 31, 0.9)',
        backdropFilter: 'blur(20px) saturate(140%)',
        border: '1px solid rgba(186, 203, 255, 0.15)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(109, 93, 252, 0.15)',
        color: '#eef2ff',
        borderRadius: 18,
        padding: 20,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'oklch(0.72 0.16 248)' // neon blue
          }} />
          <strong style={{ fontSize: 14, letterSpacing: '0.02em' }}>AfterThought Assistant</strong>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
            padding: 4,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        >
          ✕
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <LiveTranscriptFeed />
        <ActionItemsList />
      </div>
    </section>
  );
}

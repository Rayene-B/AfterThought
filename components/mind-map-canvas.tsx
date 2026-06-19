'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  CalendarClock,
  Hash,
  AlertTriangle,
  Users,
  Brain,
  type LucideIcon,
} from 'lucide-react'
import { MindMapNode } from '@/components/mind-map-node'

type Branch = {
  id: string
  label: string
  icon: LucideIcon
  x: number
  y: number
  dir: 'left' | 'right'
  ping?: boolean
  children: string[]
}

const branches: Branch[] = [
  {
    id: 'decisions',
    label: 'Decisions',
    icon: CheckCircle2,
    x: 22,
    y: 22,
    dir: 'left',
    children: ['Ship Q3 beta', 'Adopt Liquid Glass'],
  },
  {
    id: 'deadlines',
    label: 'Deadlines',
    icon: CalendarClock,
    x: 78,
    y: 20,
    dir: 'right',
    children: ['Handoff Jun 24', 'Launch Jul 15'],
  },
  {
    id: 'topics',
    label: 'Topics',
    icon: Hash,
    x: 86,
    y: 56,
    dir: 'right',
    children: ['Roadmap', 'Search relevance', 'Pricing'],
  },
  {
    id: 'blockers',
    label: 'Blockers',
    icon: AlertTriangle,
    x: 70,
    y: 86,
    dir: 'right',
    ping: true,
    children: ['Transcription latency', 'Legal sign-off'],
  },
  {
    id: 'people',
    label: 'People',
    icon: Users,
    x: 20,
    y: 72,
    dir: 'left',
    children: ['Maya', 'Devon', 'Lina', 'Sam'],
  },
]

const center = { x: 50, y: 50 }

export function MindMapCanvas() {
  const [expanded, setExpanded] = useState<string | null>('topics')

  return (
    <div className="glass relative h-[460px] w-full overflow-hidden rounded-2xl sm:h-[520px]">
      {/* Curved neon connectors */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="mm-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.16 248)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 248)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {branches.map((b) => {
          const cx = (center.x + b.x) / 2
          const cy = (center.y + b.y) / 2 - 8
          return (
            <path
              key={b.id}
              d={`M ${center.x} ${center.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
              fill="none"
              stroke="url(#mm-line)"
              strokeWidth={expanded === b.id ? 1.6 : 1}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: 'drop-shadow(0 0 4px oklch(0.72 0.16 248 / 0.4))',
              }}
            />
          )
        })}
      </svg>

      {/* Center node */}
      <MindMapNode
        label="Meeting Summary"
        icon={Brain}
        variant="center"
        style={{ left: `${center.x}%`, top: `${center.y}%` }}
      />

      {/* Branch nodes + leaves */}
      {branches.map((b) => {
        const open = expanded === b.id
        return (
          <div key={b.id}>
            <MindMapNode
              label={b.label}
              icon={b.icon}
              variant="branch"
              active={open}
              hasPing={b.ping}
              onClick={() => setExpanded(open ? null : b.id)}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            />
            {open &&
              b.children.map((child, i) => {
                const offsetY = b.y + (i - (b.children.length - 1) / 2) * 11
                const offsetX =
                  b.dir === 'right'
                    ? Math.min(b.x + 16, 95)
                    : Math.max(b.x - 16, 5)
                return (
                  <MindMapNode
                    key={child}
                    label={child}
                    variant="leaf"
                    style={{
                      left: `${offsetX}%`,
                      top: `${offsetY}%`,
                      animation: 'fade-in 0.3s ease both',
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                )
              })}
          </div>
        )
      })}

      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        Click a branch to expand sub-nodes
      </p>
    </div>
  )
}

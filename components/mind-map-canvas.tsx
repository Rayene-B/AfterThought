'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  CalendarClock,
  Hash,
  AlertTriangle,
  Users,
  Brain,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { MindMapNode } from '@/components/mind-map-node'

type Branch = {
  id: string
  label: string
  x: number
  y: number
  dir: 'left' | 'right'
  ping?: boolean
  children: string[]
}

const iconMap: Record<string, LucideIcon> = {
  decisions: CheckCircle2,
  deadlines: CalendarClock,
  topics: Hash,
  blockers: AlertTriangle,
  people: Users,
}

const center = { x: 50, y: 50 }

export function MindMapCanvas() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [expanded, setExpanded] = useState<string | null>('topics')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMindMap() {
      try {
        const res = await fetch('/api/mindmap')
        const data = await res.json()
        if (data.ok && data.nodes) {
          setBranches(data.nodes)
        }
      } catch (err) {
        console.error('Failed to load mindmap nodes', err)
      } finally {
        setLoading(false)
      }
    }
    loadMindMap()
  }, [])

  return (
    <div className="glass relative h-[460px] w-full overflow-hidden rounded-2xl sm:h-[520px]">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
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
            const IconComponent = iconMap[b.id] || Hash
            return (
              <div key={b.id}>
                <MindMapNode
                  label={b.label}
                  icon={IconComponent}
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
        </>
      )}
    </div>
  )
}

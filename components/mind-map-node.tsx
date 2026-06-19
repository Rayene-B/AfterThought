'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MindMapNode({
  label,
  icon: Icon,
  variant = 'branch',
  active = false,
  hasPing = false,
  onClick,
  style,
}: {
  label: string
  icon?: LucideIcon
  variant?: 'center' | 'branch' | 'leaf'
  active?: boolean
  hasPing?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}) {
  const interactive = variant !== 'leaf'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      style={style}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap rounded-full font-medium transition-all duration-300',
        interactive && 'cursor-pointer hover:scale-105',
        variant === 'center' &&
          'glass-neon neon-glow z-20 px-5 py-3 font-heading text-sm font-semibold text-foreground',
        variant === 'branch' &&
          'glass z-10 flex items-center gap-2 px-3.5 py-2 text-sm text-foreground',
        variant === 'branch' && active && 'border-primary/50 neon-glow',
        variant === 'leaf' &&
          'glass z-10 px-3 py-1.5 text-xs text-muted-foreground',
      )}
    >
      {Icon && variant !== 'leaf' && <Icon className="size-4 text-primary" />}
      {label}
      {hasPing && (
        <span className="ml-0.5 size-1.5 rounded-full bg-pink" aria-hidden />
      )}
    </button>
  )
}

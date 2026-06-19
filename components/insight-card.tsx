import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InsightCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('glass flex flex-col gap-4 rounded-2xl p-5', className)}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg border border-glass-border bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <h3 className="font-heading text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}

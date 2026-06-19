import { cn } from '@/lib/utils'

export function GlassPanel({
  className,
  neon = false,
  ...props
}: React.ComponentProps<'div'> & { neon?: boolean }) {
  return (
    <div
      className={cn(
        neon ? 'glass-neon' : 'glass',
        'rounded-2xl',
        className,
      )}
      {...props}
    />
  )
}

import type { TranscriptLine } from '@/lib/data'

function highlight(text: string, keywords?: string[]) {
  if (!keywords || keywords.length === 0) return text
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <mark
        key={i}
        className="rounded bg-primary/15 px-1 py-0.5 font-medium text-primary"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function TranscriptBlock({ line }: { line: TranscriptLine }) {
  return (
    <div
      id={`t-${line.id}`}
      className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-glass"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-glass-border bg-secondary text-[11px] font-semibold text-secondary-foreground">
        {line.initials}
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {line.speaker}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {line.timestamp}
          </span>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {highlight(line.text, line.keywords)}
        </p>
      </div>
    </div>
  )
}

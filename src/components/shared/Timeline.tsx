import { formatDateTime } from '@/lib/utils'
import type { TimelineEvent } from '@/types'

export function Timeline({
  events,
  assureView = false,
}: {
  events: TimelineEvent[]
  assureView?: boolean
}) {
  const visible = assureView ? events.filter((e) => e.visibleToAssure) : events

  return (
    <ol className="relative space-y-0 border-l border-border pl-6">
      {visible.map((event) => (
        <li key={event.id} className="relative pb-6 last:pb-0">
          <span className="absolute -left-[1.55rem] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
          <p className="text-xs text-muted-foreground">{formatDateTime(event.at)}</p>
          <p className="mt-0.5 font-medium">{event.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
        </li>
      ))}
    </ol>
  )
}

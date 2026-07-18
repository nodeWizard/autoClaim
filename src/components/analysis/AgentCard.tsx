import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { AgentDef, AgentStatus } from '@/types'

export function AgentCard({
  agent,
  status,
  progress,
  findings,
}: {
  agent: AgentDef
  status: AgentStatus
  progress: number
  findings: string[]
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border bg-card p-4 shadow-sm transition-shadow',
        status === 'running' && 'ring-2 ring-primary/30 shadow-md',
        status === 'done' && 'border-emerald-500/30'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{agent.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{agent.role}</p>
        </div>
        {status === 'running' ? (
          <Loader2 className="size-5 animate-spin text-primary" />
        ) : status === 'done' ? (
          <CheckCircle2 className="size-5 text-emerald-500" />
        ) : (
          <Circle className="size-5 text-muted-foreground/40" />
        )}
      </div>
      {(status === 'running' || status === 'done') && (
        <div className="mt-3">
          <Progress value={progress} />
        </div>
      )}
      {findings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {findings.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

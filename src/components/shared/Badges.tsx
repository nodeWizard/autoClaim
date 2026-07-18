import { cn } from '@/lib/utils'
import type { ClaimStatus, RiskLevel } from '@/types'
import { riskLabels, statusLabels } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<ClaimStatus, 'secondary' | 'default' | 'warning' | 'success' | 'danger'> = {
  recu: 'secondary',
  en_analyse: 'default',
  complement: 'warning',
  accepte: 'success',
  refuse: 'danger',
  fraude: 'danger',
}

const riskVariant: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
  faible: 'success',
  moyen: 'warning',
  eleve: 'danger',
  critique: 'danger',
}

export function StatusBadge({ status }: { status: ClaimStatus }) {
  return <Badge variant={statusVariant[status]}>{statusLabels[status]}</Badge>
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={riskVariant[level]}>{riskLabels[level]}</Badge>
}

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string
  value: string
  hint?: string
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border bg-card p-5 shadow-sm', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

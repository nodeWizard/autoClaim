import { motion } from 'framer-motion'
import { FileText, Fingerprint, Image, TrendingUp } from 'lucide-react'
import type { RiskLevel } from '@/types'
import { RiskBadge } from '@/components/shared/Badges'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatPercent } from '@/lib/utils'

export interface Evidence {
  id: string
  title: string
  description: string
  severity: RiskLevel
  confidence: number
  type: 'image' | 'document' | 'pattern' | 'financial'
}

const typeIcons = {
  image: Image,
  document: FileText,
  pattern: Fingerprint,
  financial: TrendingUp,
}

interface EvidenceCardProps {
  evidence: Evidence
  index?: number
}

export function EvidenceCard({ evidence, index = 0 }: EvidenceCardProps) {
  const Icon = typeIcons[evidence.type]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-medium">{evidence.title}</h4>
                <RiskBadge level={evidence.severity} />
              </div>
              <p className="text-xs text-muted-foreground">{evidence.description}</p>
              <p className={cn('mt-2 font-mono text-xs text-primary')}>
                Confiance : {formatPercent(evidence.confidence)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

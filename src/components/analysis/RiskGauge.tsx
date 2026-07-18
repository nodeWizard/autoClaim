import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RiskGaugeProps {
  score: number
  size?: number
  className?: string
}

export function RiskGauge({ score, size = 200, className }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = (size - 20) / 2
  const circumference = Math.PI * radius
  const progress = (clamped / 100) * circumference
  const color =
    clamped >= 80 ? '#ef4444' : clamped >= 60 ? '#f97316' : clamped >= 40 ? '#f59e0b' : '#10b981'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className={cn('relative inline-flex flex-col items-center', className)}
    >
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <motion.p
          className="font-mono text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color }}
        >
          {Math.round(clamped)}%
        </motion.p>
        <p className="mt-1 text-sm text-muted-foreground">Score de risque</p>
      </div>
    </motion.div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle2,
  FileSearch,
  UserCheck,
} from 'lucide-react'
import {
  notifications as initialNotifications,
  type AppNotification,
  type NotificationType,
} from '@/data/mock/notifications'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDateTime } from '@/lib/utils'

const typeConfig: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  ai_alert: { icon: Bot, color: 'text-sky-500 bg-sky-500/10', label: 'IA' },
  high_risk: {
    icon: AlertTriangle,
    color: 'text-orange-500 bg-orange-500/10',
    label: 'Risque',
  },
  analysis_complete: {
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10',
    label: 'Analyse',
  },
  new_claim: { icon: FileSearch, color: 'text-primary bg-primary/10', label: 'Nouveau' },
  assignment: { icon: UserCheck, color: 'text-primary bg-primary/10', label: 'Assignation' },
}

type Filter = 'all' | 'unread' | NotificationType

export function AssuranceNotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(initialNotifications)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = items.filter((n) => !n.read).length

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter === 'all') return true
      if (filter === 'unread') return !n.read
      return n.type === filter
    })
  }, [items, filter])

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const filters: Array<{ value: Filter; label: string }> = [
    { value: 'all', label: 'Toutes' },
    { value: 'unread', label: `Non lues (${unreadCount})` },
    { value: 'high_risk', label: 'Risque' },
    { value: 'ai_alert', label: 'IA' },
    { value: 'analysis_complete', label: 'Analyses' },
    { value: 'new_claim', label: 'Nouveaux' },
  ]

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Alertes IA, nouveaux dossiers et décisions."
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            Tout marquer comme lu
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((notif, i) => {
          const config = typeConfig[notif.type]
          const Icon = config.icon
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className={cn(
                  'transition-colors',
                  !notif.read && 'border-primary/30 bg-primary/5'
                )}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      config.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{notif.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(notif.at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notif.claimId && (
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/assurance/sinistres/${notif.claimId}`}>Voir</Link>
                      </Button>
                    )}
                    {!notif.read && (
                      <Button variant="ghost" size="sm" onClick={() => markRead(notif.id)}>
                        <Bell className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune notification pour ce filtre.
          </p>
        )}
      </div>
    </div>
  )
}

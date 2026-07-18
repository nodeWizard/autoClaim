import { PageHeader } from '@/components/layout/PageHeader'
import { formatDateTime } from '@/lib/utils'

const notifications = [
  {
    id: '1',
    title: 'Sinistre accepté',
    body: 'SIN-2026-0715-001 — indemnisation en cours.',
    at: '2026-07-15T14:07:00',
  },
  {
    id: '2',
    title: 'Complément demandé',
    body: 'SIN-2026-0715-002 — des éléments complémentaires sont nécessaires.',
    at: '2026-07-15T14:06:00',
  },
  {
    id: '3',
    title: 'Analyse en cours',
    body: 'Votre dossier est en cours d’analyse intelligente.',
    at: '2026-07-15T14:01:00',
  },
]

export function AssureNotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Mises à jour automatiques à chaque étape importante."
      />
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">{formatDateTime(n.at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

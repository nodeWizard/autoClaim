export type NotificationType =
  | 'ai_alert'
  | 'high_risk'
  | 'analysis_complete'
  | 'new_claim'
  | 'assignment'

export interface AppNotification {
  id: string
  title: string
  body: string
  at: string
  read: boolean
  type: NotificationType
  claimId?: string
}

export const notifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'high_risk',
    title: 'Alerte fraude critique',
    body: 'SIN-2026-0710-007 — score de risque 88 % — historique vol suspect',
    at: '2026-07-10T08:25:00',
    read: false,
    claimId: 'clm-5',
  },
  {
    id: 'notif-002',
    type: 'ai_alert',
    title: 'Incohérence de dates',
    body: 'SIN-2026-0715-002 — date déclarée ≠ constat / EXIF',
    at: '2026-07-15T14:04:00',
    read: false,
    claimId: 'clm-anomaly',
  },
  {
    id: 'notif-003',
    type: 'analysis_complete',
    title: 'Rapport prêt',
    body: 'SIN-2026-0715-001 — score 92/100, prêt pour décision',
    at: '2026-07-15T14:05:00',
    read: false,
    claimId: 'clm-happy',
  },
  {
    id: 'notif-004',
    type: 'new_claim',
    title: 'Nouveau sinistre',
    body: 'SIN-2026-0713-044 — Karim Jebali — bris de glace',
    at: '2026-07-13T16:45:00',
    read: true,
    claimId: 'clm-4',
  },
  {
    id: 'notif-005',
    type: 'assignment',
    title: 'Dossier assigné',
    body: 'SIN-2026-0714-018 vous a été assigné pour analyse',
    at: '2026-07-14T09:20:00',
    read: true,
    claimId: 'clm-3',
  },
  {
    id: 'notif-006',
    type: 'ai_alert',
    title: 'Agent Vision',
    body: 'Métadonnées EXIF analysées sur SIN-2026-0715-002',
    at: '2026-07-15T14:03:00',
    read: false,
    claimId: 'clm-anomaly',
  },
  {
    id: 'notif-007',
    type: 'analysis_complete',
    title: 'Analyse terminée',
    body: 'Chaîne multi-agents terminée pour SIN-2026-0715-001',
    at: '2026-07-15T14:05:30',
    read: true,
    claimId: 'clm-happy',
  },
  {
    id: 'notif-008',
    type: 'high_risk',
    title: 'Escalade anti-fraude',
    body: 'SIN-2026-0710-007 transféré à l’équipe fraude STAR',
    at: '2026-07-10T08:30:00',
    read: true,
    claimId: 'clm-5',
  },
]

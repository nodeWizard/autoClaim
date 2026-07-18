export interface AIActivityItem {
  id: string
  agent: string
  action: string
  claimId: string
  timestamp: string
  status: 'warning' | 'success' | 'info'
}

export interface AnalyticsData {
  fraudTrends: Array<{ name: string; value: number; detected: number; prevented: number }>
  fraudCategories: Array<{ name: string; value: number }>
  monthlyClaims: Array<{ name: string; value: number; approved: number; denied: number }>
  investigationTime: Array<{ name: string; value: number }>
  regionalHeatmap: Array<{ region: string; claims: number; fraudRate: number }>
  aiAccuracy: Array<{ name: string; value: number }>
  investigatorPerformance: Array<{
    name: string
    cases: number
    accuracy: number
    avgTime: number
  }>
  savedCosts: Array<{ name: string; value: number }>
}

export const aiActivity: AIActivityItem[] = [
  {
    id: 'act-1',
    agent: 'Agent Fraude',
    action: 'Incohérence de dates détectée',
    claimId: 'clm-anomaly',
    timestamp: '2026-07-15T14:04:00',
    status: 'warning',
  },
  {
    id: 'act-2',
    agent: 'Agent Vision',
    action: 'Métadonnées EXIF analysées',
    claimId: 'clm-anomaly',
    timestamp: '2026-07-15T14:03:00',
    status: 'warning',
  },
  {
    id: 'act-3',
    agent: 'Agent Rapport',
    action: 'Rapport généré — score 92/100',
    claimId: 'clm-happy',
    timestamp: '2026-07-15T14:05:00',
    status: 'success',
  },
  {
    id: 'act-4',
    agent: 'Agent Risque',
    action: 'Score de risque critique : 88 %',
    claimId: 'clm-5',
    timestamp: '2026-07-10T08:20:00',
    status: 'warning',
  },
  {
    id: 'act-5',
    agent: 'Agent OCR',
    action: 'Constat et facture extraits',
    claimId: 'clm-happy',
    timestamp: '2026-07-15T14:01:00',
    status: 'success',
  },
  {
    id: 'act-6',
    agent: 'Agent Contrat',
    action: 'Garantie collision confirmée',
    claimId: 'clm-3',
    timestamp: '2026-07-14T09:22:00',
    status: 'info',
  },
  {
    id: 'act-7',
    agent: 'Agent Vision',
    action: 'Dommages avant droit confirmés',
    claimId: 'clm-happy',
    timestamp: '2026-07-15T14:02:00',
    status: 'success',
  },
  {
    id: 'act-8',
    agent: 'Agent Fraude',
    action: 'Historique suspect — 2 vols en 18 mois',
    claimId: 'clm-5',
    timestamp: '2026-07-10T08:18:00',
    status: 'warning',
  },
]

export const analyticsData: AnalyticsData = {
  fraudTrends: [
    { name: 'Janv.', value: 8, detected: 5, prevented: 3 },
    { name: 'Fév.', value: 11, detected: 8, prevented: 4 },
    { name: 'Mars', value: 14, detected: 10, prevented: 6 },
    { name: 'Avr.', value: 10, detected: 7, prevented: 4 },
    { name: 'Mai', value: 16, detected: 12, prevented: 7 },
    { name: 'Juin', value: 13, detected: 10, prevented: 6 },
    { name: 'Juil.', value: 18, detected: 14, prevented: 9 },
  ],
  fraudCategories: [
    { name: 'Accidents simulés', value: 26 },
    { name: 'Réparations gonflées', value: 24 },
    { name: 'Faux vols', value: 18 },
    { name: 'Incohérences dates', value: 16 },
    { name: 'Photos réutilisées', value: 10 },
    { name: 'Autres', value: 6 },
  ],
  monthlyClaims: [
    { name: 'Janv.', value: 42, approved: 34, denied: 8 },
    { name: 'Fév.', value: 48, approved: 38, denied: 10 },
    { name: 'Mars', value: 45, approved: 36, denied: 9 },
    { name: 'Avr.', value: 52, approved: 41, denied: 11 },
    { name: 'Mai', value: 49, approved: 39, denied: 10 },
    { name: 'Juin', value: 55, approved: 43, denied: 12 },
    { name: 'Juil.', value: 58, approved: 45, denied: 13 },
  ],
  investigationTime: [
    { name: 'Janv.', value: 18 },
    { name: 'Fév.', value: 15 },
    { name: 'Mars', value: 12 },
    { name: 'Avr.', value: 10 },
    { name: 'Mai', value: 9 },
    { name: 'Juin', value: 8 },
    { name: 'Juil.', value: 7 },
  ],
  regionalHeatmap: [
    { region: 'Tunis', claims: 68, fraudRate: 14 },
    { region: 'Ariana', claims: 42, fraudRate: 18 },
    { region: 'Sousse', claims: 35, fraudRate: 12 },
    { region: 'Sfax', claims: 48, fraudRate: 22 },
    { region: 'Nabeul', claims: 28, fraudRate: 9 },
  ],
  aiAccuracy: [
    { name: 'Janv.', value: 88 },
    { name: 'Fév.', value: 89 },
    { name: 'Mars', value: 91 },
    { name: 'Avr.', value: 92 },
    { name: 'Mai', value: 93 },
    { name: 'Juin', value: 94 },
    { name: 'Juil.', value: 95 },
  ],
  investigatorPerformance: [
    { name: 'Sarra Mansouri', cases: 48, accuracy: 96, avgTime: 6 },
    { name: 'Mehdi Ben Ali', cases: 41, accuracy: 94, avgTime: 7 },
    { name: 'Leila Gharbi', cases: 36, accuracy: 93, avgTime: 8 },
    { name: 'Amine Trabelsi', cases: 32, accuracy: 91, avgTime: 9 },
    { name: 'Ines Bouazizi', cases: 28, accuracy: 92, avgTime: 8 },
  ],
  savedCosts: [
    { name: 'Janv.', value: 185000 },
    { name: 'Fév.', value: 210000 },
    { name: 'Mars', value: 245000 },
    { name: 'Avr.', value: 198000 },
    { name: 'Mai', value: 278000 },
    { name: 'Juin', value: 256000 },
    { name: 'Juil.', value: 312000 },
  ],
}

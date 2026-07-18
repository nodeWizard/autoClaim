import type { AgentDef } from '@/types'

export const agents: AgentDef[] = [
  {
    id: 'ocr',
    name: 'Agent OCR',
    role: 'Lecture et extraction des documents (constat, factures, contrat)',
    icon: 'ScanText',
  },
  {
    id: 'vision',
    name: 'Agent Vision',
    role: 'Analyse des photos de dommages, gravité et cohérence',
    icon: 'Eye',
  },
  {
    id: 'contrat',
    name: 'Agent Contrat',
    role: 'Vérification des garanties, franchises et exclusions',
    icon: 'FileCheck',
  },
  {
    id: 'fraude',
    name: 'Agent Fraude',
    role: 'Détection d’incohérences, anomalies et schémas suspects',
    icon: 'ShieldAlert',
  },
  {
    id: 'risque',
    name: 'Agent Risque',
    role: 'Score de confiance et niveau de risque du dossier',
    icon: 'Gauge',
  },
  {
    id: 'rapport',
    name: 'Agent Rapport',
    role: 'Génération du rapport d’analyse et synthèse',
    icon: 'FileText',
  },
]

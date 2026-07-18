export type UserRole = 'assure' | 'gestionnaire'

export type ClaimStatus =
  | 'recu'
  | 'en_analyse'
  | 'complement'
  | 'accepte'
  | 'refuse'
  | 'fraude'

export type RiskLevel = 'faible' | 'moyen' | 'eleve' | 'critique'

export type AgentId = 'ocr' | 'vision' | 'contrat' | 'fraude' | 'risque' | 'rapport'

export type AgentStatus = 'idle' | 'running' | 'done' | 'error'

export type ClaimType = 'auto'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
  avatarInitials: string
}

export interface TimelineEvent {
  id: string
  at: string
  title: string
  description: string
  visibleToAssure: boolean
}

export interface DocumentRef {
  id: string
  name: string
  type: 'constat' | 'photo' | 'facture' | 'contrat' | 'autre'
  uploadedAt: string
}

export interface Incoherence {
  id: string
  title: string
  detail: string
  severity: RiskLevel
  evidence: string[]
}

export interface AgentFinding {
  agentId: AgentId
  findings: string[]
  confidence: number
}

export interface Claim {
  id: string
  reference: string
  insureeName: string
  insureeId: string
  type: ClaimType
  title: string
  description: string
  declaredAt: string
  incidentDate: string
  amount: number
  status: ClaimStatus
  riskScore: number | null
  riskLevel: RiskLevel | null
  confidence: number | null
  plate?: string
  cin?: string
  policyNumber?: string
  vehicleModel?: string
  phone?: string
  location: string
  documents: DocumentRef[]
  timeline: TimelineEvent[]
  incoherences: Incoherence[]
  agentFindings: AgentFinding[]
  recommendation: 'accepter' | 'refuser' | 'complement' | 'fraude' | null
  decision?: {
    action: 'accepter' | 'refuser' | 'complement' | 'fraude'
    by: string
    at: string
    note: string
  }
  featured?: boolean
  scenario?: 'happy' | 'anomaly'
}

export interface AgentDef {
  id: AgentId
  name: string
  role: string
  icon: string
}

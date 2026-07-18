import type { AgentFinding, Claim, ClaimStatus, DocumentRef, RiskLevel, User } from '@/types'
import { agents } from '@/data/mock/agents'
import { FRONT_DAMAGE_IMAGE, FRONT_DAMAGE_NAME } from '@/assets/demo'

function guessDocType(name: string): DocumentRef['type'] {
  const lower = name.toLowerCase()
  if (lower.includes('constat')) return 'constat'
  if (lower.includes('facture') || lower.includes('devis')) return 'facture'
  if (lower.includes('police') || lower.includes('contrat')) return 'contrat'
  if (/\.(jpg|jpeg|png|webp|gif)$/i.test(lower) || lower.includes('photo')) return 'photo'
  return 'autre'
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Lecture impossible'))
    reader.readAsDataURL(file)
  })
}

export async function createClaimFromDeclaration(input: {
  user: User
  incidentDate: string
  location: string
  plate: string
  cin: string
  policyNumber: string
  vehicleModel: string
  phone: string
  amount: number
  description: string
  files: File[]
}): Promise<Claim> {
  const now = new Date()
  const id = `clm-${now.getTime()}`
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(now.getTime()).slice(-3)
  const declaredAt = now.toISOString()

  const documents: DocumentRef[] = await Promise.all(
    input.files.map(async (file, index) => ({
      id: `${id}-doc-${index}`,
      name: file.name,
      type: guessDocType(file.name),
      uploadedAt: declaredAt,
      url: await readAsDataUrl(file),
      mimeType: file.type || undefined,
    }))
  )

  if (!documents.some((d) => d.type === 'photo')) {
    documents.push({
      id: `${id}-doc-damage`,
      name: FRONT_DAMAGE_NAME,
      type: 'photo',
      uploadedAt: declaredAt,
      url: FRONT_DAMAGE_IMAGE,
      mimeType: 'image/jpeg',
    })
  }

  return {
    id,
    reference: `SIN-${y}${m}${d}-${seq}`,
    insureeName: input.user.name,
    insureeId: input.user.id,
    type: 'auto',
    title: `Sinistre automobile — ${input.vehicleModel}`,
    description: input.description,
    declaredAt,
    incidentDate: input.incidentDate,
    amount: input.amount,
    status: 'recu',
    riskScore: null,
    riskLevel: null,
    confidence: null,
    plate: input.plate.trim().toUpperCase(),
    cin: input.cin.trim(),
    policyNumber: input.policyNumber.trim().toUpperCase(),
    vehicleModel: input.vehicleModel.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    documents,
    timeline: [
      {
        id: `${id}-t1`,
        at: declaredAt,
        title: 'Déclaration soumise',
        description: `Dossier reçu avec ${documents.length} document(s). En attente d’analyse.`,
        visibleToAssure: true,
      },
    ],
    incoherences: [],
    agentFindings: [],
    recommendation: null,
  }
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'critique'
  if (score >= 55) return 'eleve'
  if (score >= 30) return 'moyen'
  return 'faible'
}

function recommendationFromScore(
  score: number
): NonNullable<Claim['recommendation']> {
  if (score >= 80) return 'fraude'
  if (score >= 35) return 'complement'
  return 'accepter'
}

function defaultFindings(
  agentId: string,
  claim: Claim,
  riskScore: number,
  recommendation: string
): string[] {
  switch (agentId) {
    case 'ocr':
      return [
        `Police ${claim.policyNumber ?? 'n/a'} / CIN ${claim.cin ?? 'n/a'} extraits`,
        `Montant déclaré : ${claim.amount} TND`,
      ]
    case 'vision':
      return [
        'Photo de dommages analysée',
        `Véhicule ${claim.vehicleModel ?? 'n/a'} — ${claim.plate ?? 'n/a'}`,
      ]
    case 'contrat':
      return ['Garantie automobile vérifiée', 'Franchise type 500 TND applicable']
    case 'fraude':
      return riskScore >= 55
        ? ['Anomalies potentielles détectées', 'Révision manuelle conseillée']
        : ['Aucun schéma suspect majeur']
    case 'risque':
      return [`Score risque ${riskScore}/100`, `Niveau ${riskLevelFromScore(riskScore)}`]
    case 'rapport':
      return [`Recommandation : ${recommendation}`, 'Rapport IA prêt']
    default:
      return ['Analyse terminée']
  }
}

/** Build scores + findings after the multi-agent chain finishes. */
export function buildAnalysisResult(
  claim: Claim,
  visibleFindings: Record<string, string[]>
) {
  let riskScore =
    claim.riskScore ??
    (claim.scenario === 'anomaly' ? 68 : claim.amount > 15000 ? 72 : claim.amount > 5000 ? 38 : 18)

  if (claim.confidence != null && claim.riskScore == null) {
    riskScore = 100 - claim.confidence
  }

  const riskLevel = claim.riskLevel ?? riskLevelFromScore(riskScore)
  const confidence = claim.confidence ?? Math.max(20, 100 - riskScore)
  const recommendation = claim.recommendation ?? recommendationFromScore(riskScore)

  const agentFindings: AgentFinding[] = agents.map((agent) => {
    const existing = claim.agentFindings.find((f) => f.agentId === agent.id)
    const fromRun = visibleFindings[agent.id]
    const isPlaceholder = fromRun?.[0]?.startsWith('Analyse Agent')
    const findings =
      (fromRun && fromRun.length > 0 && !isPlaceholder ? fromRun : null) ??
      existing?.findings ??
      defaultFindings(agent.id, claim, riskScore, recommendation)

    return {
      agentId: agent.id,
      findings,
      confidence: existing?.confidence ?? confidence,
    }
  })

  return {
    riskScore,
    riskLevel,
    confidence,
    recommendation,
    agentFindings,
    summary: `Analyse terminée — risque ${riskScore}/100 (${riskLevel}), recommandation : ${recommendation}.`,
  }
}

export function applyAnalysisToClaim(
  claim: Claim,
  visibleFindings: Record<string, string[]>
): Claim {
  const result = buildAnalysisResult(claim, visibleFindings)
  const now = new Date().toISOString()

  return {
    ...claim,
    status: claim.status === 'recu' ? 'en_analyse' : claim.status,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    confidence: result.confidence,
    recommendation: result.recommendation,
    agentFindings: result.agentFindings,
    timeline: [
      ...claim.timeline,
      {
        id: `${claim.id}-t-analyse-${Date.now()}`,
        at: now,
        title: 'Analyse IA terminée',
        description: result.summary,
        visibleToAssure: true,
      },
      {
        id: `${claim.id}-t-rapport-${Date.now()}`,
        at: now,
        title: 'Rapport généré',
        description: `Rapport d’analyse disponible (risque ${result.riskScore}/100).`,
        visibleToAssure: false,
      },
    ],
  }
}

const decisionToStatus: Record<
  NonNullable<Claim['decision']>['action'],
  ClaimStatus
> = {
  accepter: 'accepte',
  refuser: 'refuse',
  complement: 'complement',
  fraude: 'fraude',
}

export function applyDecisionToClaim(
  claim: Claim,
  action: NonNullable<Claim['decision']>['action'],
  by: string,
  note = ''
): Claim {
  const now = new Date().toISOString()
  const labels: Record<typeof action, string> = {
    accepter: 'Dossier accepté',
    refuser: 'Dossier refusé',
    complement: 'Complément documentaire demandé',
    fraude: 'Transféré à l’équipe fraude',
  }
  return {
    ...claim,
    status: decisionToStatus[action],
    decision: { action, by, at: now, note },
    timeline: [
      ...claim.timeline,
      {
        id: `${claim.id}-t-decision-${Date.now()}`,
        at: now,
        title: labels[action],
        description: note || `Décision prise par ${by}`,
        visibleToAssure: action !== 'fraude',
      },
    ],
  }
}

import type { Claim, RiskLevel } from '@/types'
import type { Evidence } from '@/components/analysis/EvidenceCard'
import { formatCurrency, riskLabels } from '@/lib/utils'
import { initialClaims } from './claims'

export interface ClaimReport {
  id: string
  claimId: string
  title: string
  generatedAt: string
  investigator: string
  riskScore: number
  riskLevel: RiskLevel
  confidence: number
  executiveSummary: string
  evidence: Evidence[]
  timeline: Claim['timeline']
  detectedRisks: Array<{
    id: string
    label: string
    severity: RiskLevel
    description: string
  }>
  policyCoverage: {
    covered: boolean
    amount: number
    exclusions: string[]
    notes: string
  }
  aiReasoning: string[]
  recommendations: string[]
}

function buildEvidence(claim: Claim): Evidence[] {
  const fromIncoherences: Evidence[] = claim.incoherences.map((inc, i) => ({
    id: `${claim.id}-ev-${i}`,
    title: inc.title,
    description: inc.detail,
    severity: inc.severity,
    confidence: claim.confidence ?? 70,
    type: i % 2 === 0 ? 'document' : 'image',
  }))

  if (fromIncoherences.length > 0) return fromIncoherences

  const fromAgents = claim.agentFindings.slice(0, 3).flatMap((af, i) =>
    af.findings.slice(0, 1).map((f, j) => ({
      id: `${claim.id}-af-${i}-${j}`,
      title: `Finding ${af.agentId.toUpperCase()}`,
      description: f,
      severity: (claim.riskLevel ?? 'faible') as RiskLevel,
      confidence: af.confidence,
      type: (['document', 'image', 'pattern', 'financial'] as const)[i % 4],
    }))
  )

  if (fromAgents.length > 0) return fromAgents

  return [
    {
      id: `${claim.id}-ev-pending`,
      title: 'Analyse en attente',
      description: 'Lancez la chaîne multi-agents pour générer les preuves.',
      severity: 'faible',
      confidence: 50,
      type: 'document',
    },
  ]
}

function recommendationsFor(claim: Claim): string[] {
  switch (claim.recommendation) {
    case 'accepter':
      return [
        'Valider l’indemnisation selon la franchise contractuelle',
        'Notifier l’assuré de l’acceptation',
        'Archiver le dossier Notion',
      ]
    case 'complement':
      return [
        'Demander une explication écrite sur l’écart de dates',
        'Exiger une attestation complémentaire',
        'Relancer l’analyse après réception des pièces',
      ]
    case 'fraude':
      return [
        'Escalader vers l’équipe anti-fraude STAR',
        'Geler tout paiement en attendant l’enquête',
        'Conserver les preuves EXIF et historiques',
      ]
    case 'refuser':
      return ['Notifier le refus motivé', 'Documenter la décision', 'Clôturer le dossier']
    default:
      return ['Réviser manuellement le dossier', 'Compléter l’analyse multi-agents']
  }
}

/** Build a report from any claim (seed or newly declared). */
export function buildReportFromClaim(claim: Claim): ClaimReport {
  const riskScore =
    claim.riskScore ?? (claim.confidence != null ? 100 - claim.confidence : 40)
  const riskLevel = claim.riskLevel ?? 'moyen'
  const confidence = claim.confidence ?? 70
  const evidence = buildEvidence(claim)

  return {
    id: `rpt-${claim.id}`,
    claimId: claim.id,
    title: `Rapport d’analyse — ${claim.reference}`,
    generatedAt:
      claim.timeline.find((t) => t.title.toLowerCase().includes('rapport') || t.title.toLowerCase().includes('analyse'))
        ?.at ?? claim.declaredAt,
    investigator: claim.decision?.by ?? 'Sarra Mansouri',
    riskScore,
    riskLevel,
    confidence,
    executiveSummary: `L’analyse multi-agents du sinistre ${claim.reference} (${claim.insureeName}) est terminée. Sinistre automobile de ${formatCurrency(claim.amount)} déclaré le ${claim.incidentDate}. Score de risque ${riskScore} % (niveau ${riskLabels[riskLevel]}), confiance IA ${confidence} %. ${
      riskScore >= 70
        ? 'Une escalade anti-fraude est recommandée.'
        : riskScore >= 40
          ? 'Une révision manuelle complémentaire est conseillée.'
          : 'Un traitement standard avec vérifications de routine est recommandé.'
    }`,
    evidence,
    timeline: claim.timeline,
    detectedRisks: [
      {
        id: `${claim.id}-dr-1`,
        label: 'Score de risque composite',
        severity: riskLevel,
        description: `${riskScore} % de risque estimé`,
      },
      {
        id: `${claim.id}-dr-2`,
        label: 'Anomalies sur les preuves',
        severity: evidence.length > 1 ? 'eleve' : 'faible',
        description: `${evidence.length} élément(s) de preuve signalé(s)`,
      },
      {
        id: `${claim.id}-dr-3`,
        label: 'Schéma frauduleux',
        severity: riskScore >= 70 ? 'critique' : 'faible',
        description:
          riskScore >= 70
            ? 'Correspond à des schémas suspects connus'
            : 'Aucune correspondance significative',
      },
    ],
    policyCoverage: {
      covered: riskScore < 80,
      amount: Math.max(0, claim.amount - 500),
      exclusions:
        riskScore >= 50
          ? ['Exclusion dommages antérieurs possible', 'Vérification délai de carence']
          : [],
      notes:
        riskScore >= 50
          ? 'Couverture en cours d’examen en raison d’anomalies détectées'
          : 'Couverture automobile standard applicable — franchise 500 TND',
    },
    aiReasoning:
      claim.agentFindings.length > 0
        ? claim.agentFindings.flatMap((af) =>
            af.findings.map((f) => `[${af.agentId.toUpperCase()}] ${f}`)
          )
        : ['Aucune analyse IA encore exécutée sur ce dossier.'],
    recommendations: recommendationsFor(claim),
  }
}

export function reportsFromClaims(claims: Claim[]): ClaimReport[] {
  return claims
    .filter(
      (c) =>
        c.featured ||
        c.agentFindings.length > 0 ||
        c.riskScore != null ||
        c.confidence != null ||
        c.status !== 'recu' ||
        c.timeline.some((t) => t.title.toLowerCase().includes('analyse') || t.title.toLowerCase().includes('rapport'))
    )
    .map(buildReportFromClaim)
    .sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    )
}

/** Seed-only list (legacy). Prefer reportsFromClaims(claimsAtom). */
export const reports: ClaimReport[] = reportsFromClaims(initialClaims)

export function getReport(id: string, claims?: Claim[]): ClaimReport | undefined {
  if (claims) {
    const fromList = reportsFromClaims(claims).find((r) => r.id === id)
    if (fromList) return fromList
    const claimId = id.startsWith('rpt-') ? id.slice(4) : id
    const claim = claims.find((c) => c.id === claimId || c.id === id)
    if (claim) return buildReportFromClaim(claim)
  }
  return reports.find((r) => r.id === id)
}

export function getReportByClaimId(
  claimId: string,
  claims?: Claim[]
): ClaimReport | undefined {
  if (claims) {
    const claim = claims.find((c) => c.id === claimId)
    if (claim) return buildReportFromClaim(claim)
  }
  return reports.find((r) => r.claimId === claimId)
}

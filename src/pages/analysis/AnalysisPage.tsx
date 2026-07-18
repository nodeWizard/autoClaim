import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArrowLeft, FileText, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { agents, getClaimById } from '@/data/mock'
import { buildReportFromClaim } from '@/data/mock/reports'
import { analysisAtom, claimsAtom } from '@/features/atoms'
import { applyAnalysisToClaim } from '@/features/claims'
import { AgentCard } from '@/components/analysis/AgentCard'
import { EvidenceCard, type Evidence } from '@/components/analysis/EvidenceCard'
import { RiskGauge } from '@/components/analysis/RiskGauge'
import { PageHeader } from '@/components/layout/PageHeader'
import { RiskBadge } from '@/components/shared/Badges'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { delay, formatPercent } from '@/lib/utils'
import type { AgentStatus, Claim, RiskLevel } from '@/types'

function recommendedActions(
  recommendation: string | null | undefined,
  riskScore: number
): string[] {
  switch (recommendation) {
    case 'accepter':
      return [
        'Valider l’indemnisation (franchise 500 TND)',
        'Notifier l’assuré de l’acceptation',
        'Archiver le rapport IA',
      ]
    case 'complement':
      return [
        'Demander une explication écrite sur les incohérences',
        'Exiger des pièces complémentaires',
        'Relancer l’analyse après réception',
      ]
    case 'fraude':
      return [
        'Escalader vers l’équipe anti-fraude STAR',
        'Geler tout paiement',
        'Conserver les preuves et métadonnées',
      ]
    case 'refuser':
      return ['Notifier le refus motivé', 'Documenter la décision', 'Clôturer le dossier']
    default:
      return riskScore >= 50
        ? ['Réviser manuellement le dossier', 'Compléter l’analyse multi-agents']
        : ['Traitement standard recommandé', 'Vérifications de routine']
  }
}

export function AnalysisPage() {
  const { id } = useParams()
  const claims = useAtomValue(claimsAtom)
  const setClaims = useSetAtom(claimsAtom)
  const claimFromStore = getClaimById(claims, id ?? '')
  const [state, setState] = useAtom(analysisAtom)
  const [resultClaim, setResultClaim] = useState<Claim | null>(null)
  const runningRef = useRef(false)

  const claim = resultClaim ?? claimFromStore

  useEffect(() => {
    if (!claimFromStore) return
    if (state.claimId !== claimFromStore.id) {
      setResultClaim(null)
      setState({
        claimId: claimFromStore.id,
        isRunning: false,
        currentAgentIndex: -1,
        agentStatuses: {},
        agentProgress: {},
        visibleFindings: {},
        isComplete: false,
      })
    }
  }, [claimFromStore, setState, state.claimId])

  async function runAnalysis() {
    if (!claimFromStore || runningRef.current) return
    runningRef.current = true
    setResultClaim(null)

    const statuses: Record<string, AgentStatus> = {}
    const progress: Record<string, number> = {}
    const findings: Record<string, string[]> = {}
    agents.forEach((a) => {
      statuses[a.id] = 'idle'
      progress[a.id] = 0
      findings[a.id] = []
    })

    setState({
      claimId: claimFromStore.id,
      isRunning: true,
      currentAgentIndex: 0,
      agentStatuses: { ...statuses },
      agentProgress: { ...progress },
      visibleFindings: { ...findings },
      isComplete: false,
    })

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]
      statuses[agent.id] = 'running'
      setState((s) => ({
        ...s,
        currentAgentIndex: i,
        agentStatuses: { ...statuses },
      }))

      for (let p = 0; p <= 100; p += 20) {
        progress[agent.id] = p
        setState((s) => ({ ...s, agentProgress: { ...progress } }))
        await delay(180)
      }

      const agentFindings =
        claimFromStore.agentFindings.find((f) => f.agentId === agent.id)?.findings ??
        [`Analyse ${agent.name} terminée`]
      findings[agent.id] = agentFindings
      statuses[agent.id] = 'done'
      setState((s) => ({
        ...s,
        agentStatuses: { ...statuses },
        visibleFindings: { ...findings },
      }))
      await delay(250)
    }

    const updated = applyAnalysisToClaim(claimFromStore, findings)
    setResultClaim(updated)
    setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    toast.success(
      `Analyse terminée — risque ${updated.riskScore}/100 · ${updated.recommendation}`
    )

    setState((s) => ({ ...s, isRunning: false, isComplete: true }))
    runningRef.current = false
  }

  function reset() {
    runningRef.current = false
    setResultClaim(null)
    setState({
      claimId: claimFromStore?.id ?? null,
      isRunning: false,
      currentAgentIndex: -1,
      agentStatuses: {},
      agentProgress: {},
      visibleFindings: {},
      isComplete: false,
    })
  }

  const riskScore = useMemo(() => {
    if (!claim) return 0
    if (claim.riskScore != null) return claim.riskScore
    if (claim.confidence != null) return 100 - claim.confidence
    return 40
  }, [claim])

  const evidence: Evidence[] = useMemo(() => {
    if (!claim) return []
    const fromInc: Evidence[] = claim.incoherences.map((inc, i) => ({
      id: `${claim.id}-ev-${i}`,
      title: inc.title,
      description: inc.detail,
      severity: inc.severity,
      confidence: claim.confidence ?? 70,
      type: (['document', 'image', 'pattern', 'financial'] as const)[i % 4],
    }))
    if (fromInc.length > 0) return fromInc

    return claim.agentFindings.flatMap((af, i) =>
      af.findings.slice(0, 1).map((f, j) => ({
        id: `${claim.id}-af-${i}-${j}`,
        title: agents.find((a) => a.id === af.agentId)?.name ?? af.agentId,
        description: f,
        severity: (claim.riskLevel ?? 'moyen') as RiskLevel,
        confidence: af.confidence,
        type: (['document', 'image', 'pattern', 'financial'] as const)[i % 4],
      }))
    )
  }, [claim])

  const reasoning = useMemo(() => {
    if (!claim) return []
    if (claim.agentFindings.length > 0) {
      return claim.agentFindings.flatMap((af) =>
        af.findings.map((f) => `[${af.agentId.toUpperCase()}] ${f}`)
      )
    }
    return Object.entries(state.visibleFindings).flatMap(([agentId, list]) =>
      list.map((f) => `[${agentId.toUpperCase()}] ${f}`)
    )
  }, [claim, state.visibleFindings])

  const report = claim ? buildReportFromClaim(claim) : undefined
  const reportLink = report ? `/assurance/rapports/${report.id}` : '/assurance/rapports'

  if (!claim) return <p>Dossier introuvable.</p>

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to={`/assurance/sinistres/${claim.id}`}>
          <ArrowLeft className="size-4" />
          Retour au dossier
        </Link>
      </Button>

      <PageHeader
        title="Analyse intelligente"
        description={`6 agents IA spécialisés · ${claim.reference}`}
        actions={
          <>
            <Button onClick={runAnalysis} disabled={state.isRunning}>
              {state.isRunning ? 'Analyse en cours…' : 'Lancer la chaîne'}
            </Button>
            <Button variant="outline" onClick={reset} disabled={state.isRunning}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              status={state.agentStatuses[agent.id] ?? 'idle'}
              progress={state.agentProgress[agent.id] ?? 0}
              findings={state.visibleFindings[agent.id] ?? []}
            />
          ))}

          {state.isComplete && (
            <div className="space-y-6 pt-4">
              {evidence.length > 0 && (
                <section>
                  <h3 className="mb-3 font-semibold">Preuves détectées</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {evidence.map((ev, i) => (
                      <EvidenceCard key={ev.id} evidence={ev} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {reasoning.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Raisonnement IA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {reasoning.map((r, i) => (
                      <p
                        key={i}
                        className="border-l-2 border-primary pl-3 text-sm text-muted-foreground"
                      >
                        {r}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actions recommandées</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-1 pl-5">
                    {recommendedActions(claim.recommendation, riskScore).map((action, i) => (
                      <li key={i} className="text-sm">
                        {action}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résultat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {state.isComplete ? (
                <>
                  <div className="flex justify-center py-2">
                    <RiskGauge score={riskScore} size={180} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confiance</span>
                    <span className="font-semibold">
                      {claim.confidence != null ? formatPercent(claim.confidence) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risque</span>
                    {claim.riskLevel ? <RiskBadge level={claim.riskLevel} /> : '—'}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommandation</span>
                    <span className="font-semibold capitalize">
                      {claim.recommendation ?? '—'}
                    </span>
                  </div>
                  <Button asChild className="mt-2 w-full">
                    <Link to={`/assurance/sinistres/${claim.id}`}>Prendre une décision</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={reportLink}>
                      <FileText className="size-4" />
                      Voir le rapport
                    </Link>
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Lancez l’analyse pour voir le score, les preuves et la recommandation.
                </p>
              )}
            </CardContent>
          </Card>

          {claim.scenario === 'anomaly' && state.isComplete && (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-base">Alerte scénario anomalie</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Date déclarée ≠ date constat / EXIF. Score de confiance descendu.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

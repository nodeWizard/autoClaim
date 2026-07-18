import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { getReport } from '@/data/mock/reports'
import { EvidenceCard } from '@/components/analysis/EvidenceCard'
import { Timeline } from '@/components/shared/Timeline'
import { RiskBadge } from '@/components/shared/Badges'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const report = getReport(id ?? '')

  if (!report) {
    return (
      <div>
        <p className="mb-4">Rapport introuvable.</p>
        <Button asChild variant="outline">
          <Link to="/assurance/rapports">Retour aux rapports</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/assurance/rapports">
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimer / Exporter PDF
        </Button>
      </div>

      <div className="print-area mx-auto max-w-4xl space-y-8 rounded-xl border bg-white p-12 shadow-sm dark:bg-card">
        <div className="border-b pb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              AC
            </div>
            <span className="text-xl font-bold">AutoClaim</span>
          </div>
          <h1 className="text-2xl font-bold">{report.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Généré le {formatDate(report.generatedAt)} · Gestionnaire : {report.investigator}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="font-mono text-lg font-bold text-primary">
              Risque {formatPercent(report.riskScore)}
            </span>
            <RiskBadge level={report.riskLevel} />
            <span className="text-sm">Confiance : {formatPercent(report.confidence)}</span>
          </div>
        </div>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Résumé exécutif</h2>
          <p className="text-sm leading-relaxed">{report.executiveSummary}</p>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Preuves</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {report.evidence.map((ev, i) => (
              <EvidenceCard key={ev.id} evidence={ev} index={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Chronologie</h2>
          <Timeline events={report.timeline} />
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Risques détectés</h2>
          <div className="space-y-2">
            {report.detectedRisks.map((risk) => (
              <div key={risk.id} className="flex items-center gap-3 text-sm">
                <RiskBadge level={risk.severity} />
                <span className="font-medium">{risk.label}</span>
                <span className="text-muted-foreground">— {risk.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Couverture du contrat</h2>
          <p className="mb-2 text-sm">
            Couverture :{' '}
            <strong>{report.policyCoverage.covered ? 'Valide' : 'En cours d’examen'}</strong>
            {report.policyCoverage.covered &&
              ` — Jusqu’à ${formatCurrency(report.policyCoverage.amount)}`}
          </p>
          {report.policyCoverage.exclusions.length > 0 && (
            <div className="text-sm">
              <p className="mb-1 font-medium">Exclusions :</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {report.policyCoverage.exclusions.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{report.policyCoverage.notes}</p>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Raisonnement de l’IA</h2>
          {report.aiReasoning.map((r, i) => (
            <p
              key={i}
              className="mb-2 border-l-2 border-primary pl-3 text-sm text-muted-foreground"
            >
              {r}
            </p>
          ))}
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-bold">Recommandations</h2>
          <ol className="list-decimal space-y-1 pl-5">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="text-sm">
                {rec}
              </li>
            ))}
          </ol>
        </section>

        <Separator />

        <section className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <div className="mb-2 h-12 border-b border-foreground/30 pb-1" />
            <p className="text-sm font-medium">{report.investigator}</p>
            <p className="text-xs text-muted-foreground">Gestionnaire principal</p>
          </div>
          <div>
            <div className="mb-2 h-12 border-b border-foreground/30 pb-1" />
            <p className="text-sm font-medium">Système IA AutoClaim</p>
            <p className="text-xs text-muted-foreground">
              Analyse automatisée — {formatPercent(report.confidence)} de confiance
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

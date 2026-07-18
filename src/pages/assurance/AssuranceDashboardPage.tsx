import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Clock, ShieldAlert, TrendingDown } from 'lucide-react'
import { claimsAtom } from '@/features/atoms'
import { aiActivity, analyticsData } from '@/data/mock/analytics'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChartCard } from '@/components/charts/ChartCard'
import { CategoryPieChart, FraudTrendChart } from '@/components/charts/Charts'
import { RiskBadge, StatCard, StatusBadge } from '@/components/shared/Badges'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

export function AssuranceDashboardPage() {
  const claims = useAtomValue(claimsAtom)
  const sorted = [...claims].sort(
    (a, b) => new Date(b.declaredAt).getTime() - new Date(a.declaredAt).getTime()
  )
  const pending = claims.filter((c) => c.status === 'recu' || c.status === 'en_analyse')
  const highRisk = claims.filter((c) => c.riskLevel === 'eleve' || c.riskLevel === 'critique')
  const decided = claims.filter((c) =>
    ['accepte', 'refuse', 'fraude', 'complement'].includes(c.status)
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description="Nouveaux sinistres, analyses IA et décisions en un coup d’œil."
        actions={
          <Button asChild variant="outline">
            <Link to="/assurance/sinistres">
              Voir les sinistres
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="En attente" value={String(pending.length)} hint="À analyser ou en cours" />
        <StatCard label="Décidés (7j)" value={String(decided.length)} hint="Acceptés, refus, compléments" />
        <StatCard
          label="Risque élevé"
          value={String(highRisk.length)}
          hint="Nécessitent attention"
        />
        <StatCard label="Délai moyen" value="7 min" hint="vs 7–15 jours avant" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Sinistres récents</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/assurance/sinistres">
                Tout voir <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {sorted.slice(0, 4).map((claim) => (
              <Link
                key={claim.id}
                to={`/assurance/sinistres/${claim.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3 transition-colors hover:border-primary/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{claim.insureeName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {claim.reference} · {claim.amount > 0 ? formatCurrency(claim.amount) : '—'}
                  </p>
                </div>
                <StatusBadge status={claim.status} />
              </Link>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Flux d’activité IA</CardTitle>
            <Bot className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {aiActivity.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div
                  className={cn(
                    'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                    item.status === 'warning'
                      ? 'bg-orange-500'
                      : item.status === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.agent}</p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Link
                      to={`/assurance/sinistres/${item.claimId}`}
                      className="text-primary hover:underline"
                    >
                      {item.claimId}
                    </Link>
                    <span>·</span>
                    <span>{formatDateTime(item.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Tendances de la fraude">
          <FraudTrendChart data={analyticsData.fraudTrends} height={220} />
        </ChartCard>
        <ChartCard title="Catégories de fraude">
          <CategoryPieChart data={analyticsData.fraudCategories} height={220} />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Impact AutoClaim</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Traitement −70%</p>
                <p className="text-xs text-muted-foreground">7–15 jours → 7–15 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                <ShieldAlert className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Détection fraude +333%</p>
                <p className="text-xs text-muted-foreground">15% → 65% des cas suspects</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <TrendingDown className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Coût dossier −65%</p>
                <p className="text-xs text-muted-foreground">80–150 TND → 25–40 TND</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            {sorted[0]
              ? `Dernière activité : ${formatDate(sorted[0].declaredAt)} — dossier ${sorted[0].reference}`
              : 'Aucun sinistre pour le moment.'}
          </p>
        </section>

        {highRisk.length > 0 ? (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h2 className="mb-3 font-semibold">Alertes risque</h2>
            <div className="space-y-2">
              {highRisk.map((claim) => (
                <Link
                  key={claim.id}
                  to={`/assurance/sinistres/${claim.id}`}
                  className="flex items-center justify-between rounded-lg bg-card/80 px-3 py-2.5 text-sm"
                >
                  <span>
                    {claim.insureeName} — {claim.title}
                  </span>
                  {claim.riskLevel ? <RiskBadge level={claim.riskLevel} /> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-2 font-semibold">Alertes risque</h2>
            <p className="text-sm text-muted-foreground">Aucun dossier à risque élevé pour le moment.</p>
          </section>
        )}
      </div>
    </div>
  )
}

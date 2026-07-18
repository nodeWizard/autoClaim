import { PageHeader } from '@/components/layout/PageHeader'
import { ChartCard } from '@/components/charts/ChartCard'
import {
  CategoryPieChart,
  FraudTrendChart,
  LineTrendChart,
  MonthlyBarChart,
} from '@/components/charts/Charts'
import { StatCard } from '@/components/shared/Badges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyticsData } from '@/data/mock/analytics'
import { cn, formatCurrency } from '@/lib/utils'
import { MapPin } from 'lucide-react'

export function AnalyticsPage() {
  const lastSaved = analyticsData.savedCosts[analyticsData.savedCosts.length - 1].value
  const lastTime = analyticsData.investigationTime[analyticsData.investigationTime.length - 1]
    .value
  const lastAccuracy = analyticsData.aiAccuracy[analyticsData.aiAccuracy.length - 1].value
  const lastFraud = analyticsData.fraudTrends[analyticsData.fraudTrends.length - 1].value

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytique"
        description="Délais, fraude automobile, précision IA et économies en TND"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Cas de fraude (juil.)"
          value={String(lastFraud)}
          hint="+14 % vs mois dernier"
        />
        <StatCard
          label="Délai moyen d’analyse"
          value={`${lastTime} min`}
          hint="−7 % d’amélioration"
        />
        <StatCard
          label="Précision de l’IA"
          value={`${lastAccuracy} %`}
          hint="+1,2 % vs mois dernier"
        />
        <StatCard label="Économies ce mois" value={formatCurrency(lastSaved)} hint="Fraudes évitées" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Tendances de la fraude automobile">
          <FraudTrendChart data={analyticsData.fraudTrends} />
        </ChartCard>
        <ChartCard title="Catégories de fraude">
          <CategoryPieChart data={analyticsData.fraudCategories} />
        </ChartCard>
        <ChartCard title="Sinistres mensuels">
          <MonthlyBarChart data={analyticsData.monthlyClaims} />
        </ChartCard>
        <ChartCard title="Évolution du délai d’analyse">
          <LineTrendChart data={analyticsData.investigationTime} color="#0ea5e9" />
        </ChartCard>
        <ChartCard title="Précision de l’IA dans le temps">
          <LineTrendChart data={analyticsData.aiAccuracy} color="#0B4F6C" />
        </ChartCard>
        <ChartCard title="Économies réalisées (TND)">
          <LineTrendChart data={analyticsData.savedCosts} color="#10b981" />
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" /> Carte régionale de la fraude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {analyticsData.regionalHeatmap.map((region) => (
              <div
                key={region.region}
                className={cn(
                  'rounded-xl border p-4 text-center transition-colors',
                  region.fraudRate >= 20
                    ? 'border-red-500/20 bg-red-500/10'
                    : region.fraudRate >= 15
                      ? 'border-orange-500/20 bg-orange-500/10'
                      : 'border-emerald-500/20 bg-emerald-500/10'
                )}
              >
                <p className="text-sm font-medium">{region.region}</p>
                <p className="mt-1 text-2xl font-bold">{region.fraudRate} %</p>
                <p className="text-xs text-muted-foreground">{region.claims} sinistres</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance des gestionnaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.investigatorPerformance.map((inv) => (
              <div key={inv.name} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {inv.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{inv.name}</p>
                  <p className="text-xs text-muted-foreground">{inv.cases} dossiers traités</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{inv.accuracy} % de précision</p>
                  <p className="text-xs text-muted-foreground">{inv.avgTime} min en moyenne</p>
                </div>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${inv.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

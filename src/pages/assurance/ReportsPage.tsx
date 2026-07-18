import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'
import { reports } from '@/data/mock/reports'
import { PageHeader } from '@/components/layout/PageHeader'
import { RiskBadge } from '@/components/shared/Badges'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatPercent } from '@/lib/utils'

export function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Rapports IA"
        description="Rapports d’analyse générés automatiquement par la chaîne multi-agents"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Link key={report.id} to={`/assurance/rapports/${report.id}`}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(report.generatedAt)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {report.executiveSummary}
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-primary">
                    Risque {formatPercent(report.riskScore)}
                  </span>
                  <RiskBadge level={report.riskLevel} />
                  <span className="ml-auto text-xs text-muted-foreground">
                    {report.investigator}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

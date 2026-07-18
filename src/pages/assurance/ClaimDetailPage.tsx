import { Link, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { ArrowLeft, Play, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { claimsAtom } from '@/features/atoms'
import { getClaimById } from '@/data/mock'
import { PageHeader } from '@/components/layout/PageHeader'
import { RiskBadge, StatusBadge } from '@/components/shared/Badges'
import { DocumentsList, ClaimPhotos } from '@/components/shared/DocumentsList'
import { Timeline } from '@/components/shared/Timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, formatPercent } from '@/lib/utils'

export function ClaimDetailPage() {
  const { id } = useParams()
  const claims = useAtomValue(claimsAtom)
  const claim = getClaimById(claims, id ?? '')

  if (!claim) {
    return <p>Dossier introuvable.</p>
  }

  function decide(action: string) {
    toast.success(`Décision enregistrée : ${action}`)
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/assurance/sinistres">
          <ArrowLeft className="size-4" />
          Sinistres
        </Link>
      </Button>

      <PageHeader
        title={claim.title}
        description={`${claim.reference} · ${claim.insureeName} · ${formatDate(claim.declaredAt)}`}
        actions={
          <>
            <StatusBadge status={claim.status} />
            {claim.riskLevel ? <RiskBadge level={claim.riskLevel} /> : null}
            <Button asChild>
              <Link to={`/assurance/sinistres/${claim.id}/analyse`}>
                <Play className="size-4" />
                Lancer l’analyse IA
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Photos du sinistre</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimPhotos documents={claim.documents} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{claim.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Montant</p>
                  <p className="font-medium">{formatCurrency(claim.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lieu</p>
                  <p className="font-medium">{claim.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date incident</p>
                  <p className="font-medium">{formatDate(claim.incidentDate)}</p>
                </div>
                {claim.cin ? (
                  <div>
                    <p className="text-muted-foreground">CIN</p>
                    <p className="font-medium">{claim.cin}</p>
                  </div>
                ) : null}
                {claim.policyNumber ? (
                  <div>
                    <p className="text-muted-foreground">N° police</p>
                    <p className="font-medium">{claim.policyNumber}</p>
                  </div>
                ) : null}
                {claim.vehicleModel ? (
                  <div>
                    <p className="text-muted-foreground">Véhicule</p>
                    <p className="font-medium">{claim.vehicleModel}</p>
                  </div>
                ) : null}
                {claim.plate ? (
                  <div>
                    <p className="text-muted-foreground">Immatriculation</p>
                    <p className="font-medium">{claim.plate}</p>
                  </div>
                ) : null}
                {claim.phone ? (
                  <div>
                    <p className="text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{claim.phone}</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {claim.incoherences.length > 0 && (
            <Card className="border-amber-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-600" />
                  Incohérences détectées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {claim.incoherences.map((inc) => (
                  <div key={inc.id} className="rounded-lg border bg-amber-500/5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{inc.title}</p>
                      <RiskBadge level={inc.severity} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{inc.detail}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Preuves : {inc.evidence.join(' · ')}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={claim.timeline} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confiance</span>
                <span className="font-semibold">
                  {claim.confidence != null ? formatPercent(claim.confidence) : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score risque</span>
                <span className="font-semibold">{claim.riskScore ?? '—'}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recommandation</span>
                <span className="font-semibold capitalize">{claim.recommendation ?? '—'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents ({claim.documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentsList documents={claim.documents} hideImagePreviews />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Décision</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button onClick={() => decide('accepter')}>Accepter</Button>
              <Button variant="outline" onClick={() => decide('complement')}>
                Demander complément
              </Button>
              <Button variant="outline" onClick={() => decide('refuser')}>
                Refuser
              </Button>
              <Button variant="destructive" onClick={() => decide('fraude')}>
                Transférer fraude
              </Button>
              {claim.decision ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Dernière décision : {claim.decision.action} par {claim.decision.by}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

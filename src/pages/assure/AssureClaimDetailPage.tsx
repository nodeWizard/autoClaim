import { Link, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { ArrowLeft } from 'lucide-react'
import { claimsAtom } from '@/features/atoms'
import { getClaimById } from '@/data/mock'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusBadge } from '@/components/shared/Badges'
import { Timeline } from '@/components/shared/Timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

export function AssureClaimDetailPage() {
  const { id } = useParams()
  const claims = useAtomValue(claimsAtom)
  const claim = getClaimById(claims, id ?? '')

  if (!claim) {
    return (
      <div>
        <p>Sinistre introuvable.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/assure">Retour</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/assure">
          <ArrowLeft className="size-4" />
          Mes sinistres
        </Link>
      </Button>

      <PageHeader
        title={claim.title}
        description={`${claim.reference} · Déclaré le ${formatDate(claim.declaredAt)}`}
        actions={<StatusBadge status={claim.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Suivi du dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={claim.timeline} assureView />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Montant estimé</span>
                <span className="font-medium">{formatCurrency(claim.amount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Date incident</span>
                <span className="font-medium">{formatDate(claim.incidentDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Lieu</span>
                <span className="font-medium text-right">{claim.location}</span>
              </div>
              {claim.cin ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">CIN</span>
                  <span className="font-medium">{claim.cin}</span>
                </div>
              ) : null}
              {claim.policyNumber ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">N° police</span>
                  <span className="font-medium text-right">{claim.policyNumber}</span>
                </div>
              ) : null}
              {claim.vehicleModel ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Véhicule</span>
                  <span className="font-medium text-right">{claim.vehicleModel}</span>
                </div>
              ) : null}
              {claim.plate ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Immatriculation</span>
                  <span className="font-medium">{claim.plate}</span>
                </div>
              ) : null}
              {claim.phone ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="font-medium">{claim.phone}</span>
                </div>
              ) : null}
              {claim.status === 'accepte' && (
                <p className="rounded-lg bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-400">
                  Votre sinistre est accepté. Indemnisation en cours.
                </p>
              )}
              {claim.status === 'complement' && (
                <p className="rounded-lg bg-amber-500/10 p-3 text-amber-800 dark:text-amber-300">
                  Des éléments complémentaires sont nécessaires pour finaliser votre dossier.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {claim.documents.map((doc) => (
                <div key={doc.id} className="rounded-lg border px-3 py-2 text-sm">
                  {doc.name}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

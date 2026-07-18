import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { FilePlus2, ChevronRight } from 'lucide-react'
import { authAtom, claimsAtom } from '@/features/atoms'
import { getClaimsForAssure } from '@/data/mock'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusBadge } from '@/components/shared/Badges'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

export function AssureHomePage() {
  const auth = useAtomValue(authAtom)
  const claims = useAtomValue(claimsAtom)
  const myClaims = getClaimsForAssure(claims, auth.user?.id ?? '').sort(
    (a, b) => new Date(b.declaredAt).getTime() - new Date(a.declaredAt).getTime()
  )

  return (
    <div>
      <PageHeader
        title={`Bonjour, ${auth.user?.name.split(' ').slice(-1)[0]}`}
        description="Suivez vos sinistres en temps réel. Aucune information de fraude n’est affichée ici."
        actions={
          <Button asChild>
            <Link to="/assure/declarer">
              <FilePlus2 className="size-4" />
              Déclarer un sinistre
            </Link>
          </Button>
        }
      />

      <div className="space-y-3">
        {myClaims.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Aucun sinistre pour le moment.</p>
            <Button asChild className="mt-4">
              <Link to="/assure/declarer">Déclarer maintenant</Link>
            </Button>
          </div>
        ) : (
          myClaims.map((claim) => (
            <Link
              key={claim.id}
              to={`/assure/sinistres/${claim.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{claim.title}</p>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {claim.reference} · {formatDate(claim.declaredAt)}
                  {claim.amount > 0 ? ` · ${formatCurrency(claim.amount)}` : ''}
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

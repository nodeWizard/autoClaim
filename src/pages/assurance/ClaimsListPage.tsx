import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Search } from 'lucide-react'
import { claimsAtom } from '@/features/atoms'
import { PageHeader } from '@/components/layout/PageHeader'
import { RiskBadge, StatusBadge } from '@/components/shared/Badges'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { ClaimStatus } from '@/types'

const filters: Array<{ value: ClaimStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'recu', label: 'Reçus' },
  { value: 'en_analyse', label: 'En analyse' },
  { value: 'complement', label: 'Complément' },
  { value: 'accepte', label: 'Acceptés' },
  { value: 'fraude', label: 'Fraude' },
]

export function ClaimsListPage() {
  const navigate = useNavigate()
  const claims = useAtomValue(claimsAtom)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ClaimStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return claims
      .filter((c) => {
        const matchStatus = status === 'all' || c.status === status
        const query = q.toLowerCase()
        const matchQ =
          !query ||
          c.insureeName.toLowerCase().includes(query) ||
          c.reference.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query)
        return matchStatus && matchQ
      })
      .sort((a, b) => new Date(b.declaredAt).getTime() - new Date(a.declaredAt).getTime())
  }, [claims, q, status])

  return (
    <div>
      <PageHeader
        title="Sinistres"
        description="Cliquez sur un dossier pour voir ses détails et lancer une analyse."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher assuré, référence…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-4 py-3 font-medium">Assuré</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Montant</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Risque</th>
              <th className="hidden px-4 py-3 font-medium xl:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((claim) => (
              <tr
                key={claim.id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/assurance/sinistres/${claim.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/assurance/sinistres/${claim.id}`)
                  }
                }}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3 font-medium text-primary">{claim.reference}</td>
                <td className="px-4 py-3">{claim.insureeName}</td>
                <td className="hidden px-4 py-3 md:table-cell">Automobile</td>
                <td className="hidden px-4 py-3 lg:table-cell">{formatCurrency(claim.amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={claim.status} />
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {claim.riskLevel ? <RiskBadge level={claim.riskLevel} /> : '—'}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                  {formatDate(claim.declaredAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

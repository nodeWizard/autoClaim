import { Link } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DemoPage() {
  return (
    <div>
      <PageHeader
        title="Scénarios démo"
        description="Deux parcours automobile du 15 juillet 2026 : traitement standard (7 minutes) et détection d’anomalie."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
              Scénario 1 — Happy path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>14:00 — Déclaration avec constat, 4 photos et facture.</p>
            <p>14:01–14:05 — OCR → Vision → Contrat → Fraude → Risque → Rapport (92/100).</p>
            <p>14:06 — Gestionnaire approuve en un clic.</p>
            <p className="font-medium text-foreground">
              14:07 — Assuré notifié : sinistre accepté.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-400">
              <Clock className="size-4" />
              Traitement complet en 7 minutes
            </div>
            <Button asChild className="w-full">
              <Link to="/assurance/sinistres/clm-happy">Ouvrir le dossier</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/assurance/sinistres/clm-happy/analyse">Rejouer l’analyse IA</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-600" />
              Scénario 2 — Anomalie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Date déclarée 14/07 ≠ date constat 15/07.</p>
            <p>EXIF photos : 15/07/2026 10h30 — cohérent avec le constat uniquement.</p>
            <p className="font-medium text-foreground">
              Score de confiance : 35/100 · Risque élevé · Complément demandé
            </p>
            <p>Sans AutoClaim, cette incohérence aurait probablement été manquée.</p>
            <Button asChild className="w-full">
              <Link to="/assurance/sinistres/clm-anomaly">Ouvrir le dossier</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/assurance/sinistres/clm-anomaly/analyse">Rejouer l’analyse IA</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

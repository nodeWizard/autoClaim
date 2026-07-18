import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { claimsAtom, onboardingCompleteAtom } from '@/features/atoms'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const agentNames = [
  'Agent OCR',
  'Agent Vision',
  'Agent Contrat',
  'Agent Fraude',
  'Agent Risque',
  'Agent Rapport',
]

const roles = [
  'Gestionnaire sinistres auto',
  'Analyste fraude automobile',
  'Responsable indemnisation',
  'Expert technique STAR',
]

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const setOnboardingComplete = useSetAtom(onboardingCompleteAtom)
  const claims = useAtomValue(claimsAtom)
  const navigate = useNavigate()

  const firstClaimId =
    claims.find((c) => c.id === 'clm-happy')?.id ?? claims[0]?.id ?? 'clm-happy'

  const steps = [
    {
      title: 'Bienvenue sur AutoClaim',
      description:
        'Votre plateforme de gestion des sinistres automobile propulsée par l’IA. Configurons tout en moins d’une minute.',
      content: (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {agentNames.map((agent) => (
            <div
              key={agent}
              className="rounded-lg border bg-muted/50 p-3 text-center text-sm font-medium"
            >
              {agent}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Votre rôle et vos préférences',
      description:
        'Indiquez votre profil pour personnaliser les alertes et le tableau de bord.',
      content: (
        <div className="mt-4 space-y-3">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                'w-full rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5',
                selectedRole === role && 'border-primary bg-primary/5'
              )}
            >
              {role}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Prêt à démarrer',
      description:
        'Ouvrez un premier dossier pour voir la chaîne multi-agents AutoClaim en action.',
      content: (
        <div className="mt-4 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center">
          <p className="mb-2 text-sm font-medium">Sinistre démo : SIN-2026-0715-001</p>
          <p className="text-xs text-muted-foreground">
            Collision Tunis — 4 200 TND — score de confiance 92 %
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Profil : {selectedRole}</p>
        </div>
      ),
    },
  ]

  const finish = () => {
    setOnboardingComplete(true)
    navigate(`/assurance/sinistres/${firstClaimId}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center gradient-mesh p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            AC
          </div>
          <span className="text-lg font-bold">AutoClaim</span>
        </div>

        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/50' : 'w-4 bg-muted'
              )}
            />
          ))}
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="mb-2 text-xl font-bold">{steps[step].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[step].description}</p>
                {steps[step].content}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Retour
                </Button>
              ) : (
                <div />
              )}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continuer <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish}>
                  <CheckCircle2 className="h-4 w-4" /> Ouvrir le premier dossier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

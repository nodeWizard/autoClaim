import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { motion } from 'framer-motion'
import { Building2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { authAtom, onboardingCompleteAtom } from '@/features/atoms'
import { assureUser, gestionnaireUser } from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

export function LoginPage() {
  const [role, setRole] = useState<UserRole>('gestionnaire')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useSetAtom(authAtom)
  const onboardingComplete = useAtomValue(onboardingCompleteAtom)
  const navigate = useNavigate()

  function destinationFor(selected: UserRole) {
    if (selected === 'assure') return '/assure'
    return onboardingComplete ? '/assurance' : '/onboarding'
  }

  function login(e: React.FormEvent) {
    e.preventDefault()
    const user = role === 'assure' ? assureUser : gestionnaireUser
    setAuth({ isAuthenticated: true, user })
    toast.success(`Bienvenue, ${user.name}`)
    navigate(destinationFor(role))
  }

  function quickLogin(selected: UserRole) {
    const user = selected === 'assure' ? assureUser : gestionnaireUser
    setAuth({ isAuthenticated: true, user })
    toast.success(`Connecté en tant que ${user.name}`)
    navigate(destinationFor(selected))
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden gradient-mesh px-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-2xl border bg-card/90 p-8 shadow-xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            AC
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">AutoClaim</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sinistres automobile — de la déclaration à la décision en 7 minutes
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setRole('gestionnaire')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              role === 'gestionnaire' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            )}
          >
            <Building2 className="size-4" />
            Assurance
          </button>
          <button
            type="button"
            onClick={() => setRole('assure')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              role === 'assure' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            )}
          >
            <UserRound className="size-4" />
            Assuré
          </button>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder={role === 'assure' ? 'y.khelifi@email.tn' : 'sarra.mansouri@star.tn'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium">Mot de passe</label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Se connecter
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-muted-foreground">Accès rapide (prototype)</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => quickLogin('gestionnaire')}>
              Gestionnaire
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickLogin('assure')}>
              Assuré
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

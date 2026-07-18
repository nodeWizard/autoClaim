import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'
import { authAtom, onboardingCompleteAtom } from '@/features/atoms'
import type { UserRole } from '@/types'

function homeForRole(role: UserRole) {
  return role === 'assure' ? '/assure' : '/assurance'
}

export function ProtectedRoute() {
  const auth = useAtomValue(authAtom)
  if (!auth.isAuthenticated || !auth.user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AuthRoute() {
  const auth = useAtomValue(authAtom)
  const onboardingComplete = useAtomValue(onboardingCompleteAtom)
  if (auth.isAuthenticated && auth.user) {
    if (auth.user.role === 'gestionnaire' && !onboardingComplete) {
      return <Navigate to="/onboarding" replace />
    }
    return <Navigate to={homeForRole(auth.user.role)} replace />
  }
  return <Outlet />
}

export function RoleRoute({ role }: { role: UserRole }) {
  const auth = useAtomValue(authAtom)
  if (!auth.user) return <Navigate to="/login" replace />
  if (auth.user.role !== role) {
    return <Navigate to={homeForRole(auth.user.role)} replace />
  }
  return <Outlet />
}

/** Redirects gestionnaire users who have not finished onboarding. Assuré skips. */
export function OnboardingGuard() {
  const auth = useAtomValue(authAtom)
  const onboardingComplete = useAtomValue(onboardingCompleteAtom)
  if (auth.user?.role === 'gestionnaire' && !onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

/** Ensures only gestionnaire can access onboarding; redirects if already done. */
export function OnboardingRoute() {
  const auth = useAtomValue(authAtom)
  const onboardingComplete = useAtomValue(onboardingCompleteAtom)
  if (!auth.user) return <Navigate to="/login" replace />
  if (auth.user.role !== 'gestionnaire') {
    return <Navigate to={homeForRole(auth.user.role)} replace />
  }
  if (onboardingComplete) {
    return <Navigate to="/assurance" replace />
  }
  return <Outlet />
}

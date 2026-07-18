import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import {
  AuthRoute,
  OnboardingGuard,
  OnboardingRoute,
  ProtectedRoute,
  RoleRoute,
} from '@/app/guards'
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'
import { AssureHomePage } from '@/pages/assure/AssureHomePage'
import { DeclareClaimPage } from '@/pages/assure/DeclareClaimPage'
import { AssureClaimDetailPage } from '@/pages/assure/AssureClaimDetailPage'
import { AssureNotificationsPage } from '@/pages/assure/AssureNotificationsPage'
import { AssuranceDashboardPage } from '@/pages/assurance/AssuranceDashboardPage'
import { ClaimsListPage } from '@/pages/assurance/ClaimsListPage'
import { ClaimDetailPage } from '@/pages/assurance/ClaimDetailPage'
import { AssuranceNotificationsPage } from '@/pages/assurance/AssuranceNotificationsPage'
import { SettingsPage } from '@/pages/assurance/SettingsPage'
import { AnalyticsPage } from '@/pages/assurance/AnalyticsPage'
import { ReportsPage } from '@/pages/assurance/ReportsPage'
import { ReportDetailPage } from '@/pages/assurance/ReportDetailPage'
import { AnalysisPage } from '@/pages/analysis/AnalysisPage'

export const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <OnboardingRoute />,
        children: [{ path: '/onboarding', element: <OnboardingPage /> }],
      },
      {
        element: <RoleRoute role="assure" />,
        children: [
          {
            element: <AppShell role="assure" />,
            children: [
              { path: '/assure', element: <AssureHomePage /> },
              { path: '/assure/declarer', element: <DeclareClaimPage /> },
              { path: '/assure/sinistres/:id', element: <AssureClaimDetailPage /> },
              { path: '/assure/notifications', element: <AssureNotificationsPage /> },
            ],
          },
        ],
      },
      {
        element: <RoleRoute role="gestionnaire" />,
        children: [
          {
            element: <OnboardingGuard />,
            children: [
              {
                element: <AppShell role="gestionnaire" />,
                children: [
                  { path: '/assurance', element: <AssuranceDashboardPage /> },
                  { path: '/assurance/sinistres', element: <ClaimsListPage /> },
                  { path: '/assurance/sinistres/:id', element: <ClaimDetailPage /> },
                  { path: '/assurance/sinistres/:id/analyse', element: <AnalysisPage /> },
                  { path: '/assurance/analytique', element: <AnalyticsPage /> },
                  { path: '/assurance/rapports', element: <ReportsPage /> },
                  { path: '/assurance/rapports/:id', element: <ReportDetailPage /> },
                  { path: '/assurance/notifications', element: <AssuranceNotificationsPage /> },
                  { path: '/assurance/settings', element: <SettingsPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])

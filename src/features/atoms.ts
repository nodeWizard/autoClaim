import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { AgentStatus, Claim, User } from '@/types'
import { initialClaims } from '@/data/mock/claims'

export const themeAtom = atomWithStorage<'light' | 'dark'>('autoclaim-theme', 'light')

export const sidebarCollapsedAtom = atom(false)

export const authAtom = atomWithStorage<{ isAuthenticated: boolean; user: User | null }>(
  'autoclaim-auth',
  {
    isAuthenticated: false,
    user: null,
  }
)

export const onboardingCompleteAtom = atomWithStorage('autoclaim-onboarding', false)

export const claimsAtom = atomWithStorage<Claim[]>('autoclaim-claims', initialClaims)

export interface AnalysisState {
  claimId: string | null
  isRunning: boolean
  currentAgentIndex: number
  agentStatuses: Record<string, AgentStatus>
  agentProgress: Record<string, number>
  visibleFindings: Record<string, string[]>
  isComplete: boolean
}

export const analysisAtom = atom<AnalysisState>({
  claimId: null,
  isRunning: false,
  currentAgentIndex: -1,
  agentStatuses: {},
  agentProgress: {},
  visibleFindings: {},
  isComplete: false,
})

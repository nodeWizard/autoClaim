import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { AgentStatus, Claim, User } from '@/types'
import { initialClaims } from '@/data/mock/claims'
import { FRONT_DAMAGE_IMAGE, FRONT_DAMAGE_NAME } from '@/assets/demo'

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

/** Always point photo docs at the stable demo image (keep user data: URLs). One photo max. */
function hydrateClaimPhotos(claims: Claim[]): Claim[] {
  return claims.map((claim) => {
    let photoKept = false
    const documents = claim.documents.flatMap((doc) => {
      const isPhoto =
        doc.type === 'photo' || /\.(png|jpe?g|webp|gif)$/i.test(doc.name)

      if (!isPhoto) return [doc]

      if (doc.url?.startsWith('data:') || doc.url?.startsWith('blob:')) {
        if (photoKept) return []
        photoKept = true
        return [doc]
      }

      if (photoKept) return []
      photoKept = true
      return [
        {
          ...doc,
          type: 'photo' as const,
          name: FRONT_DAMAGE_NAME,
          url: FRONT_DAMAGE_IMAGE,
          mimeType: 'image/jpeg',
        },
      ]
    })

    if (!photoKept) {
      documents.push({
        id: `${claim.id}-photo`,
        name: FRONT_DAMAGE_NAME,
        type: 'photo',
        uploadedAt: claim.declaredAt,
        url: FRONT_DAMAGE_IMAGE,
        mimeType: 'image/jpeg',
      })
    }

    return { ...claim, documents }
  })
}

/** Merge missing seed claims into localStorage so new demo data appears after updates. */
function mergeSeedClaims(stored: Claim[]): Claim[] {
  const byId = new Map(stored.map((c) => [c.id, c]))
  for (const seed of initialClaims) {
    if (!byId.has(seed.id)) byId.set(seed.id, seed)
  }
  return hydrateClaimPhotos([...byId.values()])
}

const claimsStorage = {
  getItem(key: string, initialValue: Claim[]): Claim[] {
    const raw = localStorage.getItem(key)
    if (raw == null) return hydrateClaimPhotos(initialValue)
    try {
      const parsed = JSON.parse(raw) as Claim[]
      return mergeSeedClaims(Array.isArray(parsed) ? parsed : initialValue)
    } catch {
      return hydrateClaimPhotos(initialValue)
    }
  },
  setItem(key: string, value: Claim[]) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
  },
}

export const claimsAtom = atomWithStorage<Claim[]>(
  'autoclaim-claims',
  initialClaims,
  claimsStorage,
  { getOnInit: true }
)

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

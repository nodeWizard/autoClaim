import type { Claim, DocumentRef, User } from '@/types'

function guessDocType(name: string): DocumentRef['type'] {
  const lower = name.toLowerCase()
  if (lower.includes('constat')) return 'constat'
  if (lower.includes('facture') || lower.includes('devis')) return 'facture'
  if (/\.(jpg|jpeg|png|webp|gif)$/i.test(lower) || lower.includes('photo')) return 'photo'
  return 'autre'
}

export function createClaimFromDeclaration(input: {
  user: User
  incidentDate: string
  location: string
  plate: string
  cin: string
  policyNumber: string
  vehicleModel: string
  phone: string
  amount: number
  description: string
  files: File[]
}): Claim {
  const now = new Date()
  const id = `clm-${now.getTime()}`
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(now.getTime()).slice(-3)
  const declaredAt = now.toISOString()

  const documents: DocumentRef[] = input.files.map((file, index) => ({
    id: `${id}-doc-${index}`,
    name: file.name,
    type: guessDocType(file.name),
    uploadedAt: declaredAt,
  }))

  return {
    id,
    reference: `SIN-${y}${m}${d}-${seq}`,
    insureeName: input.user.name,
    insureeId: input.user.id,
    type: 'auto',
    title: `Sinistre automobile — ${input.vehicleModel}`,
    description: input.description,
    declaredAt,
    incidentDate: input.incidentDate,
    amount: input.amount,
    status: 'recu',
    riskScore: null,
    riskLevel: null,
    confidence: null,
    plate: input.plate.trim().toUpperCase(),
    cin: input.cin.trim(),
    policyNumber: input.policyNumber.trim().toUpperCase(),
    vehicleModel: input.vehicleModel.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    documents,
    timeline: [
      {
        id: `${id}-t1`,
        at: declaredAt,
        title: 'Déclaration soumise',
        description: `Dossier reçu avec ${documents.length} document(s). En attente d’analyse.`,
        visibleToAssure: true,
      },
    ],
    incoherences: [],
    agentFindings: [],
    recommendation: null,
  }
}

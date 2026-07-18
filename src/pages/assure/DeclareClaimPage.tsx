import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { FileUp, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { authAtom, claimsAtom } from '@/features/atoms'
import { createClaimFromDeclaration } from '@/features/claims'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FormFields = {
  incidentDate: string
  location: string
  plate: string
  cin: string
  policyNumber: string
  vehicleModel: string
  phone: string
  amount: string
  description: string
}

type FormErrors = Partial<Record<keyof FormFields | 'files', string>>

const emptyForm: FormFields = {
  incidentDate: '',
  location: '',
  plate: '',
  cin: '',
  policyNumber: '',
  vehicleModel: '',
  phone: '',
  amount: '',
  description: '',
}

function validate(values: FormFields, files: File[]): FormErrors {
  const errors: FormErrors = {}

  if (!values.cin.trim()) errors.cin = 'Ce champ est obligatoire.'
  else if (!/^\d{8}$/.test(values.cin.trim())) {
    errors.cin = 'Le numéro CIN doit contenir 8 chiffres.'
  }

  if (!values.policyNumber.trim()) errors.policyNumber = 'Ce champ est obligatoire.'
  else if (values.policyNumber.trim().length < 6) {
    errors.policyNumber = 'Numéro de police trop court (min. 6 caractères).'
  }

  if (!values.phone.trim()) errors.phone = 'Ce champ est obligatoire.'
  else if (!/^(?:\+216|216)?[2-9]\d{7}$/.test(values.phone.replace(/[\s.-]/g, ''))) {
    errors.phone = 'Format attendu : 20 123 456 ou +216 20 123 456'
  }

  if (!values.vehicleModel.trim()) errors.vehicleModel = 'Ce champ est obligatoire.'

  if (!values.plate.trim()) errors.plate = 'Ce champ est obligatoire.'
  else if (!/^[0-9]{1,4}\s?[A-Z]{2}\s?[0-9]{1,4}$/i.test(values.plate.trim())) {
    errors.plate = 'Format attendu : 123 TU 4567'
  }

  if (!values.incidentDate.trim()) errors.incidentDate = 'Ce champ est obligatoire.'
  if (!values.location.trim()) errors.location = 'Ce champ est obligatoire.'

  if (!values.amount.trim()) errors.amount = 'Ce champ est obligatoire.'
  else {
    const amount = Number(values.amount.replace(',', '.'))
    if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Indiquez un montant valide supérieur à 0.'
    }
  }

  if (!values.description.trim()) errors.description = 'Ce champ est obligatoire.'
  else if (values.description.trim().length < 20) {
    errors.description = 'Décrivez l’accident en au moins 20 caractères.'
  }

  if (files.length === 0) {
    errors.files = 'Ajoutez au moins un document (constat, photo ou facture).'
  }

  return errors
}

type FieldKey = keyof FormFields | 'files'
type TouchedFields = Partial<Record<FieldKey, boolean>>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">{message}</p>
}

export function DeclareClaimPage() {
  const navigate = useNavigate()
  const auth = useAtomValue(authAtom)
  const setClaims = useSetAtom(claimsAtom)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState<FormFields>(emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const [touched, setTouched] = useState<TouchedFields>({})
  const [dragOver, setDragOver] = useState(false)

  const errors = validate(values, files)
  const isValid = Object.keys(errors).length === 0

  function showError(key: FieldKey) {
    return touched[key] ? errors[key] : undefined
  }

  function markTouched(key: FieldKey) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list)
    setFiles((prev) => {
      const next = [...prev]
      for (const file of incoming) {
        if (!next.some((f) => f.name === file.name && f.size === file.size)) {
          next.push(file)
        }
      }
      return next
    })
    markTouched('files')
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    markTouched('files')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting || !auth.user) return

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))

    const claim = createClaimFromDeclaration({
      user: auth.user,
      incidentDate: values.incidentDate,
      location: values.location,
      plate: values.plate,
      cin: values.cin,
      policyNumber: values.policyNumber,
      vehicleModel: values.vehicleModel,
      phone: values.phone,
      amount: Number(values.amount.replace(',', '.')),
      description: values.description,
      files,
    })

    setClaims((prev) => [claim, ...prev])
    toast.success(`Sinistre ${claim.reference} créé`)
    setSubmitting(false)
    navigate(`/assure/sinistres/${claim.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Déclarer un sinistre automobile"
        description="Renseignez les informations de l’assuré, du véhicule et du sinistre."
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dossier automobile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Type de sinistre : <span className="font-medium text-foreground">Automobile</span>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Identité de l’assuré
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="cin">
                    Numéro CIN <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="cin"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="09876543"
                    value={values.cin}
                    error={Boolean(showError('cin'))}
                    onBlur={() => markTouched('cin')}
                    onChange={(e) => updateField('cin', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                  <FieldError message={showError('cin')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">
                    Téléphone <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+216 20 123 456"
                    value={values.phone}
                    error={Boolean(showError('phone'))}
                    onBlur={() => markTouched('phone')}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                  <FieldError message={showError('phone')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="policyNumber">
                    Numéro de police <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="policyNumber"
                    placeholder="POL-AUTO-2026-00421"
                    value={values.policyNumber}
                    error={Boolean(showError('policyNumber'))}
                    onBlur={() => markTouched('policyNumber')}
                    onChange={(e) => updateField('policyNumber', e.target.value.toUpperCase())}
                  />
                  <FieldError message={showError('policyNumber')} />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Véhicule
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="vehicleModel">
                    Marque et modèle <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="vehicleModel"
                    placeholder="Peugeot 208"
                    value={values.vehicleModel}
                    error={Boolean(showError('vehicleModel'))}
                    onBlur={() => markTouched('vehicleModel')}
                    onChange={(e) => updateField('vehicleModel', e.target.value)}
                  />
                  <FieldError message={showError('vehicleModel')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="plate">
                    Immatriculation <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="plate"
                    placeholder="123 TU 4567"
                    value={values.plate}
                    error={Boolean(showError('plate'))}
                    onBlur={() => markTouched('plate')}
                    onChange={(e) => updateField('plate', e.target.value.toUpperCase())}
                  />
                  <FieldError message={showError('plate')} />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sinistre
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="incidentDate">
                    Date de l’incident <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={values.incidentDate}
                    error={Boolean(showError('incidentDate'))}
                    onBlur={() => markTouched('incidentDate')}
                    onChange={(e) => updateField('incidentDate', e.target.value)}
                  />
                  <FieldError message={showError('incidentDate')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="location">
                    Lieu de l’accident <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="location"
                    placeholder="Ville, adresse…"
                    value={values.location}
                    error={Boolean(showError('location'))}
                    onBlur={() => markTouched('location')}
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                  <FieldError message={showError('location')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="amount">
                    Montant estimé (TND) <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="amount"
                    inputMode="decimal"
                    placeholder="4200"
                    value={values.amount}
                    error={Boolean(showError('amount'))}
                    onBlur={() => markTouched('amount')}
                    onChange={(e) => updateField('amount', e.target.value.replace(/[^\d.,]/g, ''))}
                  />
                  <FieldError message={showError('amount')} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium" htmlFor="description">
                    Description de l’accident <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={values.description}
                    onBlur={() => markTouched('description')}
                    onChange={(e) => updateField('description', e.target.value)}
                    aria-invalid={Boolean(showError('description')) || undefined}
                    className={cn(
                      'min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2',
                      showError('description')
                        ? 'border-2 border-red-500 focus-visible:ring-red-500'
                        : 'border border-input focus-visible:ring-ring'
                    )}
                    placeholder="Décrivez l’accident et les dommages visibles…"
                  />
                  <FieldError message={showError('description')} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Documents <span className="text-red-600">*</span>
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
                  else markTouched('files')
                }}
                className={cn(
                  'rounded-lg border border-dashed p-6 text-center transition-colors',
                  dragOver && !showError('files') && 'border-primary bg-primary/5',
                  showError('files')
                    ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-input'
                )}
              >
                <Upload className="mx-auto mb-2 size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Glissez-déposez le constat, les photos ou les factures
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    markTouched('files')
                    fileInputRef.current?.click()
                  }}
                >
                  <FileUp className="size-4" />
                  Choisir des fichiers
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) addFiles(e.target.files)
                    else markTouched('files')
                    e.target.value = ''
                  }}
                />
              </div>
              <FieldError message={showError('files')} />

              {files.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                    >
                      <span className="truncate">
                        {file.name}{' '}
                        <span className="text-muted-foreground">
                          ({Math.max(1, Math.round(file.size / 1024))} Ko)
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-600 hover:text-red-700"
                        onClick={() => removeFile(index)}
                        aria-label={`Supprimer ${file.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <Button type="submit" disabled={!isValid || submitting} className="w-full" size="lg">
              {submitting ? 'Envoi en cours…' : 'Soumettre la déclaration'}
            </Button>
            {!isValid ? (
              <p className="text-center text-sm text-muted-foreground">
                Remplissez tous les champs obligatoires pour activer le bouton.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

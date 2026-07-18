import { ExternalLink, FileText, ImageIcon } from 'lucide-react'
import type { DocumentRef } from '@/types'
import { FRONT_DAMAGE_IMAGE } from '@/assets/demo'
import { formatDate, cn } from '@/lib/utils'

function isImage(doc: DocumentRef) {
  if (doc.mimeType?.startsWith('image/')) return true
  if (doc.type === 'photo') return true
  return /\.(png|jpe?g|webp|gif|bmp)$/i.test(doc.name)
}

/** Resolve a displayable image URL for a document (fallback to demo damage photo). */
export function documentImageUrl(doc: DocumentRef): string | undefined {
  if (doc.url?.startsWith('data:') || doc.url?.startsWith('blob:')) return doc.url
  if (doc.url?.startsWith('/') || doc.url?.startsWith('http')) return doc.url
  if (isImage(doc)) return FRONT_DAMAGE_IMAGE
  return doc.url
}

export function DocumentsList({
  documents,
  emptyLabel = 'Aucun document.',
  /** When true, skip image thumbnails (photo already shown above). */
  hideImagePreviews = false,
}: {
  documents: DocumentRef[]
  emptyLabel?: string
  hideImagePreviews?: boolean
}) {
  if (!documents.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  // One entry per unique file name/url so the same photo is not listed repeatedly
  const seen = new Set<string>()
  const unique = documents.filter((doc) => {
    const key = `${doc.type}:${doc.url ?? doc.name}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <ul className="space-y-3">
      {unique.map((doc) => {
        const image = isImage(doc)
        const href = documentImageUrl(doc)
        const showPreview = Boolean(href && image && !hideImagePreviews)

        return (
          <li
            key={doc.id}
            className={cn(
              'overflow-hidden rounded-xl border bg-card',
              href && 'hover:border-primary/30'
            )}
          >
            {showPreview ? (
              <a href={href} target="_blank" rel="noreferrer" className="block">
                <img
                  src={href}
                  alt={doc.name}
                  className="h-52 w-full object-cover bg-muted"
                />
              </a>
            ) : null}
            <div className="flex items-center gap-3 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                {image ? (
                  <ImageIcon className="size-4 text-muted-foreground" />
                ) : (
                  <FileText className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</p>
              </div>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Ouvrir"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Large photo for the top of a sinistre detail page (one image only). */
export function ClaimPhotos({ documents }: { documents: DocumentRef[] }) {
  const photos = documents.filter(isImage)
  const src =
    photos.map((d) => documentImageUrl(d)).find(Boolean) ?? FRONT_DAMAGE_IMAGE

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-xl border bg-muted"
    >
      <img src={src} alt="Photo du sinistre" className="h-64 w-full object-cover" />
    </a>
  )
}

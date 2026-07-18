import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClaimStatus, RiskLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export const statusLabels: Record<ClaimStatus, string> = {
  recu: 'Reçu',
  en_analyse: 'En analyse',
  complement: 'Complément demandé',
  accepte: 'Accepté',
  refuse: 'Refusé',
  fraude: 'Transféré fraude',
}

export const riskLabels: Record<RiskLevel, string> = {
  faible: 'Faible',
  moyen: 'Moyen',
  eleve: 'Élevé',
  critique: 'Critique',
}

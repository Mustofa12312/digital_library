// Utility functions

export const STATUS_LABELS = {
  pending: 'Pending',
  under_review: 'Sedang Direview',
  accepted: 'Diterima',
  revision: 'Revisi',
  rejected: 'Ditolak',
  published: 'Dipublikasikan',
}

export const STATUS_ICONS = {
  pending: '⏳',
  under_review: '🔍',
  accepted: '✅',
  revision: '✏️',
  rejected: '❌',
  published: '🌐',
}

export const DECISION_LABELS = {
  accept: 'Diterima',
  minor_revision: 'Revisi Minor',
  major_revision: 'Revisi Mayor',
  reject: 'Ditolak',
}

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  reviewer: 'Reviewer',
  author: 'Author',
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function truncate(text, len = 100) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

export function getInitials(name) {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
}

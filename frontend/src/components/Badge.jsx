import { STATUS_LABELS, ROLE_LABELS, DECISION_LABELS } from '../utils/helpers'

const statusClasses = {
  pending: 'badge-pending',
  under_review: 'badge-under_review',
  accepted: 'badge-accepted',
  revision: 'badge-revision',
  rejected: 'badge-rejected',
  published: 'badge-published',
}

const roleClasses = {
  super_admin: 'badge-super_admin',
  admin: 'badge-admin',
  reviewer: 'badge-reviewer',
  author: 'badge-author',
}

const decisionClasses = {
  accept: 'badge bg-green-100 text-green-800',
  minor_revision: 'badge bg-orange-100 text-orange-800',
  major_revision: 'badge bg-red-100 text-red-800',
  reject: 'badge bg-gray-100 text-gray-800',
}

export function StatusBadge({ status }) {
  return (
    <span className={statusClasses[status] || 'badge bg-gray-100 text-gray-600'}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function RoleBadge({ role }) {
  return (
    <span className={roleClasses[role] || 'badge bg-gray-100 text-gray-600'}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

export function DecisionBadge({ decision }) {
  return (
    <span className={decisionClasses[decision] || 'badge bg-gray-100 text-gray-600'}>
      {DECISION_LABELS[decision] || decision}
    </span>
  )
}

import { cn } from '@/lib/utils'
import type { AppointmentStatus, InvoiceStatus, QueueStatus } from '@/types'

type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'in-progress'
  | 'paid'
  | 'overdue'
  | 'waiting'
  | 'done'
  | 'active'
  | 'inactive'
  | 'default'

type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  confirmed: 'bg-success-50 text-success-700 border-success-100',
  pending: 'bg-warning-50 text-warning-600 border-warning-100',
  completed: 'bg-accent-50 text-accent-700 border-accent-100',
  cancelled: 'bg-danger-50 text-danger-700 border-danger-100',
  'in-progress': 'bg-primary-50 text-primary-700 border-primary-100',
  paid: 'bg-success-50 text-success-700 border-success-100',
  overdue: 'bg-danger-50 text-danger-700 border-danger-100',
  waiting: 'bg-warning-50 text-warning-600 border-warning-100',
  done: 'bg-success-50 text-success-700 border-success-100',
  active: 'bg-success-50 text-success-700 border-success-100',
  inactive: 'bg-surface-100 text-foreground-muted border-border',
  default: 'bg-surface-100 text-foreground-secondary border-border',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const labels: Record<AppointmentStatus, string> = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return <Badge variant={status}>{labels[status]}</Badge>
}

export function InvoiceBadge({ status }: { status: InvoiceStatus }) {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  }
  return <Badge variant={status}>{labels[status]}</Badge>
}

export function QueueBadge({ status }: { status: QueueStatus }) {
  const labels: Record<QueueStatus, string> = {
    waiting: 'Waiting',
    'in-progress': 'In Progress',
    done: 'Done',
  }
  return <Badge variant={status}>{labels[status]}</Badge>
}

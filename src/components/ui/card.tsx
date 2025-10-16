import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ComponentChildren
  class?: string
}

export function Card({ children, class: className }: CardProps) {
  return (
    <div class={cn('bg-plaxo-surface border border-plaxo-border shadow-soft rounded-xl', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, class: className }: CardProps) {
  return (
    <div class={cn('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, class: className }: CardProps) {
  return (
    <div class={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, class: className }: CardProps) {
  return (
    <h3 class={cn('text-xl font-display font-semibold text-plaxo-text', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, class: className }: CardProps) {
  return (
    <p class={cn('text-plaxo-text-secondary mt-2', className)}>
      {children}
    </p>
  )
}
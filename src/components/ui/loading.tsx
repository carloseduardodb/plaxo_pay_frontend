import { cn } from '../../lib/utils'

interface LoadingProps {
  class?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ class: className, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div class={cn('flex items-center justify-center', className)}>
      <div class={cn(
        'animate-spin rounded-full border-2 border-plaxo-border border-t-plaxo-primary',
        sizeClasses[size]
      )} />
    </div>
  )
}
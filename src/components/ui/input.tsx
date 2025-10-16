import { ComponentProps } from 'preact'
import { cn } from '../../lib/utils'

interface InputProps extends ComponentProps<'input'> {
  class?: string
}

export function Input({ class: className, ...props }: InputProps) {
  return (
    <input
      class={cn(
        'flex h-10 w-full rounded-md border border-plaxo-border bg-plaxo-background px-3 py-2 text-sm text-plaxo-text placeholder:text-plaxo-text-secondary focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
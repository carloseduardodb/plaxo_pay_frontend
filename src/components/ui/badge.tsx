import { ComponentChildren } from 'preact'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:shadow-focus',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-plaxo-primary text-black',
        secondary: 'border-transparent bg-plaxo-surface text-plaxo-text',
        destructive: 'border-transparent bg-plaxo-error text-white',
        success: 'border-transparent bg-plaxo-success text-white',
        warning: 'border-transparent bg-plaxo-warning text-black',
        outline: 'text-plaxo-text border-plaxo-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ComponentChildren
  class?: string
}

export function Badge({ children, variant, class: className }: BadgeProps) {
  return (
    <div class={cn(badgeVariants({ variant }), className)}>
      {children}
    </div>
  )
}
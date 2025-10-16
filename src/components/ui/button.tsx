import { ComponentChildren } from 'preact'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plaxo-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-plaxo-primary text-black hover:bg-plaxo-primary-hover',
        destructive: 'bg-plaxo-error text-white hover:bg-plaxo-error/90',
        outline: 'border border-plaxo-border bg-transparent hover:bg-plaxo-surface',
        secondary: 'bg-plaxo-surface text-plaxo-text hover:bg-plaxo-surface/80',
        ghost: 'hover:bg-plaxo-surface hover:text-plaxo-text',
        link: 'text-plaxo-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ComponentChildren
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

export function Button({ 
  children, 
  variant, 
  size, 
  onClick, 
  disabled, 
  type = 'button',
  class: className,
  ...props 
}: ButtonProps) {
  return (
    <button
      type={type}
      class={cn(buttonVariants({ variant, size }), className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
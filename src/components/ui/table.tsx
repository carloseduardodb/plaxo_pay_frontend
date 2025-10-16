import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

interface TableProps {
  children: ComponentChildren
  class?: string
}

export function Table({ children, class: className }: TableProps) {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn('w-full caption-bottom text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, class: className }: TableProps) {
  return (
    <thead class={cn('[&_tr]:border-b border-plaxo-border', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, class: className }: TableProps) {
  return (
    <tbody class={cn('[&_tr:last-child]:border-0', className)}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, class: className }: TableProps) {
  return (
    <tr class={cn('border-b border-plaxo-border transition-colors hover:bg-plaxo-surface/50', className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, class: className }: TableProps) {
  return (
    <th class={cn('h-12 px-4 text-left align-middle font-medium text-plaxo-text-secondary', className)}>
      {children}
    </th>
  )
}

export function TableCell({ children, class: className }: TableProps) {
  return (
    <td class={cn('p-4 align-middle text-plaxo-text', className)}>
      {children}
    </td>
  )
}
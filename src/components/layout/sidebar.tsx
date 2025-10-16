import { route } from 'preact-router'
import { MdDashboard, MdApps, MdPayment, MdSubscriptions } from 'react-icons/md'

interface SidebarProps {
  currentPath: string
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: MdDashboard },
  { name: 'Aplicações', href: '/applications', icon: MdApps },
  { name: 'Pagamentos', href: '/payments', icon: MdPayment },
  { name: 'Assinaturas', href: '/subscriptions', icon: MdSubscriptions },
]

export function Sidebar({ currentPath }: SidebarProps) {
  return (
    <div class="w-64 bg-plaxo-surface border-r border-plaxo-border h-screen flex flex-col">
      {/* Logo */}
      <div class="p-6 border-b border-plaxo-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-plaxo-primary rounded-xl flex items-center justify-center">
            <span class="text-plaxo-background font-display font-bold text-lg">P</span>
          </div>
          <div>
            <h2 class="text-xl font-display font-bold text-plaxo-text">
              Plaxo Pay
            </h2>
            <p class="text-xs text-plaxo-text-secondary">
              Central de Pagamentos
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav class="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href
          return (
            <button
              key={item.name}
              onClick={() => route(item.href)}
              class={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-plaxo-primary text-plaxo-background shadow-soft'
                  : 'text-plaxo-text hover:bg-plaxo-background hover:text-plaxo-primary'
              }`}
            >
              <span class={`mr-3 text-lg transition-transform group-hover:scale-110 ${
                isActive ? '' : 'group-hover:animate-pulse'
              }`}>
                <item.icon />
              </span>
              <span class="font-medium">{item.name}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div class="p-4 border-t border-plaxo-border">
        <div class="text-center">
          <p class="text-xs text-plaxo-text-secondary">
            Plaxo © 2024
          </p>
          <p class="text-xs text-plaxo-text-secondary">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
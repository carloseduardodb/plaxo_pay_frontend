import { Button } from '../ui/button'
import { useAuth } from '../../contexts/auth-context'
import { MdLogout } from 'react-icons/md'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header class="bg-plaxo-surface border-b border-plaxo-border px-6 py-4 shadow-soft">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-plaxo-success rounded-full animate-pulse"></div>
            <span class="text-plaxo-text-secondary text-sm font-medium">
              Sistema Online
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 bg-plaxo-background px-4 py-2 rounded-xl">
            <div class="w-8 h-8 bg-plaxo-primary rounded-lg flex items-center justify-center">
              <span class="text-plaxo-background font-display font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div class="text-right">
              <p class="text-plaxo-text text-sm font-medium">
                {user?.name}
              </p>
              <p class="text-plaxo-text-secondary text-xs">
                Administrador
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            class="border-plaxo-border text-plaxo-text hover:bg-plaxo-background hover:text-plaxo-primary flex items-center gap-2"
          >
            <span class="text-base"><MdLogout /></span>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
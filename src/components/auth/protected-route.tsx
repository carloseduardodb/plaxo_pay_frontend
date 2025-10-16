import { ComponentChildren } from 'preact'
import { useAuth } from '../../contexts/auth-context'
import { Login } from '../../pages/Login'
import { Loading } from '../ui/loading'

interface ProtectedRouteProps {
  children: ComponentChildren
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div class="min-h-screen bg-plaxo-background flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <>{children}</>
}
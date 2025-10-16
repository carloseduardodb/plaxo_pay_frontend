import { useState } from 'preact/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../contexts/auth-context'
import { MdError } from 'react-icons/md'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(username, password)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="min-h-screen bg-plaxo-background flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        {/* Logo and Brand */}
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-plaxo-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <span class="text-plaxo-background font-display font-bold text-3xl">P</span>
          </div>
          <h1 class="text-4xl font-display font-bold text-plaxo-text mb-2">
            Plaxo Pay
          </h1>
          <p class="text-plaxo-text-secondary">
            Central de pagamentos inteligente
          </p>
        </div>

        <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
          <CardHeader class="text-center pb-4">
            <CardTitle class="text-xl font-display font-bold text-plaxo-text">
              Fazer Login
            </CardTitle>
            <p class="text-plaxo-text-secondary text-sm">
              Entre com suas credenciais de administrador
            </p>
          </CardHeader>
          <CardContent class="p-6">
            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-plaxo-text mb-2">
                  Usuário
                </label>
                <Input
                  value={username}
                  onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
                  placeholder="admin"
                  class="bg-plaxo-background border-plaxo-border focus:border-plaxo-primary focus:shadow-focus"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-plaxo-text mb-2">
                  Senha
                </label>
                <Input
                  type="password"
                  value={password}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  placeholder="••••••••"
                  class="bg-plaxo-background border-plaxo-border focus:border-plaxo-primary focus:shadow-focus"
                  required
                />
              </div>

              {error && (
                <div class="bg-plaxo-error/10 border border-plaxo-error/20 rounded-xl p-4">
                  <div class="flex items-center gap-3">
                    <span class="text-plaxo-error text-lg"><MdError /></span>
                    <p class="text-plaxo-error text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                class="w-full bg-plaxo-primary hover:bg-plaxo-primary-hover text-plaxo-background font-display font-bold py-3 rounded-xl transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-plaxo-background/30 border-t-plaxo-background rounded-full animate-spin"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div class="text-center mt-8">
          <p class="text-plaxo-text-secondary text-sm">
            Plaxo © 2024 - Central de aplicativos inteligentes
          </p>
        </div>
      </div>
    </div>
  )
}
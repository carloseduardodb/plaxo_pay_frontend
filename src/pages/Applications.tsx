import { useState } from 'preact/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useApplications } from '../hooks/use-applications'
import { applicationApi } from '../lib/api-client'
import { MdAdd, MdApps, MdRocketLaunch, MdContentCopy } from 'react-icons/md'

export function Applications() {
  const { applications, isLoading, refresh } = useApplications()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await applicationApi.create(formData)
      setFormData({ name: '', description: '' })
      setShowForm(false)
      refresh()
    } catch (error) {
      console.error('Erro ao criar aplicação:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div class="min-h-screen bg-plaxo-background p-6">
      {/* Header */}
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-bold text-plaxo-text mb-2">
            Aplicações
          </h1>
          <p class="text-plaxo-text-secondary">
            Gerencie as aplicações que utilizam o Plaxo Pay
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          class="bg-plaxo-primary hover:bg-plaxo-primary-hover text-plaxo-background font-display font-bold flex items-center gap-2"
        >
          {showForm ? (
            'Cancelar'
          ) : (
            <>
              <span class="text-lg"><MdAdd /></span>
              Nova Aplicação
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card class="bg-plaxo-surface border-plaxo-border shadow-soft mb-6">
          <CardHeader>
            <CardTitle class="text-plaxo-text">Nova Aplicação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-plaxo-text mb-2">
                  Nome da Aplicação
                </label>
                <Input
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
                  placeholder="Ex: Plaxo Atas"
                  class="bg-plaxo-background border-plaxo-border focus:border-plaxo-primary"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-plaxo-text mb-2">
                  Descrição
                </label>
                <Input
                  value={formData.description}
                  onInput={(e) => setFormData({ ...formData, description: (e.target as HTMLInputElement).value })}
                  placeholder="Descrição da aplicação"
                  class="bg-plaxo-background border-plaxo-border focus:border-plaxo-primary"
                />
              </div>
              <div class="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  class="bg-plaxo-primary hover:bg-plaxo-primary-hover text-plaxo-background"
                >
                  {isSubmitting ? 'Criando...' : 'Criar Aplicação'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  class="border-plaxo-border text-plaxo-text hover:bg-plaxo-surface"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div class="col-span-full text-center py-12">
            <div class="w-8 h-8 border-2 border-plaxo-primary/30 border-t-plaxo-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-plaxo-text-secondary">Carregando aplicações...</p>
          </div>
        ) : applications.length === 0 ? (
          <div class="col-span-full text-center py-12">
            <div class="w-16 h-16 bg-plaxo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-plaxo-primary text-3xl"><MdApps /></span>
            </div>
            <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
              Nenhuma aplicação encontrada
            </h3>
            <p class="text-plaxo-text-secondary mb-4">
              Crie sua primeira aplicação para começar a gerenciar pagamentos
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              class="bg-plaxo-primary hover:bg-plaxo-primary-hover text-plaxo-background flex items-center gap-2"
            >
              <span class="text-lg"><MdAdd /></span>
              Criar Primeira Aplicação
            </Button>
          </div>
        ) : (
          applications.map((app) => (
            <Card key={app.id} class="bg-plaxo-surface border-plaxo-border shadow-soft hover:shadow-lg transition-shadow">
              <CardContent class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-12 h-12 bg-plaxo-primary/20 rounded-xl flex items-center justify-center">
                    <span class="text-plaxo-primary text-xl"><MdRocketLaunch /></span>
                  </div>
                </div>
                <h3 class="text-lg font-display font-bold text-plaxo-text mb-2">
                  {app.name}
                </h3>
                {app.description && (
                  <p class="text-plaxo-text-secondary text-sm mb-4">
                    {app.description}
                  </p>
                )}
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between bg-plaxo-background px-3 py-2 rounded-lg">
                    <div>
                      <p class="text-xs text-plaxo-text-secondary mb-1">ID</p>
                      <p class="text-xs font-mono text-plaxo-text">{app.id}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(app.id, `id-${app.id}`)}
                      class="border-plaxo-border text-plaxo-text hover:bg-plaxo-surface"
                    >
                      <span class="text-sm">{copiedId === `id-${app.id}` ? '✓' : <MdContentCopy />}</span>
                    </Button>
                  </div>
                </div>
                <div class="text-xs text-plaxo-text-secondary">
                  Criado em: {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
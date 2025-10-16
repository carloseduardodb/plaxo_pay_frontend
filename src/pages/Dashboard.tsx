import { useState } from 'preact/hooks'
import { Card, CardContent } from '../components/ui/card'
import { useApplications, Application } from '../hooks/use-applications'
import { usePayments } from '../hooks/use-payments'
import { useSubscriptions } from '../hooks/use-subscriptions'
import { formatCurrency } from '../lib/utils'
import { MdAttachMoney, MdSubscriptions, MdTrendingUp, MdApps } from 'react-icons/md'

export function Dashboard() {
  const { applications } = useApplications()
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  
  const { payments, isLoading: paymentsLoading } = usePayments(selectedAppId)
  const { subscriptions, isLoading: subscriptionsLoading } = useSubscriptions(selectedAppId)

  const totalRevenue = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + parseFloat(p.amount?.amount || '0'), 0)

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length
  const todayPayments = payments.filter(p => 
    new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length

  return (
    <div class="min-h-screen bg-plaxo-background p-6">
      {/* Header */}
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-plaxo-primary rounded-xl flex items-center justify-center">
            <span class="text-plaxo-background font-display font-bold text-lg">P</span>
          </div>
          <div>
            <h1 class="text-3xl font-display font-bold text-plaxo-text">
              Plaxo Pay
            </h1>
            <p class="text-plaxo-text-secondary">
              Central de pagamentos inteligente
            </p>
          </div>
        </div>
        
        {/* App Selector */}
        <div class="bg-plaxo-surface border border-plaxo-border rounded-xl p-4">
          <label class="block text-sm font-medium text-plaxo-text mb-2">
            Selecione uma aplicação:
          </label>
          <select 
            class="bg-plaxo-background border border-plaxo-border rounded-lg px-3 py-2 text-plaxo-text focus:outline-none focus:shadow-focus"
            value={selectedAppId}
            onChange={(e) => setSelectedAppId((e.target as HTMLSelectElement).value)}
          >
            <option value="">Selecione uma aplicação</option>
            {applications.map((app: Application) => (
              <option key={app.id} value={app.id}>{app.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedAppId ? (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-plaxo-primary/20 rounded-xl flex items-center justify-center">
                  <span class="text-plaxo-primary text-2xl"><MdAttachMoney /></span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-plaxo-text-secondary">Receita Total</p>
                  <p class="text-2xl font-display font-bold text-plaxo-primary">
                    {paymentsLoading ? '...' : formatCurrency(totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-plaxo-success/20 rounded-xl flex items-center justify-center">
                  <span class="text-plaxo-success text-2xl"><MdSubscriptions /></span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-plaxo-text-secondary">Assinaturas Ativas</p>
                  <p class="text-2xl font-display font-bold text-plaxo-success">
                    {subscriptionsLoading ? '...' : activeSubscriptions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Payments */}
          <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-plaxo-warning/20 rounded-xl flex items-center justify-center">
                  <span class="text-plaxo-warning text-2xl"><MdTrendingUp /></span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-plaxo-text-secondary">Pagamentos Hoje</p>
                  <p class="text-2xl font-display font-bold text-plaxo-text">
                    {paymentsLoading ? '...' : todayPayments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div class="bg-plaxo-surface border border-plaxo-border rounded-xl p-8 text-center">
          <div class="w-16 h-16 bg-plaxo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-plaxo-primary text-3xl"><MdApps /></span>
          </div>
          <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
            Selecione uma aplicação
          </h3>
          <p class="text-plaxo-text-secondary">
            Escolha uma aplicação acima para visualizar seus dados de pagamento
          </p>
        </div>
      )}
    </div>
  )
}
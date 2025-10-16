import { useState } from 'preact/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useSubscriptions } from '../hooks/use-subscriptions'
import { useApplications } from '../hooks/use-applications'
import { formatCurrency, formatDate } from '../lib/utils'
import { subscriptionApi, paymentApi } from '../lib/api-client'
import { MdSubscriptions, MdApps, MdCancel, MdPause, MdPayment } from 'react-icons/md'

export function Subscriptions() {
  const { applications } = useApplications()
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const { subscriptions, isLoading, error, refresh } = useSubscriptions(selectedAppId)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showPayments, setShowPayments] = useState<string | null>(null)
  const [subscriptionPayments, setSubscriptionPayments] = useState<any[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)

  const handleViewPayments = async (subscriptionId: string) => {
    if (showPayments === subscriptionId) {
      setShowPayments(null)
      return
    }

    setPaymentsLoading(true)
    try {
      const response = await paymentApi.getBySubscription(subscriptionId)
      setSubscriptionPayments(response.data)
      setShowPayments(subscriptionId)
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    setActionLoading(id)
    try {
      await subscriptionApi.cancel(id)
      refresh()
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (id: string) => {
    setActionLoading(id)
    try {
      await subscriptionApi.suspend(id)
      refresh()
    } catch (error) {
      console.error('Erro ao suspender assinatura:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success' as const
      case 'cancelled': return 'destructive' as const
      case 'suspended': return 'warning' as const
      case 'expired': return 'secondary' as const
      default: return 'secondary' as const
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa'
      case 'cancelled': return 'Cancelada'
      case 'suspended': return 'Suspensa'
      case 'expired': return 'Expirada'
      default: return status
    }
  }

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success' as const
      case 'pending': return 'warning' as const
      default: return 'destructive' as const
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      default: return 'Rejeitado'
    }
  }

  if (error) {
    return (
      <div class="p-6">
        <Card>
          <CardContent class="text-center py-8">
            <p class="text-plaxo-error">Erro ao carregar assinaturas</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div class="min-h-screen bg-plaxo-background p-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-plaxo-success/20 rounded-xl flex items-center justify-center">
            <span class="text-plaxo-success text-2xl"><MdSubscriptions /></span>
          </div>
          <div>
            <h1 class="text-3xl font-display font-bold text-plaxo-text">
              Assinaturas
            </h1>
            <p class="text-plaxo-text-secondary">
              Gerencie assinaturas por aplicação
            </p>
          </div>
        </div>
      </div>

      {/* App Selector */}
      <Card class="bg-plaxo-surface border-plaxo-border shadow-soft mb-6">
        <CardContent class="p-4">
          <div class="flex items-center gap-4">
            <span class="text-plaxo-primary text-xl"><MdApps /></span>
            <div class="flex-1">
              <label class="block text-sm font-medium text-plaxo-text mb-2">
                Selecione uma aplicação:
              </label>
              <select
                class="bg-plaxo-background border border-plaxo-border rounded-lg px-3 py-2 text-plaxo-text focus:outline-none focus:shadow-focus w-full max-w-md"
                value={selectedAppId}
                onChange={(e) => setSelectedAppId((e.target as HTMLSelectElement).value)}
              >
                <option value="">Selecione uma aplicação</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedAppId ? (
        <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
          <CardHeader>
            <CardTitle class="text-plaxo-text">Lista de Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div class="text-center py-12">
                <div class="w-8 h-8 border-2 border-plaxo-success/30 border-t-plaxo-success rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-plaxo-text-secondary">Carregando assinaturas...</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-plaxo-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span class="text-plaxo-success text-3xl"><MdSubscriptions /></span>
                </div>
                <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
                  Nenhuma assinatura encontrada
                </h3>
                <p class="text-plaxo-text-secondary">
                  Esta aplicação ainda não possui assinaturas registradas
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-plaxo-text">ID</TableHead>
                    <TableHead class="text-plaxo-text">Plano</TableHead>
                    <TableHead class="text-plaxo-text">Valor</TableHead>
                    <TableHead class="text-plaxo-text">Status</TableHead>
                    <TableHead class="text-plaxo-text">Próxima Cobrança</TableHead>
                    <TableHead class="text-plaxo-text">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <>
                      <TableRow key={subscription.id}>
                        <TableCell class="font-mono text-sm text-plaxo-text-secondary">{subscription.id.slice(0, 8)}</TableCell>
                        <TableCell class="font-medium text-plaxo-text">{subscription.planName}</TableCell>
                        <TableCell class="font-semibold text-plaxo-text">{formatCurrency(parseFloat(subscription.amount?.amount || '0'))}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(subscription.status)}>
                            {getStatusLabel(subscription.status)}
                          </Badge>
                        </TableCell>
                        <TableCell class="text-plaxo-text-secondary">{formatDate(subscription.nextBillingDate)}</TableCell>
                        <TableCell>
                          <div class="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPayments(subscription.id)}
                              disabled={paymentsLoading}
                              class="border-plaxo-primary text-plaxo-primary hover:bg-plaxo-primary hover:text-plaxo-background flex items-center gap-1"
                            >
                              <span class="text-sm"><MdPayment /></span>
                              {showPayments === subscription.id ? 'Ocultar' : 'Pagamentos'}
                            </Button>
                            {subscription.status === 'active' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspend(subscription.id)}
                                  disabled={actionLoading === subscription.id}
                                  class="border-plaxo-warning text-plaxo-warning hover:bg-plaxo-warning hover:text-plaxo-background flex items-center gap-1"
                                >
                                  <span class="text-sm"><MdPause /></span>
                                  {actionLoading === subscription.id ? '...' : 'Suspender'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancel(subscription.id)}
                                  disabled={actionLoading === subscription.id}
                                  class="flex items-center gap-1"
                                >
                                  <span class="text-sm"><MdCancel /></span>
                                  {actionLoading === subscription.id ? '...' : 'Cancelar'}
                                </Button>
                              </>
                            )}
                            {subscription.status === 'suspended' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancel(subscription.id)}
                                disabled={actionLoading === subscription.id}
                                class="flex items-center gap-1"
                              >
                                <span class="text-sm"><MdCancel /></span>
                                {actionLoading === subscription.id ? '...' : 'Cancelar'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {showPayments === subscription.id && (
                        <TableRow>
                          <TableCell colSpan={6} class="p-0">
                            <div class="bg-plaxo-background border-t border-plaxo-border p-4">
                              <h4 class="text-sm font-medium text-plaxo-text mb-3 flex items-center gap-2">
                                <span class="text-plaxo-primary"><MdPayment /></span>
                                Pagamentos desta assinatura
                              </h4>
                              {paymentsLoading ? (
                                <div class="text-center py-4">
                                  <div class="w-6 h-6 border-2 border-plaxo-primary/30 border-t-plaxo-primary rounded-full animate-spin mx-auto mb-2"></div>
                                  <p class="text-plaxo-text-secondary text-sm">Carregando...</p>
                                </div>
                              ) : subscriptionPayments.length === 0 ? (
                                <p class="text-plaxo-text-secondary text-sm text-center py-4">
                                  Nenhum pagamento encontrado para esta assinatura
                                </p>
                              ) : (
                                <div class="space-y-2">
                                  {subscriptionPayments.map((payment) => (
                                    <div key={payment.id} class="flex items-center justify-between bg-plaxo-surface rounded-lg p-3">
                                      <div class="flex items-center gap-3">
                                        <div class="font-mono text-xs text-plaxo-text-secondary">
                                          {payment.id.slice(0, 8)}
                                        </div>
                                        <div class="text-sm text-plaxo-text">
                                          {payment.description || 'Pagamento de assinatura'}
                                        </div>
                                      </div>
                                      <div class="flex items-center gap-3">
                                        <div class="font-semibold text-plaxo-text">
                                          {formatCurrency(parseFloat(payment.amount?.amount || '0'))}
                                        </div>
                                        <Badge variant={getPaymentStatusVariant(payment.status)}>
                                          {getPaymentStatusLabel(payment.status)}
                                        </Badge>
                                        <div class="text-xs text-plaxo-text-secondary">
                                          {formatDate(payment.createdAt)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
          <CardContent class="p-12 text-center">
            <div class="w-16 h-16 bg-plaxo-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-plaxo-success text-3xl"><MdApps /></span>
            </div>
            <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
              Selecione uma aplicação
            </h3>
            <p class="text-plaxo-text-secondary">
              Escolha uma aplicação acima para visualizar suas assinaturas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
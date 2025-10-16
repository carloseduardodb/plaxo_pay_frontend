import { useState } from 'preact/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { usePayments } from '../hooks/use-payments'
import { useApplications } from '../hooks/use-applications'
import { formatCurrency, formatDate } from '../lib/utils'
import { MdPayment, MdApps } from 'react-icons/md'

export function Payments() {
  const { applications } = useApplications()
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const { payments, isLoading, error } = usePayments(selectedAppId)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success' as const
      case 'pending': return 'warning' as const
      case 'rejected': return 'destructive' as const
      case 'cancelled': return 'destructive' as const
      default: return 'secondary' as const
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      case 'rejected': return 'Rejeitado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  if (error) {
    return (
      <div class="p-6">
        <Card>
          <CardContent class="text-center py-8">
            <p class="text-plaxo-error">Erro ao carregar pagamentos</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div class="min-h-screen bg-plaxo-background p-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-plaxo-primary/20 rounded-xl flex items-center justify-center">
            <span class="text-plaxo-primary text-2xl"><MdPayment /></span>
          </div>
          <div>
            <h1 class="text-3xl font-display font-bold text-plaxo-text">
              Pagamentos
            </h1>
            <p class="text-plaxo-text-secondary">
              Gerencie pagamentos por aplicação
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
            <CardTitle class="text-plaxo-text">Lista de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div class="text-center py-12">
                <div class="w-8 h-8 border-2 border-plaxo-primary/30 border-t-plaxo-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-plaxo-text-secondary">Carregando pagamentos...</p>
              </div>
            ) : payments.length === 0 ? (
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-plaxo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span class="text-plaxo-primary text-3xl"><MdPayment /></span>
                </div>
                <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
                  Nenhum pagamento encontrado
                </h3>
                <p class="text-plaxo-text-secondary">
                  Esta aplicação ainda não possui pagamentos registrados
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-plaxo-text">ID</TableHead>
                    <TableHead class="text-plaxo-text">Descrição</TableHead>
                    <TableHead class="text-plaxo-text">Valor</TableHead>
                    <TableHead class="text-plaxo-text">Status</TableHead>
                    <TableHead class="text-plaxo-text">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell class="font-mono text-sm text-plaxo-text-secondary">{payment.id.slice(0, 8)}</TableCell>
                      <TableCell class="text-plaxo-text">{payment.description}</TableCell>
                      <TableCell class="font-semibold text-plaxo-text">{formatCurrency(parseFloat(payment.amount?.amount || '0'))}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell class="text-plaxo-text-secondary">{formatDate(payment.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card class="bg-plaxo-surface border-plaxo-border shadow-soft">
          <CardContent class="p-12 text-center">
            <div class="w-16 h-16 bg-plaxo-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-plaxo-primary text-3xl"><MdApps /></span>
            </div>
            <h3 class="text-xl font-display font-bold text-plaxo-text mb-2">
              Selecione uma aplicação
            </h3>
            <p class="text-plaxo-text-secondary">
              Escolha uma aplicação acima para visualizar seus pagamentos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
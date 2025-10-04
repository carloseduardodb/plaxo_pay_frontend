"use client"

import { useState, useEffect } from "react"
import type { Payment, Subscription } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

interface SubscriptionPaymentsModalProps {
  subscription: Subscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  pending: "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  cancelled: "bg-muted text-muted-foreground",
}

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  cancelled: "Cancelado",
}

const methodLabels = {
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
}

export function SubscriptionPaymentsModal({ subscription, open, onOpenChange }: SubscriptionPaymentsModalProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && subscription) {
      loadPayments()
    }
  }, [open, subscription])

  const loadPayments = async () => {
    if (!subscription) return

    setIsLoading(true)
    try {
      const data = await apiClient.getPaymentsBySubscription(subscription.id)
      setPayments(data)
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!subscription) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Pagamentos - {subscription.planName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">ID da Assinatura</p>
              <p className="font-mono text-sm">{subscription.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plano</p>
              <p className="text-sm font-semibold">{subscription.planName}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.id.substring(0, 8)}...</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="font-semibold">
                        {payment.amount.currency} {Number(payment.amount.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{methodLabels[payment.method]}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[payment.status]}>{statusLabels[payment.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum pagamento encontrado para esta assinatura</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

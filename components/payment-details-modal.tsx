"use client"

import type { Payment } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface PaymentDetailsModalProps {
  payment: Payment | null
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

export function PaymentDetailsModal({ payment, open, onOpenChange }: PaymentDetailsModalProps) {
  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-mono text-sm">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[payment.status]}>{statusLabels[payment.status]}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="text-lg font-semibold">
                {payment.amount.currency} {payment.amount.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Método</p>
              <p className="text-sm">{methodLabels[payment.method]}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Descrição</p>
            <p className="text-sm">{payment.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID da Aplicação</p>
              <p className="font-mono text-sm">{payment.applicationId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID do Cliente</p>
              <p className="font-mono text-sm">{payment.customerId}</p>
            </div>
          </div>
          {payment.subscriptionId && (
            <div>
              <p className="text-sm text-muted-foreground">ID da Assinatura</p>
              <p className="font-mono text-sm">{payment.subscriptionId}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Data de Criação</p>
            <p className="text-sm">{new Date(payment.createdAt).toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { Payment } from "@/lib/types"
import { Search, Loader2 } from "lucide-react"
import { PaymentDetailsModal } from "@/components/payment-details-modal"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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

export default function PaymentsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [applicationId, setApplicationId] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  const handleSearch = async () => {
    if (!applicationId.trim()) {
      setError("Por favor, insira um ID de aplicação")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const status = statusFilter === "all" ? undefined : statusFilter
      const data = await apiClient.getPaymentsByApplication(applicationId, status)
      setPayments(data)
    } catch (err) {
      setError("Erro ao buscar pagamentos. Verifique o ID da aplicação.")
      setPayments([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPayments = payments

  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalOpen(true)
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pagamentos</h1>
            <p className="text-muted-foreground">Busque e gerencie pagamentos por aplicação</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="applicationId">ID da Aplicação</Label>
                  <Input
                    id="applicationId"
                    placeholder="Digite o ID da aplicação"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Pagamentos
                  </>
                )}
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {filteredPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados ({filteredPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
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
                      {filteredPayments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(payment)}
                        >
                          <TableCell className="font-mono text-xs">{payment.id.substring(0, 8)}...</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell className="font-semibold">
                            {payment.amount.currency} {payment.amount.amount.toFixed(2)}
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
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <PaymentDetailsModal payment={selectedPayment} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}

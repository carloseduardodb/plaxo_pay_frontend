"use client"

import { useState, useEffect } from "react"
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
import type { Subscription } from "@/lib/types"
import { Search, Loader2, Ban, Pause, FileText } from "lucide-react"
import { SubscriptionPaymentsModal } from "@/components/subscription-payments-modal"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusColors = {
  active: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  suspended: "bg-warning text-warning-foreground",
}

const statusLabels = {
  active: "Ativa",
  cancelled: "Cancelada",
  suspended: "Suspensa",
}

const billingCycleLabels = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual",
}

export default function SubscriptionsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [applicationId, setApplicationId] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"cancel" | "suspend" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

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
      const data = await apiClient.getSubscriptionsByApplication(applicationId, status)
      setSubscriptions(data)
    } catch (err) {
      setError("Erro ao buscar assinaturas. Verifique o ID da aplicação.")
      setSubscriptions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPayments = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setPaymentsModalOpen(true)
  }

  const handleAction = (subscription: Subscription, type: "cancel" | "suspend") => {
    setSelectedSubscription(subscription)
    setActionType(type)
    setActionDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedSubscription || !actionType) return

    setActionLoading(true)
    try {
      if (actionType === "cancel") {
        await apiClient.cancelSubscription(selectedSubscription.id)
      } else {
        await apiClient.suspendSubscription(selectedSubscription.id)
      }
      // Refresh the list
      await handleSearch()
      setActionDialogOpen(false)
    } catch (err) {
      setError(`Erro ao ${actionType === "cancel" ? "cancelar" : "suspender"} assinatura`)
    } finally {
      setActionLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-foreground">Assinaturas</h1>
            <p className="text-muted-foreground">Busque e gerencie assinaturas por aplicação</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Assinaturas</CardTitle>
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
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="suspended">Suspensa</SelectItem>
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
                    Buscar Assinaturas
                  </>
                )}
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {subscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados ({subscriptions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Ciclo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Próximo Vencimento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-mono text-xs">{subscription.id.substring(0, 8)}...</TableCell>
                          <TableCell className="font-semibold">{subscription.planName}</TableCell>
                          <TableCell className="font-semibold">
                            {subscription.amount.currency} {subscription.amount.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{billingCycleLabels[subscription.billingCycle]}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[subscription.status]}>
                              {statusLabels[subscription.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(subscription.nextBillingDate).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPayments(subscription)}
                                title="Ver histórico de pagamentos"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {subscription.status === "active" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAction(subscription, "suspend")}
                                    title="Suspender assinatura"
                                  >
                                    <Pause className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAction(subscription, "cancel")}
                                    title="Cancelar assinatura"
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
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

      <SubscriptionPaymentsModal
        subscription={selectedSubscription}
        open={paymentsModalOpen}
        onOpenChange={setPaymentsModalOpen}
      />

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "cancel" ? "Cancelar Assinatura" : "Suspender Assinatura"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {actionType === "cancel" ? "cancelar" : "suspender"} a assinatura{" "}
              <span className="font-semibold">{selectedSubscription?.planName}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

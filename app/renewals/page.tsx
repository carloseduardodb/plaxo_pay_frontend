"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import type { Subscription } from "@/lib/types"
import { RefreshCw, Loader2, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

const billingCycleLabels = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual",
}

export default function RenewalsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [renewals, setRenewals] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  const handleFetchRenewals = async () => {
    setError("")
    setIsLoading(true)

    try {
      const data = await apiClient.getRenewalsDue()
      setRenewals(data)
    } catch (err) {
      setError("Erro ao buscar vencimentos. Tente novamente.")
      setRenewals([])
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysUntilRenewal = (date: string) => {
    const renewalDate = new Date(date)
    const today = new Date()
    const diffTime = renewalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getRenewalBadge = (days: number) => {
    if (days < 0) {
      return <Badge className="bg-destructive text-destructive-foreground">Vencido</Badge>
    } else if (days === 0) {
      return <Badge className="bg-warning text-warning-foreground">Hoje</Badge>
    } else if (days <= 7) {
      return <Badge className="bg-warning text-warning-foreground">{days} dias</Badge>
    } else {
      return <Badge className="bg-muted text-muted-foreground">{days} dias</Badge>
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
            <h1 className="text-3xl font-bold text-foreground">Vencimentos</h1>
            <p className="text-muted-foreground">Assinaturas próximas ao vencimento</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Vencimentos</CardTitle>
              <CardDescription>
                Clique no botão abaixo para buscar todas as assinaturas que estão próximas ao vencimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleFetchRenewals} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Buscar Vencimentos
                  </>
                )}
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {renewals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Assinaturas a Vencer ({renewals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Ciclo</TableHead>
                        <TableHead>Data de Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renewals.map((subscription) => {
                        const daysUntil = getDaysUntilRenewal(subscription.nextBillingDate)
                        return (
                          <TableRow key={subscription.id}>
                            <TableCell className="font-mono text-xs">{subscription.id.substring(0, 8)}...</TableCell>
                            <TableCell className="font-semibold">{subscription.planName}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {subscription.customerId.substring(0, 8)}...
                            </TableCell>
                            <TableCell className="font-semibold">
                              {subscription.amount.currency} {subscription.amount.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{billingCycleLabels[subscription.billingCycle]}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm">
                                  {new Date(subscription.nextBillingDate).toLocaleDateString("pt-BR")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(subscription.nextBillingDate).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{getRenewalBadge(daysUntil)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && renewals.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhuma assinatura próxima ao vencimento encontrada.
                  <br />
                  Clique em "Buscar Vencimentos" para atualizar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

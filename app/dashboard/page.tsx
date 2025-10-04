"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { CreditCard, FileText, Calendar, Package, Loader2, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardStats {
  totalApplications: number
  totalPayments: number
  totalSubscriptions: number
  renewalsDue: number
  recentPayments: any[]
  recentSubscriptions: any[]
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [applications, renewals] = await Promise.all([
        apiClient.getAllApplications(),
        apiClient.getRenewalsDue()
      ])

      setStats({
        totalApplications: applications.length,
        totalPayments: 0,
        totalSubscriptions: 0,
        renewalsDue: renewals.length,
        recentPayments: [],
        recentSubscriptions: renewals.slice(0, 5)
      })
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
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
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do sistema de pagamentos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/applications">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aplicações</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">Total cadastradas</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/payments">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
                  <p className="text-xs text-muted-foreground">Total processados</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/subscriptions">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assinaturas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSubscriptions || 0}</div>
                  <p className="text-xs text-muted-foreground">Ativas no sistema</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/renewals">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vencimentos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.renewalsDue || 0}</div>
                  <p className="text-xs text-muted-foreground">Próximos ao vencimento</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Assinaturas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentSubscriptions && stats.recentSubscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentSubscriptions.map((subscription) => (
                      <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{subscription.planName}</p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.amount.currency} {Number(subscription.amount.amount).toFixed(2)}
                          </p>
                        </div>
                        <Badge variant="outline" suppressHydrationWarning>
                          {new Date(subscription.nextBillingDate).toLocaleDateString("pt-BR")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma assinatura encontrada
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/applications" className="block">
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Gerenciar Aplicações</p>
                        <p className="text-sm text-muted-foreground">Cadastrar e configurar aplicações</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/payments" className="block">
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Consultar Pagamentos</p>
                        <p className="text-sm text-muted-foreground">Buscar e analisar transações</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/renewals" className="block">
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Verificar Vencimentos</p>
                        <p className="text-sm text-muted-foreground">Assinaturas próximas ao vencimento</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
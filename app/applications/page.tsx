"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { apiClient } from "@/lib/api-client"
import type { Application, CreateApplicationRequest } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState<CreateApplicationRequest>({
    name: "",
    apiKey: "",
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: applications,
    error,
    mutate,
  } = useSWR<Application[]>("applications", () => apiClient.getAllApplications(), { refreshInterval: 30000 })

  const filteredApplications = applications?.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await apiClient.createApplication(formData)
      setIsCreateOpen(false)
      setFormData({ name: "", apiKey: "", isActive: true })
      mutate()
    } catch (error) {
      console.error("Failed to create application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>Falha ao carregar aplicações</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Aplicações</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas aplicações cadastradas</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Aplicação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Aplicação</DialogTitle>
                <DialogDescription>Preencha os dados para cadastrar uma nova aplicação</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome da aplicação"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Chave de API"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Ativa</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Criando..." : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {!applications ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando aplicações...</p>
          </div>
        ) : filteredApplications && filteredApplications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="mt-1 font-mono text-xs">{app.id}</CardDescription>
                    </div>
                    <Badge variant={app.isActive ? "default" : "secondary"}>{app.isActive ? "Ativa" : "Inativa"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">API Key:</span>
                      <p className="font-mono text-xs break-all">{app.apiKey}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Criada em:</span>
                      <p>{new Date(app.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhuma aplicação encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}

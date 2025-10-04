"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, FileText, Calendar, LogOut, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"

const navigation = [
  { name: "Aplicações", href: "/applications", icon: Package },
  { name: "Pagamentos", href: "/payments", icon: CreditCard },
  { name: "Assinaturas", href: "/subscriptions", icon: FileText },
  { name: "Vencimentos", href: "/renewals", icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-semibold text-sidebar-foreground">Plaxo Pay</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}

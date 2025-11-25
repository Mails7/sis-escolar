import type { Metadata } from "next"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { RegisterDashboard } from "@/components/register/register-dashboard"

export const metadata: Metadata = {
  title: "Cadastros | Educar",
  description: "Gerenciamento centralizado de cadastros do sistema educacional",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <HomeIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/register">Cadastros</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastros</h1>
        <p className="text-muted-foreground">
          Gerencie todos os cadastros do sistema educacional de forma centralizada.
        </p>
      </div>

      <RegisterDashboard />
    </div>
  )
}

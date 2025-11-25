import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { ServerForm } from "@/components/servers/server-form"

export default function RegisterServerPage() {
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
        <BreadcrumbItem>
          <BreadcrumbLink href="/servers/register">Cadastrar Servidor</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Servidor</h1>
        <p className="text-muted-foreground">Preencha os dados para cadastrar um novo servidor.</p>
      </div>

      <ServerForm />
    </div>
  )
}

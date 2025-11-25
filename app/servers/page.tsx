import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon, PlusIcon, SearchIcon } from "lucide-react"
import { ServerTable } from "@/components/servers/server-table"

export default function ServersPage() {
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
          <BreadcrumbLink href="/servers">Servidores</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servidores</h1>
          <p className="text-muted-foreground">Gerencie os servidores da rede municipal de ensino.</p>
        </div>
        <Button className="sm:w-auto w-full" size="sm" asChild>
          <a href="/servers/register">
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Servidor
          </a>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar servidores..." className="w-full pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            Exportar
          </Button>
        </div>
      </div>

      <ServerTable />
    </div>
  )
}

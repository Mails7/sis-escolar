import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon, SearchIcon } from "lucide-react"
import { SecretaryDashboard } from "@/components/secretary/secretary-dashboard"

export default function SecretaryPage() {
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
          <BreadcrumbLink href="/secretary">Secretaria Municipal</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Secretaria Municipal de Educação</h1>
          <p className="text-muted-foreground">Gestão centralizada da rede municipal de ensino</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar..." className="pl-8 w-full sm:w-[300px]" />
        </div>
      </div>

      <SecretaryDashboard />
    </div>
  )
}

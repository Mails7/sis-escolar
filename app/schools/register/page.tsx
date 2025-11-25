import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { SchoolForm } from "@/components/schools/school-form"

export default function RegisterSchoolPage() {
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
          <BreadcrumbLink href="/schools">Escolas</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/schools/register">Cadastrar</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Escola</h1>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para cadastrar uma nova instituição de ensino.
        </p>
      </div>

      <SchoolForm />
    </div>
  )
}

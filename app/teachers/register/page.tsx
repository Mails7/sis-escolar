import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { TeacherForm } from "@/components/teachers/teacher-form"

export default function TeacherRegisterPage() {
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
          <BreadcrumbLink href="/teachers/register">Cadastro de Professor</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Professor</h1>
        <p className="text-muted-foreground">Preencha os dados para cadastrar um novo professor no sistema.</p>
      </div>

      <TeacherForm />
    </div>
  )
}

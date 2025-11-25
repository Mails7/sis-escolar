import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { SchoolForm } from "@/components/schools/school-form"

interface EditSchoolPageProps {
  params: {
    id: string
  }
}

export default function EditSchoolPage({ params }: EditSchoolPageProps) {
  // Em uma aplicação real, você buscaria os dados da escola com base no ID
  const mockSchoolData = {
    name: "Escola Municipal João da Silva",
    code: "12345678",
    type: "public",
    level: "elementary",
    description: "Escola municipal de ensino fundamental localizada na zona urbana.",
    active: true,
    // ... outros dados
  }

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
          <BreadcrumbLink href={`/schools/${params.id}`}>Detalhes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/schools/${params.id}/edit`}>Editar</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Escola</h1>
        <p className="text-muted-foreground">Atualize as informações da instituição de ensino.</p>
      </div>

      <SchoolForm schoolId={params.id} initialData={mockSchoolData} />
    </div>
  )
}

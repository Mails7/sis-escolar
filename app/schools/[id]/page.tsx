import type { Metadata } from "next"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon } from "lucide-react"
import { SchoolOverview } from "@/components/schools/school-overview"
import { SchoolTeachers } from "@/components/schools/school-teachers"
import { SchoolStudents } from "@/components/schools/school-students"
import { SchoolClasses } from "@/components/schools/school-classes"
import { SchoolStaff } from "@/components/schools/school-staff"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Detalhes da Escola | Educar",
  description: "Visualize e gerencie os detalhes da escola",
}

interface SchoolPageProps {
  params: {
    id: string
  }
}

export default function SchoolPage({ params }: SchoolPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <BreadcrumbLink href={`/schools/${params.id}`}>Detalhes da Escola</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/schools/${params.id}/edit`}>Editar Escola</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="classes">Turmas</TabsTrigger>
          <TabsTrigger value="staff">Funcionários</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SchoolOverview id={params.id} />
        </TabsContent>
        <TabsContent value="teachers" className="space-y-4">
          <SchoolTeachers id={params.id} />
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <SchoolStudents id={params.id} />
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <SchoolClasses id={params.id} />
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <SchoolStaff id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

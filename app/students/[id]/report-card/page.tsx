import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { StudentReportCard } from "@/components/students/student-report-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Boletim do Aluno | i-Educar",
  description: "Visualize o boletim escolar do aluno",
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function StudentReportCardPage({ params }: PageProps) {
  // Em produção, buscar dados do aluno do banco
  const studentId = params.id
  const studentName = "Nome do Aluno" // Substituir por dados reais

  if (!studentId) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/students">Alunos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/students/${studentId}`}>Perfil do Aluno</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Boletim</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<div>Carregando boletim...</div>}>
        <StudentReportCard studentId={studentId} studentName={studentName} />
      </Suspense>
    </div>
  )
}

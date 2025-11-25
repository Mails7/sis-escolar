import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { StudentHistory } from "@/components/students/student-history"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Histórico Escolar | i-Educar",
  description: "Visualize o histórico escolar completo do aluno",
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function StudentHistoryPage({ params }: PageProps) {
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
            <BreadcrumbPage>Histórico Escolar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<div>Carregando histórico...</div>}>
        <StudentHistory studentId={studentId} studentName={studentName} />
      </Suspense>
    </div>
  )
}

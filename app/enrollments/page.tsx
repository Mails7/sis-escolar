import { Suspense } from "react"
import type { Metadata } from "next"
import { EnrollmentList } from "@/components/enrollments/enrollment-list"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Matrículas | Sistema Escolar",
  description: "Gerenciamento de matrículas de alunos",
}

// Dados de exemplo para usar quando não for possível buscar dados reais
const demoEnrollments = [
  {
    id: "1",
    student: { id: "1", name: "João Silva" },
    class: { id: "1", name: "1º Ano - Turma A" },
    school_year: 2023,
    enrollment_date: "2023-02-01",
    enrollment_number: "ENR-000001",
    status: "Ativo",
  },
  {
    id: "2",
    student: { id: "2", name: "Maria Oliveira" },
    class: { id: "2", name: "2º Ano - Turma B" },
    school_year: 2023,
    enrollment_date: "2023-02-05",
    enrollment_number: "ENR-000002",
    status: "Ativo",
  },
  {
    id: "3",
    student: { id: "3", name: "Pedro Santos" },
    class: { id: "1", name: "1º Ano - Turma A" },
    school_year: 2023,
    enrollment_date: "2023-02-10",
    enrollment_number: "ENR-000003",
    status: "Ativo",
  },
]

async function getEnrollments() {
  try {
    // Usar fetch para buscar dados da API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/enrollments`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    // Verificar se a resposta é OK
    if (!response.ok) {
      // Ler o corpo da resposta apenas uma vez e armazenar o resultado
      let errorMessage = `HTTP error ${response.status}`

      try {
        // Tentar ler como JSON
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (jsonError) {
        // Se falhar ao ler como JSON, não tente ler como texto
        // Apenas use a mensagem de erro HTTP
      }

      return {
        error: `fetch_error: ${errorMessage}`,
        data: demoEnrollments, // Usar dados de exemplo em caso de erro
      }
    }

    // Analisar a resposta JSON
    try {
      const data = await response.json()
      return { error: null, data }
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError)
      return {
        error: "invalid_json",
        data: demoEnrollments, // Usar dados de exemplo em caso de erro
      }
    }
  } catch (error) {
    console.error("Error fetching enrollments:", error)

    // Garantir que retornamos um objeto com a estrutura esperada
    return {
      error: error instanceof Error ? error.message : "unexpected_error",
      data: demoEnrollments, // Usar dados de exemplo em caso de erro
    }
  }
}

function EnrollmentListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="border rounded-md">
        <div className="h-10 border-b px-4 flex items-center">
          <Skeleton className="h-4 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b px-4 flex items-center">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function EnrollmentsPage() {
  const { data: enrollments, error } = await getEnrollments()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Matrículas</h1>
        <Link href="/enrollments/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Matrícula
          </Button>
        </Link>
      </div>

      {error && error !== "table_not_found" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error.includes("JSON") || error === "invalid_json"
              ? "Erro ao processar a resposta do servidor. Por favor, tente novamente mais tarde."
              : `Ocorreu um erro ao buscar as matrículas: ${error}`}
          </AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<EnrollmentListSkeleton />}>
        <EnrollmentList enrollments={enrollments} />
      </Suspense>
    </div>
  )
}

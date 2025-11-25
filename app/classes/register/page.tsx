import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { ClassForm } from "@/components/classes/class-form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata = {
  title: "Cadastrar Turma | Sistema Escolar",
  description: "Cadastre uma nova turma no sistema escolar",
}

async function getSchoolsAndTeachers() {
  try {
    // Buscar escolas
    const { data: schools, error: schoolsError } = await supabase.from("schools").select("id, name").order("name")

    if (schoolsError) {
      console.error("Error fetching schools:", schoolsError)

      // Se a tabela não existir, retornar dados de exemplo
      if (schoolsError.code === "PGRST116" || schoolsError.message?.includes("does not exist")) {
        return {
          schools: [
            { id: "1", name: "Colégio Municipal São Paulo" },
            { id: "2", name: "Escola Estadual Rio de Janeiro" },
            { id: "3", name: "Escola Municipal Belo Horizonte" },
            { id: "4", name: "Colégio Estadual Salvador" },
            { id: "5", name: "Escola Municipal Recife" },
          ],
          teachers: [],
          isDemo: true,
        }
      }
    }

    // Buscar professores
    const { data: teachers, error: teachersError } = await supabase.from("teachers").select("id, name").order("name")

    if (teachersError) {
      console.error("Error fetching teachers:", teachersError)

      // Se a tabela não existir, retornar dados de exemplo
      if (teachersError.code === "PGRST116" || teachersError.message?.includes("does not exist")) {
        return {
          schools: schools || [],
          teachers: [
            { id: "1", name: "Ricardo Santos" },
            { id: "2", name: "Carla Mendes" },
            { id: "3", name: "Paulo Oliveira" },
            { id: "4", name: "Fernanda Lima" },
            { id: "5", name: "Roberto Alves" },
          ],
          isDemo: true,
        }
      }
    }

    return {
      schools: schools || [],
      teachers: teachers || [],
      isDemo: schoolsError !== null || teachersError !== null,
    }
  } catch (error) {
    console.error("Unexpected error fetching data:", error)
    return {
      schools: [],
      teachers: [],
      error: "Erro inesperado ao buscar dados. Verifique o console para mais detalhes.",
      isDemo: true,
    }
  }
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export default async function RegisterClassPage() {
  const { schools, teachers, isDemo, error } = await getSchoolsAndTeachers()

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/classes">Turmas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Cadastrar Turma</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Turma</h1>
        <p className="text-muted-foreground mt-2">Preencha os dados para cadastrar uma nova turma</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Erro ao carregar dados</p>
              <p>{error}</p>
              <a href="/admin/setup-database" className="text-red-600 hover:text-red-800 underline mt-1 inline-block">
                Configurar banco de dados
              </a>
            </div>
          </div>
        </div>
      )}

      {isDemo && !error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-yellow-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Modo de Demonstração</p>
              <p className="text-sm">
                Exibindo dados de exemplo. O formulário funcionará, mas os dados não serão salvos no banco de dados.
              </p>
              <a
                href="/admin/setup-database"
                className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
              >
                Configurar banco de dados
              </a>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<FormSkeleton />}>
        <ClassForm schools={schools} teachers={teachers} demoMode={isDemo} />
      </Suspense>
    </div>
  )
}

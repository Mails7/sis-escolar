import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import ClassDiary from "@/components/classes/class-diary"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Diário de Classe | Sistema Escolar",
  description: "Diário de classe para registro de aulas e frequência",
}

interface ClassDiaryPageProps {
  params: {
    id: string
  }
}

async function getClassDetails(id: string) {
  try {
    // Verificar primeiro se a tabela existe
    const { error: tableCheckError } = await supabase.from("classes").select("id").limit(1).maybeSingle()

    // Se houver erro na verificação da tabela, retornar dados de demonstração
    if (tableCheckError) {
      console.log("Tabela de classes não encontrada ou erro de acesso:", tableCheckError.message)

      // Dados de demonstração para o ID específico
      return {
        id: id,
        name: id === "1" ? "1º Ano A - Ensino Fundamental" : "2º Ano B - Ensino Fundamental",
        grade: id === "1" ? "1º Ano" : "2º Ano",
        shift: "Manhã",
        classroom: id === "1" ? "Sala 101" : "Sala 102",
        school: { name: "Escola Municipal São Paulo" },
        teacher: { name: id === "1" ? "Prof. Ricardo Santos" : "Profa. Carla Mendes" },
        isDemo: true,
      }
    }

    const { data, error } = await supabase
      .from("classes")
      .select(`
        id, 
        name, 
        grade, 
        shift, 
        classroom,
        school:school_id (name),
        teacher:teacher_id (name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching class details:", error)
      throw error
    }

    return { ...data, isDemo: false }
  } catch (error) {
    console.error("Error in getClassDetails:", error)

    // Se o erro for de registro não encontrado, retornar null para acionar o notFound()
    if (error instanceof Error && error.message.includes("No rows found")) {
      return null
    }

    // Para outros erros, retornar dados de demonstração
    return {
      id: id,
      name: "Turma de Demonstração",
      grade: "1º Ano",
      shift: "Manhã",
      classroom: "Sala 101",
      school: { name: "Escola Exemplo" },
      teacher: { name: "Professor Exemplo" },
      isDemo: true,
    }
  }
}

function ClassDiarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-10 w-full" />

        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        <Skeleton className="h-10 w-1/4 mt-4" />
      </div>
    </div>
  )
}

export default async function ClassDiaryPage({ params }: ClassDiaryPageProps) {
  const classDetails = await getClassDetails(params.id)

  if (!classDetails) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Diário de Classe</h1>
        <p className="text-muted-foreground mt-1">
          {classDetails.name} - {classDetails.school?.name}
        </p>
      </div>

      {classDetails.isDemo && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex">
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
              <p className="text-sm">Exibindo dados de exemplo. Algumas funcionalidades podem estar limitadas.</p>
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

      <Suspense fallback={<ClassDiarySkeleton />}>
        <ClassDiary classId={params.id} classDetails={classDetails} isDemo={classDetails.isDemo} />
      </Suspense>
    </div>
  )
}

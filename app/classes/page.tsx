import { Suspense } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, BookOpen, Users, Calendar } from "lucide-react"

export const metadata = {
  title: "Turmas | Sistema Escolar",
  description: "Gerenciamento de turmas do sistema escolar",
}

// Vamos modificar a função getClasses para lidar melhor com erros de resposta JSON

import { getClasses as fetchClasses } from "@/app/actions/class-actions"

async function getClasses() {
  const { classes, error } = await fetchClasses()

  if (error && error.includes("não encontrada")) {
    console.log("Tabela de classes não encontrada, usando dados de demonstração")
    return {
      classes: [
        {
          id: "1",
          name: "1º Ano A - Ensino Fundamental",
          grade: "1º Ano",
          shift: "Manhã",
          classroom: "Sala 101",
          max_students: 30,
          school: { name: "Escola Municipal São Paulo" },
          teacher: { name: "Prof. Ricardo Santos" },
        },
        {
          id: "2",
          name: "2º Ano B - Ensino Fundamental",
          grade: "2º Ano",
          shift: "Manhã",
          classroom: "Sala 102",
          max_students: 30,
          school: { name: "Escola Municipal São Paulo" },
          teacher: { name: "Profa. Carla Mendes" },
        },
        {
          id: "3",
          name: "3º Ano A - Ensino Fundamental",
          grade: "3º Ano",
          shift: "Tarde",
          classroom: "Sala 201",
          max_students: 25,
          school: { name: "Escola Estadual Rio de Janeiro" },
          teacher: { name: "Prof. Paulo Oliveira" },
        },
        {
          id: "4",
          name: "1º Ano A - Ensino Médio",
          grade: "1º Ano EM",
          shift: "Manhã",
          classroom: "Sala 301",
          max_students: 35,
          school: { name: "Colégio Estadual Salvador" },
          teacher: { name: "Profa. Fernanda Lima" },
        },
        {
          id: "5",
          name: "2º Ano B - Ensino Médio",
          grade: "2º Ano EM",
          shift: "Manhã",
          classroom: "Sala 302",
          max_students: 35,
          school: { name: "Colégio Estadual Salvador" },
          teacher: { name: "Prof. Roberto Alves" },
        },
      ],
      isDemo: true,
    }
  }

  if (error) {
    console.error("Error fetching classes:", error)
    return { classes: [], error }
  }

  return { classes: classes || [], isDemo: false }
}

function ClassesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

interface ClassItem {
  id: string
  name: string
  grade: string
  shift: string
  classroom: string
  max_students: number
  school: { name: string }
  teacher: { name: string }
}

function ClassesGrid({ classes, isDemo = false }: { classes: ClassItem[], isDemo?: boolean }) {
  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Nenhuma turma encontrada</h3>
        <p className="text-muted-foreground mt-2">Cadastre uma nova turma para começar.</p>
        <Button asChild className="mt-4">
          <Link href="/classes/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Turma
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {isDemo && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{classItem.name}</CardTitle>
              <CardDescription>{classItem.school?.name || "Escola não especificada"}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Professor: {classItem.teacher?.name || "Não atribuído"} | Sala: {classItem.classroom}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {classItem.grade} | {classItem.shift} | Máx: {classItem.max_students} alunos
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/classes/${classItem.id}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Detalhes
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/classes/${classItem.id}/diary`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Diário
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default async function ClassesPage() {
  const { classes, isDemo, error } = await getClasses()

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground mt-2">Gerencie as turmas da sua escola</p>
        </div>
        <Button asChild>
          <Link href="/classes/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Turma
          </Link>
        </Button>
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
              <p className="font-bold">Erro ao carregar turmas</p>
              <p>{error}</p>
              <a href="/admin/setup-database" className="text-red-600 hover:text-red-800 underline mt-1 inline-block">
                Configurar banco de dados
              </a>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ClassesSkeleton />}>
        <ClassesGrid classes={classes} isDemo={isDemo} />
      </Suspense>
    </div>
  )
}

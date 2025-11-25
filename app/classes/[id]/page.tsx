import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BookOpen, Calendar, ClipboardList, Edit, Users, PlusCircle } from "lucide-react"

export const metadata = {
  title: "Detalhes da Turma | Sistema Escolar",
  description: "Visualize os detalhes da turma",
}

import { getClassById, getClassStudents as fetchClassStudents } from "@/app/actions/class-actions"

async function getClassDetails(id: string) {
  const { classItem, error } = await getClassById(id)

  if (error && error.includes("não encontrada")) {
    // Check if it's table missing error or just not found
    // For now, if error, we assume demo fallback if table missing logic was in place, 
    // but here we just return error or handle demo if needed.
    // The previous logic checked for table existence.
    // Let's assume if error contains "does not exist" or similar, we fallback.
    // But getClassById returns simple error string.

    // Let's just return what we have.
    // If we want to support demo mode, we need to check error message more carefully or pass a flag.
    // For now, let's replicate the demo data if error suggests table missing.
    if (error.includes("relation \"classes\" does not exist")) {
      return {
        classData: {
          id,
          name: "1º Ano A - Ensino Fundamental",
          grade: "1º Ano",
          shift: "Manhã",
          classroom: "Sala 101",
          max_students: 30,
          school_year: 2023,
          status: "active",
          school: { id: "1", name: "Escola Municipal São Paulo" },
          teacher: { id: "1", name: "Prof. Ricardo Santos" },
        },
        isDemo: true,
      }
    }
    return { error }
  }

  return { classData: classItem, isDemo: false }
}

async function getClassStudents(id: string) {
  const { students, error } = await fetchClassStudents(id)

  if (error && error.includes("relation \"enrollments\" does not exist")) {
    return {
      students: [
        {
          id: "1",
          enrollment_date: "2023-02-01",
          status: "active",
          student: { id: "1", name: "Ana Beatriz Silva", registration_code: "STD001" },
        },
        {
          id: "2",
          enrollment_date: "2023-02-01",
          status: "active",
          student: { id: "2", name: "Pedro Henrique Santos", registration_code: "STD002" },
        },
        {
          id: "3",
          enrollment_date: "2023-02-01",
          status: "active",
          student: { id: "3", name: "Gabriela Oliveira", registration_code: "STD003" },
        },
        {
          id: "4",
          enrollment_date: "2023-02-01",
          status: "active",
          student: { id: "4", name: "Lucas Martins", registration_code: "STD004" },
        },
        {
          id: "5",
          enrollment_date: "2023-02-01",
          status: "active",
          student: { id: "5", name: "Juliana Costa", registration_code: "STD005" },
        },
      ],
      isDemo: true,
    }
  }

  if (error) {
    return { students: [], error }
  }

  return { students: students || [], isDemo: false }
}

function ClassDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
  const { classData, isDemo, error: classError } = await getClassDetails(params.id)
  const { students, error: studentsError } = await getClassStudents(params.id)

  if (!classData && !isDemo) {
    notFound()
  }

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
          <BreadcrumbItem>{classData?.name}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<ClassDetailsSkeleton />}>
        <div className="space-y-6">
          {(isDemo || classError || studentsError) && (
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

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{classData?.name}</h1>
              <p className="text-muted-foreground mt-2">Escola: {classData?.school?.name || "Não especificada"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/classes/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/classes/${params.id}/diary`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Diário de Classe
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Série:</span>
                    <span className="font-medium">{classData?.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turno:</span>
                    <span className="font-medium">{classData?.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sala:</span>
                    <span className="font-medium">{classData?.classroom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ano Letivo:</span>
                    <span className="font-medium">{classData?.school_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">
                      {classData?.status === "active" ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Professor Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium">{classData?.teacher?.name || "Não atribuído"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{classData?.teacher?.id || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Capacidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Máximo de Alunos:</span>
                    <span className="font-medium">{classData?.max_students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alunos Matriculados:</span>
                    <span className="font-medium">{students?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vagas Disponíveis:</span>
                    <span className="font-medium">
                      {classData ? classData.max_students - (students?.length || 0) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Alunos
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Disciplinas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alunos Matriculados</CardTitle>
                  <CardDescription>Lista de alunos matriculados na turma {classData?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  {students && students.length > 0 ? (
                    <div className="space-y-4">
                      {students.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50"
                        >
                          <div>
                            <div className="font-medium">{enrollment.student?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Matrícula: {enrollment.student?.registration_code}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${enrollment.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {enrollment.status === "active" ? "Ativo" : "Inativo"}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/students/${enrollment.student?.id}`}>Ver Aluno</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-lg font-medium">Nenhum aluno matriculado</h3>
                      <p className="text-muted-foreground mt-2">
                        Matricule alunos nesta turma para visualizá-los aqui.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/enrollments/new">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Nova Matrícula
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Horários da Turma</CardTitle>
                  <CardDescription>Horários de aulas da turma {classData?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">Horários não configurados</h3>
                    <p className="text-muted-foreground mt-2">Configure os horários de aula para esta turma.</p>
                    <Button asChild className="mt-4">
                      <Link href={`/classes/${params.id}/schedule`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Configurar Horários
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subjects" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disciplinas</CardTitle>
                  <CardDescription>Disciplinas ministradas na turma {classData?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium">Disciplinas não configuradas</h3>
                    <p className="text-muted-foreground mt-2">
                      Adicione disciplinas a esta turma para visualizá-las aqui.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href={`/classes/${params.id}/subjects`}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Adicionar Disciplinas
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </div>
  )
}

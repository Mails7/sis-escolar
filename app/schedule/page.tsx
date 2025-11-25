import { Suspense } from "react"
import type { Metadata } from "next"
import { ClassSchedule } from "@/components/schedule/class-schedule"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Quadro de Horários | Sistema Escolar",
  description: "Gerenciamento de horários de aulas",
}

// Dados de exemplo para quando não for possível buscar do banco de dados
const exampleClasses = [
  { id: "1", name: "6º Ano A" },
  { id: "2", name: "7º Ano B" },
  { id: "3", name: "8º Ano A" },
  { id: "4", name: "9º Ano B" },
]

const exampleSubjects = [
  { id: "1", name: "Matemática" },
  { id: "2", name: "Português" },
  { id: "3", name: "História" },
  { id: "4", name: "Geografia" },
  { id: "5", name: "Ciências" },
]

const exampleTeachers = [
  { id: "1", name: "Carlos Andrade" },
  { id: "2", name: "Fernanda Lima" },
  { id: "3", name: "Roberto Martins" },
  { id: "4", name: "Juliana Costa" },
  { id: "5", name: "Marcelo Souza" },
]

const exampleScheduleEntries = [
  {
    id: "1",
    class_id: "1",
    subject: { name: "Matemática" },
    teacher: { name: "Carlos Andrade" },
    day_of_week: 1,
    start_time: "07:30:00",
    end_time: "08:20:00",
    room: "101",
  },
  {
    id: "2",
    class_id: "1",
    subject: { name: "Português" },
    teacher: { name: "Fernanda Lima" },
    day_of_week: 1,
    start_time: "08:20:00",
    end_time: "09:10:00",
    room: "101",
  },
  {
    id: "3",
    class_id: "2",
    subject: { name: "História" },
    teacher: { name: "Roberto Martins" },
    day_of_week: 2,
    start_time: "07:30:00",
    end_time: "08:20:00",
    room: "102",
  },
  {
    id: "4",
    class_id: "3",
    subject: { name: "Geografia" },
    teacher: { name: "Juliana Costa" },
    day_of_week: 3,
    start_time: "09:10:00",
    end_time: "10:00:00",
    room: "103",
  },
  {
    id: "5",
    class_id: "4",
    subject: { name: "Ciências" },
    teacher: { name: "Marcelo Souza" },
    day_of_week: 4,
    start_time: "10:20:00",
    end_time: "11:10:00",
    room: "104",
  },
]

async function getScheduleData() {
  try {
    // Tentar buscar dados da API
    const response = await fetch("/api/schedules", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Error fetching schedule data:", response.status, response.statusText)
      // Retornar dados de exemplo em caso de erro
      return {
        classes: exampleClasses,
        subjects: exampleSubjects,
        teachers: exampleTeachers,
        scheduleEntries: exampleScheduleEntries,
        error: `Erro ao buscar dados: ${response.status} ${response.statusText}`,
        isDemo: true,
      }
    }

    // Tentar analisar a resposta como JSON
    try {
      const data = await response.json()

      // Se a API retornou isDemo, adicionar a flag
      const isDemo = data.isDemo === true

      return {
        classes: data.classes || exampleClasses,
        subjects: data.subjects || exampleSubjects,
        teachers: data.teachers || exampleTeachers,
        scheduleEntries: data.scheduleEntries || exampleScheduleEntries,
        error: data.error || null,
        isDemo,
      }
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError)
      // Retornar dados de exemplo em caso de erro de análise JSON
      return {
        classes: exampleClasses,
        subjects: exampleSubjects,
        teachers: exampleTeachers,
        scheduleEntries: exampleScheduleEntries,
        error: "Erro ao analisar resposta do servidor",
        isDemo: true,
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    // Retornar dados de exemplo em caso de erro inesperado
    return {
      classes: exampleClasses,
      subjects: exampleSubjects,
      teachers: exampleTeachers,
      scheduleEntries: exampleScheduleEntries,
      error: "Ocorreu um erro inesperado ao buscar os dados",
      isDemo: true,
    }
  }
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="flex-1">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function SchedulePage() {
  const { classes, subjects, teachers, scheduleEntries, error, isDemo } = await getScheduleData()

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-normal text-foreground">Quadro de Horários</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quadro de Horários</h1>
        <p className="text-muted-foreground mt-2">Gerencie os horários de aulas das turmas</p>
      </div>

      {isDemo && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Modo de Demonstração</AlertTitle>
          <AlertDescription>
            <p>
              Exibindo dados de exemplo. Para configurar o banco de dados e usar dados reais, clique no botão abaixo.
            </p>
            <div className="mt-2">
              <Button asChild variant="outline" size="sm">
                <a href="/admin/setup-database">Configurar Banco de Dados</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}
            {error.includes("tabela") && (
              <div className="mt-2">
                <a href="/admin/setup-database" className="underline font-medium">
                  Clique aqui para inicializar as tabelas
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      <Suspense fallback={<ScheduleSkeleton />}>
        <ClassSchedule
          classes={classes || []}
          subjects={subjects || []}
          teachers={teachers || []}
          scheduleEntries={scheduleEntries || []}
        />
      </Suspense>
    </div>
  )
}

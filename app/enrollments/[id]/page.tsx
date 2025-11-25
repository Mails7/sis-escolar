import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Edit, GraduationCap, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { getEnrollmentById } from "@/app/actions/enrollment-actions"

async function getEnrollment(id: string) {
  const { enrollment, error } = await getEnrollmentById(id)

  if (error) {
    console.error("Error fetching enrollment:", error)
    return null
  }

  return enrollment
}

function EnrollmentDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md ml-2" />
          <Skeleton className="h-10 w-24 rounded-md ml-2" />
        </TabsList>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] rounded-md" />
          <Skeleton className="h-[200px] rounded-md" />
          <Skeleton className="h-[200px] rounded-md" />
          <Skeleton className="h-[200px] rounded-md" />
        </div>
      </Tabs>
    </div>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Ativa</Badge>
    case "transferred":
      return <Badge className="bg-yellow-500">Transferida</Badge>
    case "abandoned":
      return <Badge className="bg-red-500">Abandonada</Badge>
    case "concluded":
      return <Badge className="bg-blue-500">Concluída</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

export default async function EnrollmentDetailPage({ params }: { params: { id: string } }) {
  const enrollment = await getEnrollment(params.id)

  if (!enrollment) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<EnrollmentDetailSkeleton />}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/enrollments">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Matrícula {enrollment.enrollment_number}</h1>
            <div className="ml-4">{getStatusBadge(enrollment.status)}</div>
          </div>
          <Link href={`/enrollments/${enrollment.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar Matrícula
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="grades">Notas</TabsTrigger>
            <TabsTrigger value="attendance">Frequência</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Informações do Aluno
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Nome:</dt>
                      <dd>{enrollment.student.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Matrícula:</dt>
                      <dd>{enrollment.student.registration_code}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Data de Nascimento:</dt>
                      <dd>{enrollment.student.birth_date ? formatDate(enrollment.student.birth_date) : "N/A"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Informações da Turma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Turma:</dt>
                      <dd>{enrollment.class.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Série:</dt>
                      <dd>{enrollment.class.grade}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Turno:</dt>
                      <dd>
                        {enrollment.class.shift === "morning"
                          ? "Manhã"
                          : enrollment.class.shift === "afternoon"
                            ? "Tarde"
                            : enrollment.class.shift === "evening"
                              ? "Noite"
                              : "Integral"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Informações da Matrícula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Número da Matrícula:</dt>
                      <dd>{enrollment.enrollment_number}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Ano Letivo:</dt>
                      <dd>{enrollment.school_year}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Data da Matrícula:</dt>
                      <dd>{formatDate(enrollment.enrollment_date)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Status:</dt>
                      <dd>{getStatusBadge(enrollment.status)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
                <CardDescription>Histórico de notas do aluno nesta matrícula</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-6">Nenhuma nota registrada para esta matrícula</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Frequência</CardTitle>
                <CardDescription>Registro de frequência do aluno nesta matrícula</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-6">
                  Nenhum registro de frequência para esta matrícula
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileTextIcon, GraduationCapIcon, MapIcon, SchoolIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart as ReBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function SecretaryDashboard() {
  // Sample data for charts and statistics
  const schoolsByRegion = [
    { region: "Zona Norte", schools: 12, students: 5800, teachers: 320 },
    { region: "Zona Sul", schools: 15, students: 7200, teachers: 410 },
    { region: "Zona Leste", schools: 18, students: 8500, teachers: 480 },
    { region: "Zona Oeste", schools: 14, students: 6800, teachers: 370 },
    { region: "Centro", schools: 8, students: 3900, teachers: 210 },
    { region: "Área Rural", schools: 5, students: 1200, teachers: 65 },
  ]

  const studentsByGrade = [
    { grade: "1º ano", students: 1200 },
    { grade: "2º ano", students: 1150 },
    { grade: "3º ano", students: 1180 },
    { grade: "4º ano", students: 1250 },
    { grade: "5º ano", students: 1220 },
    { grade: "6º ano", students: 1300 },
    { grade: "7º ano", students: 1350 },
    { grade: "8º ano", students: 1280 },
    { grade: "9º ano", students: 1320 },
    { grade: "EM - 1º", students: 950 },
    { grade: "EM - 2º", students: 900 },
    { grade: "EM - 3º", students: 850 },
  ]

  const recentReports = [
    {
      id: "RPT001",
      title: "Relatório de Desempenho Escolar - 1º Trimestre",
      date: "2023-04-15",
      type: "Desempenho",
    },
    {
      id: "RPT002",
      title: "Censo Escolar Municipal 2023",
      date: "2023-03-30",
      type: "Censo",
    },
    {
      id: "RPT003",
      title: "Relatório de Frequência - Março 2023",
      date: "2023-04-05",
      type: "Frequência",
    },
    {
      id: "RPT004",
      title: "Análise de Evasão Escolar",
      date: "2023-03-25",
      type: "Evasão",
    },
  ]

  const totalStudents = schoolsByRegion.reduce((sum, region) => sum + region.students, 0)
  const totalTeachers = schoolsByRegion.reduce((sum, region) => sum + region.teachers, 0)
  const totalSchools = schoolsByRegion.reduce((sum, region) => sum + region.schools, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <SchoolIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{totalSchools}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/schools">Ver todas as escolas</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <GraduationCapIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{totalStudents}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/students">Ver todos os alunos</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <UsersIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{totalTeachers}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/teachers">Ver todos os professores</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <FileTextIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{recentReports.length}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/reports">Ver relatórios</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Mapa da Rede</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Escolas por Região</CardTitle>
              <CardDescription>Visão geral da rede municipal de ensino</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  <MapIcon className="h-24 w-24 text-muted-foreground opacity-50" />
                  <span className="sr-only">Mapa da cidade</span>
                </div>
                <div className="space-y-4">
                  {schoolsByRegion.map((region, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{region.region}</h3>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <SchoolIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{region.schools} escolas</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{region.students} alunos</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/schools?region=${region.region}`}>Ver</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Alunos por Série</CardTitle>
              <CardDescription>Número de alunos matriculados em cada série</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ReBarChart data={studentsByGrade}>
                  <XAxis dataKey="grade" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Alunos" />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores Educacionais</CardTitle>
                <CardDescription>Métricas de desempenho da rede</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Taxa de Aprovação</p>
                      <p className="text-sm text-muted-foreground">Média da rede municipal</p>
                    </div>
                    <div className="font-medium">92%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Frequência Média</p>
                      <p className="text-sm text-muted-foreground">Presença dos alunos</p>
                    </div>
                    <div className="font-medium">94%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Taxa de Evasão</p>
                      <p className="text-sm text-muted-foreground">Alunos que deixaram a escola</p>
                    </div>
                    <div className="font-medium">3.5%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Alunos por Professor</p>
                      <p className="text-sm text-muted-foreground">Média da rede</p>
                    </div>
                    <div className="font-medium">18:1</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos e Infraestrutura</CardTitle>
                <CardDescription>Disponibilidade na rede municipal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Laboratórios de Informática</p>
                      <p className="text-sm text-muted-foreground">Escolas equipadas</p>
                    </div>
                    <div className="font-medium">85%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Bibliotecas</p>
                      <p className="text-sm text-muted-foreground">Escolas com biblioteca</p>
                    </div>
                    <div className="font-medium">92%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Quadras Esportivas</p>
                      <p className="text-sm text-muted-foreground">Escolas com quadra</p>
                    </div>
                    <div className="font-medium">78%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Acessibilidade</p>
                      <p className="text-sm text-muted-foreground">Escolas adaptadas</p>
                    </div>
                    <div className="font-medium">65%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Recentes</CardTitle>
              <CardDescription>Últimos relatórios gerados pela Secretaria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="text-sm text-muted-foreground">
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                            <Badge variant="outline">{report.type}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Visualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todos os relatórios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

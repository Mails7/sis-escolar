import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentPerformanceReport } from "@/components/reports/student-performance-report"
import { ClassOverviewReport } from "@/components/reports/class-overview-report"
import { supabase } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Relatórios | Sistema Escolar",
  description: "Geração de relatórios inteligentes para alunos e turmas",
}

// Função para obter dados de exemplo para demonstração
async function getExampleData() {
  // Tentar obter dados reais do banco de dados
  const { data: students } = await supabase.from("students").select("id, name").limit(1)
  const { data: classes } = await supabase.from("classes").select("id, name").limit(1)

  // Dados de exemplo para o aluno
  const studentData = {
    id: students?.[0]?.id || "example-student-id",
    name: students?.[0]?.name || "Ana Beatriz Silva",
    grades: [
      { subject: "Matemática", value: 8.5 },
      { subject: "Português", value: 7.8 },
      { subject: "História", value: 9.0 },
      { subject: "Geografia", value: 8.2 },
      { subject: "Ciências", value: 9.5 },
    ],
    attendance: 92,
  }

  // Dados de exemplo para a turma
  const classData = {
    id: classes?.[0]?.id || "example-class-id",
    name: classes?.[0]?.name || "1º Ano A - Ensino Fundamental",
    studentCount: 28,
    averageGrades: [
      { subject: "Matemática", average: 7.5 },
      { subject: "Português", average: 7.2 },
      { subject: "História", average: 8.1 },
      { subject: "Geografia", average: 7.8 },
      { subject: "Ciências", average: 8.3 },
    ],
    averageAttendance: 88,
  }

  return { studentData, classData }
}

export default async function ReportsPage() {
  const { studentData, classData } = await getExampleData()

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Inteligentes</h1>
          <p className="text-muted-foreground mt-2">
            Gere relatórios detalhados sobre o desempenho de alunos e turmas usando inteligência artificial
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="student">Aluno</TabsTrigger>
            <TabsTrigger value="class">Turma</TabsTrigger>
          </TabsList>
          <TabsContent value="student" className="mt-6">
            <StudentPerformanceReport student={studentData} class={classData} />
          </TabsContent>
          <TabsContent value="class" className="mt-6">
            <ClassOverviewReport class={classData} />
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sobre os Relatórios Inteligentes</CardTitle>
            <CardDescription>Como utilizar a ferramenta de geração de relatórios com IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Os relatórios inteligentes utilizam inteligência artificial para analisar dados de desempenho e gerar
              insights personalizados para alunos e turmas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Relatório de Desempenho do Aluno</h3>
                <p className="text-sm text-muted-foreground">
                  Gera uma análise detalhada do desempenho individual do aluno, destacando pontos fortes, áreas para
                  melhoria e recomendações personalizadas.
                </p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Relatório de Visão Geral da Turma</h3>
                <p className="text-sm text-muted-foreground">
                  Fornece uma análise abrangente do desempenho da turma, identificando tendências, padrões e
                  recomendações para melhorar o ensino.
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mt-4">
              <h3 className="font-medium mb-2">Dicas de Uso</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Selecione o período desejado para análise específica</li>
                <li>Os relatórios podem ser baixados em formato de texto para compartilhamento</li>
                <li>Use os insights para planejar intervenções pedagógicas personalizadas</li>
                <li>Compare relatórios de diferentes períodos para acompanhar a evolução</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

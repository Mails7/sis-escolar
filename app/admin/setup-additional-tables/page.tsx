import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { dbSchema } from "@/lib/db-schema"
import Link from "next/link"

export default function SetupAdditionalTablesPage() {
  async function setupTables() {
    "use server"

    try {
      // Criar tabela de horários de aula
      await supabase.rpc("create_class_schedules_table", {
        sql: dbSchema.class_schedules,
      })

      // Criar tabela de disciplinas
      await supabase.rpc("create_subjects_table", {
        sql: dbSchema.subjects,
      })

      // Criar tabela de matrículas
      await supabase.rpc("create_enrollments_table", {
        sql: dbSchema.enrollments,
      })

      // Inserir dados de exemplo para disciplinas
      const { error: subjectsError } = await supabase.from("subjects").upsert([
        {
          name: "Matemática",
          workload: 80,
          grade: "Ensino Fundamental",
          description: "Matemática básica para ensino fundamental",
        },
        {
          name: "Português",
          workload: 80,
          grade: "Ensino Fundamental",
          description: "Língua portuguesa para ensino fundamental",
        },
        {
          name: "História",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "História geral e do Brasil",
        },
        {
          name: "Geografia",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "Geografia geral e do Brasil",
        },
        {
          name: "Ciências",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "Ciências naturais",
        },
        {
          name: "Educação Física",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Atividades físicas e esportes",
        },
        {
          name: "Artes",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Artes visuais e música",
        },
        {
          name: "Inglês",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Língua inglesa básica",
        },
      ])

      if (subjectsError) {
        console.error("Erro ao inserir disciplinas:", subjectsError)
      }

      // Obter IDs de escolas, professores e alunos para criar classes e matrículas
      const { data: schools } = await supabase.from("schools").select("id, name")
      const { data: teachers } = await supabase.from("teachers").select("id, name")
      const { data: students } = await supabase.from("students").select("id, name")

      if (schools && teachers) {
        // Inserir dados de exemplo para classes
        const { data: classes, error: classesError } = await supabase.from("classes").upsert([
          {
            name: "1º Ano A - Ensino Fundamental",
            school_id: schools[0].id,
            school_year: 2023,
            grade: "1º Ano",
            shift: "Manhã",
            classroom: "Sala 101",
            max_students: 30,
            teacher_id: teachers[0].id,
          },
          {
            name: "2º Ano B - Ensino Fundamental",
            school_id: schools[0].id,
            school_year: 2023,
            grade: "2º Ano",
            shift: "Manhã",
            classroom: "Sala 102",
            max_students: 30,
            teacher_id: teachers[1].id,
          },
          {
            name: "3º Ano A - Ensino Fundamental",
            school_id: schools[1].id,
            school_year: 2023,
            grade: "3º Ano",
            shift: "Tarde",
            classroom: "Sala 201",
            max_students: 25,
            teacher_id: teachers[2].id,
          },
        ])

        if (classesError) {
          console.error("Erro ao inserir classes:", classesError)
        }

        // Inserir dados de exemplo para matrículas
        if (classes && students) {
          const enrollments = []

          // Matricular os primeiros 3 alunos na primeira turma
          for (let i = 0; i < Math.min(3, students.length); i++) {
            enrollments.push({
              student_id: students[i].id,
              class_id: classes[0].id,
              school_year: 2023,
              enrollment_date: "2023-02-01",
              status: "active",
            })
          }

          // Matricular os próximos 2 alunos na segunda turma
          for (let i = 3; i < Math.min(5, students.length); i++) {
            enrollments.push({
              student_id: students[i].id,
              class_id: classes[1].id,
              school_year: 2023,
              enrollment_date: "2023-02-01",
              status: "active",
            })
          }

          // Matricular os demais alunos na terceira turma
          for (let i = 5; i < students.length; i++) {
            enrollments.push({
              student_id: students[i].id,
              class_id: classes[2].id,
              school_year: 2023,
              enrollment_date: "2023-02-01",
              status: "active",
            })
          }

          const { error: enrollmentsError } = await supabase.from("enrollments").upsert(enrollments)

          if (enrollmentsError) {
            console.error("Erro ao inserir matrículas:", enrollmentsError)
          }
        }
      }

      return { success: true, message: "Tabelas adicionais criadas com sucesso!" }
    } catch (error) {
      console.error("Erro ao configurar tabelas adicionais:", error)
      return {
        success: false,
        message: "Erro ao configurar tabelas adicionais",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configuração de Tabelas Adicionais</CardTitle>
          <CardDescription>
            Esta página irá criar tabelas adicionais necessárias para o funcionamento do sistema, como horários de aula,
            disciplinas e matrículas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Ao clicar no botão abaixo, as seguintes tabelas serão criadas:</p>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Horários de Aula (class_schedules)</li>
            <li>Disciplinas (subjects)</li>
            <li>Matrículas (enrollments)</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Nota: Este processo também irá inserir dados de exemplo para facilitar os testes.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/diagnostics">
            <Button variant="outline">Voltar</Button>
          </Link>
          <form action={setupTables}>
            <Button type="submit">Configurar Tabelas Adicionais</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

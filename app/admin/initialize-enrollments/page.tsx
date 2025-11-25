import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { dbSchema } from "@/lib/db-schema"
import Link from "next/link"

export default function InitializeEnrollmentsPage() {
  async function initializeEnrollments() {
    try {
      // Verificar se a tabela já existe
      const { error: checkError } = await supabase.from("enrollments").select("id", { count: "exact", head: true })

      if (checkError && checkError.code === "42P01") {
        // Tabela não existe, vamos criá-la
        await supabase.rpc("create_enrollments_table", {
          sql: dbSchema.enrollments,
        })
      }

      // Buscar alunos e turmas para criar matrículas de exemplo
      const { data: students } = await supabase.from("students").select("id").limit(5)
      const { data: classes } = await supabase.from("classes").select("id").limit(3)

      if (!students || students.length === 0 || !classes || classes.length === 0) {
        return {
          success: false,
          message: "Não foi possível encontrar alunos ou turmas para criar matrículas de exemplo.",
        }
      }

      // Criar matrículas de exemplo
      const enrollments = []
      for (let i = 0; i < Math.min(students.length, 5); i++) {
        const classIndex = i % classes.length
        enrollments.push({
          student_id: students[i].id,
          class_id: classes[classIndex].id,
          school_year: 2023,
          enrollment_date: new Date().toISOString().split("T")[0],
          status: "active",
        })
      }

      const { error } = await supabase.from("enrollments").upsert(enrollments)

      if (error) {
        return {
          success: false,
          message: `Erro ao criar matrículas de exemplo: ${error.message}`,
        }
      }

      return {
        success: true,
        message: `${enrollments.length} matrículas de exemplo criadas com sucesso!`,
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Inicializar Matrículas</CardTitle>
          <CardDescription>
            Esta página irá criar a tabela de matrículas e adicionar alguns dados de exemplo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Clique no botão abaixo para inicializar a tabela de matrículas com dados de exemplo. Isso irá:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Criar a tabela de matrículas se ela não existir</li>
            <li>Adicionar matrículas de exemplo usando alunos e turmas existentes</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              <strong>Atenção:</strong> Certifique-se de que já existem alunos e turmas cadastrados no sistema antes de
              inicializar as matrículas.
            </p>
          </div>
          <form action={initializeEnrollments}>
            <Button type="submit">Inicializar Matrículas</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/enrollments" className="text-sm text-blue-600 hover:underline">
            Voltar para a lista de matrículas
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

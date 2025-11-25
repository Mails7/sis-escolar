import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

async function createEnrollmentsTable() {
  "use server"

  try {
    // Criar a tabela enrollments
    const { error } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS enrollments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          student_id UUID NOT NULL,
          class_id UUID NOT NULL,
          school_year INTEGER NOT NULL,
          enrollment_date DATE NOT NULL,
          enrollment_number VARCHAR(20),
          status VARCHAR(20) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar extensão uuid-ossp se não existir
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `,
    })

    if (error) {
      console.error("Error creating enrollments table:", error)
      return { success: false, message: error.message }
    }

    // Redirecionar para a página de matrículas
    redirect("/enrollments")
  } catch (error) {
    console.error("Unexpected error creating enrollments table:", error)
    return { success: false, message: "Erro inesperado ao criar tabela de matrículas" }
  }
}

export default function CreateEnrollmentsTablePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Criar Tabela de Matrículas</CardTitle>
          <CardDescription>Esta página irá criar a tabela de matrículas no banco de dados.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Clique no botão abaixo para criar a tabela de matrículas. Isso é necessário para que o sistema de matrículas
            funcione corretamente.
          </p>
        </CardContent>
        <CardFooter>
          <form action={createEnrollmentsTable}>
            <Button type="submit">Criar Tabela de Matrículas</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

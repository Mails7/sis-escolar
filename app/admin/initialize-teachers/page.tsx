import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

async function checkTeachersTable() {
  try {
    const { error } = await supabase.from("teachers").select("id").limit(1)
    return { exists: !error || error.code !== "42P01" }
  } catch (error) {
    console.error("Erro ao verificar tabela teachers:", error)
    return { exists: false, error }
  }
}

async function createTeachersTable() {
  "use server"

  try {
    // Criar função RPC para executar SQL se não existir
    await supabase
      .rpc("execute_sql", {
        sql: `
        CREATE OR REPLACE FUNCTION execute_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `,
      })
      .catch(() => {
        // Ignorar erro se a função já existir
      })

    // Criar tabela teachers
    await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS teachers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          registration TEXT,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          cellphone TEXT,
          department TEXT,
          subjects TEXT[],
          status TEXT DEFAULT 'Active',
          join_date TIMESTAMP WITH TIME ZONE,
          photo_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Inserir dados de exemplo
    const { error: insertError } = await supabase.from("teachers").upsert([
      {
        id: "TCH001",
        registration: "TCH001",
        name: "Ricardo Santos",
        email: "ricardo.santos@example.com",
        department: "Mathematics",
        subjects: ["Algebra", "Calculus"],
        status: "Active",
        join_date: "2018-03-10",
      },
      {
        id: "TCH002",
        registration: "TCH002",
        name: "Carla Mendes",
        email: "carla.mendes@example.com",
        department: "Languages",
        subjects: ["Portuguese", "Literature"],
        status: "Active",
        join_date: "2019-02-15",
      },
      {
        id: "TCH003",
        registration: "TCH003",
        name: "Paulo Oliveira",
        email: "paulo.oliveira@example.com",
        department: "Social Sciences",
        subjects: ["History", "Geography"],
        status: "Active",
        join_date: "2017-08-22",
      },
      {
        id: "TCH004",
        registration: "TCH004",
        name: "Fernanda Lima",
        email: "fernanda.lima@example.com",
        department: "Sciences",
        subjects: ["Biology", "Chemistry"],
        status: "On Leave",
        join_date: "2020-01-05",
      },
      {
        id: "TCH005",
        registration: "TCH005",
        name: "Roberto Alves",
        email: "roberto.alves@example.com",
        department: "Physical Education",
        subjects: ["Sports", "Health"],
        status: "Active",
        join_date: "2016-05-18",
      },
    ])

    if (insertError) {
      console.error("Erro ao inserir dados de exemplo:", insertError)
    }

    // Redirecionar para a página de verificação
    redirect("/admin/initialize-teachers?success=true")
  } catch (error) {
    console.error("Erro ao criar tabela teachers:", error)
    redirect("/admin/initialize-teachers?error=true")
  }
}

export default async function InitializeTeachersPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  const { exists } = await checkTeachersTable()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Inicialização da Tabela de Professores</h1>

      {searchParams.success === "true" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Sucesso</AlertTitle>
          <AlertDescription className="text-green-700">
            Tabela de professores criada e inicializada com sucesso!
          </AlertDescription>
        </Alert>
      )}

      {searchParams.error === "true" && (
        <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao criar a tabela de professores. Verifique o console para mais detalhes.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tabela de Professores</CardTitle>
          <CardDescription>Inicialização da tabela de professores no banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              {exists ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 inline" /> A tabela já existe
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 inline" /> A tabela não existe
                </span>
              )}
            </p>
            <p>
              Esta ação irá criar a tabela <code>teachers</code> no banco de dados e populá-la com dados de exemplo.
            </p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">
              <strong>Atenção:</strong> Se a tabela já existir, os dados de exemplo serão adicionados ou atualizados.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/teachers" className="text-blue-600 hover:underline">
            Voltar para a lista de professores
          </Link>
          <form action={createTeachersTable}>
            <Button type="submit" disabled={exists}>
              {exists ? "Tabela já inicializada" : "Criar e inicializar tabela"}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <Link href="/admin/setup-database" className="text-blue-600 hover:underline">
          Ir para configuração completa do banco de dados
        </Link>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Database, Check, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export const metadata = {
  title: "Inicializar Diário de Classe | Sistema Escolar",
  description: "Inicialização da tabela de diário de classe no banco de dados",
}

async function checkDiaryTable() {
  try {
    // Verificar se a tabela de diário existe
    const { error } = await supabase.from("class_diary").select("id").limit(1).maybeSingle()

    if (error) {
      console.error("Erro ao verificar tabela de diário:", error)
      return { exists: false, error: error.message }
    }

    return { exists: true }
  } catch (error) {
    console.error("Erro inesperado ao verificar tabela de diário:", error)
    return { exists: false, error: "Erro inesperado ao verificar tabela de diário" }
  }
}

async function createDiaryTable() {
  try {
    // SQL para criar a tabela de diário
    const sql = `
      -- Criar extensão para UUID se ainda não existir
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Criar tabela de diário de classe
      CREATE TABLE IF NOT EXISTS public.class_diary (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_id UUID NOT NULL,
        date DATE NOT NULL,
        subject TEXT,
        content TEXT,
        activities TEXT,
        homework TEXT,
        observations TEXT,
        attendance JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(class_id, date)
      );

      -- Adicionar índices para melhorar performance
      CREATE INDEX IF NOT EXISTS idx_class_diary_class_id ON public.class_diary(class_id);
      CREATE INDEX IF NOT EXISTS idx_class_diary_date ON public.class_diary(date);
    `

    // Executar SQL para criar a tabela
    const { error } = await supabase.rpc("execute_sql", {
      sql_query: sql,
      params: [],
    })

    if (error) {
      console.error("Erro ao criar tabela de diário:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro inesperado ao criar tabela de diário:", error)
    return { success: false, error: "Erro inesperado ao criar tabela de diário" }
  }
}

function TableStatusSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

async function TableStatus() {
  const { exists, error } = await checkDiaryTable()

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {exists ? <Check className="h-6 w-6 text-green-500" /> : <AlertTriangle className="h-6 w-6 text-yellow-500" />}
        <h2 className="text-xl font-semibold">
          {exists ? "Tabela de Diário de Classe Existe" : "Tabela de Diário de Classe Não Encontrada"}
        </h2>
      </div>

      {error && <div className="text-red-500 text-sm">Erro: {error}</div>}

      {!exists && (
        <form
          action={async () => {
            "use server"
            await createDiaryTable()
          }}
        >
          <Button type="submit" className="mt-4">
            <Database className="mr-2 h-4 w-4" />
            Criar Tabela de Diário
          </Button>
        </form>
      )}

      {exists && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p className="font-bold">Tabela configurada com sucesso!</p>
          <p>A tabela de diário de classe está pronta para uso.</p>
        </div>
      )}
    </div>
  )
}

export default function InitializeDiaryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/setup-database">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Configuração
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inicializar Diário de Classe</CardTitle>
          <CardDescription>Configure a tabela de diário de classe no banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableStatusSkeleton />}>
            <TableStatus />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/setup-database">Voltar</Link>
          </Button>
          <Button asChild>
            <Link href="/classes">Ir para Turmas</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Database, Loader2 } from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase-browser"

interface DbInitializerProps {
  tableName: string
  displayName: string
  createTableSQL: string
  sampleDataSQL?: string
  onSuccess?: () => void
}

export function DbInitializer({
  tableName,
  displayName,
  createTableSQL,
  sampleDataSQL,
  onSuccess,
}: DbInitializerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  async function createTable() {
    setIsCreating(true)
    setResult(null)

    try {
      // Primeiro, criar a função execute_sql se não existir
      const createFunctionQuery = `
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `

      try {
        await supabaseBrowser.rpc("execute_sql", { sql_query: createFunctionQuery })
      } catch (error) {
        console.log("Função execute_sql pode já existir ou houve um erro:", error)
        // Continuamos mesmo se houver erro, pois a função pode já existir
      }

      // Criar a tabela
      const { error: createTableError } = await supabaseBrowser.rpc("execute_sql", { sql_query: createTableSQL })

      if (createTableError) {
        throw new Error(`Erro ao criar tabela: ${createTableError.message}`)
      }

      // Inserir dados de exemplo, se fornecidos
      if (sampleDataSQL) {
        const { error: insertDataError } = await supabaseBrowser.rpc("execute_sql", { sql_query: sampleDataSQL })

        if (insertDataError) {
          throw new Error(`Erro ao inserir dados: ${insertDataError.message}`)
        }
      }

      setResult({
        success: true,
        message: `Tabela ${displayName} criada e inicializada com sucesso!`,
      })

      // Chamar callback de sucesso, se fornecido
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(`Erro ao criar tabela ${displayName}:`, error)
      setResult({
        success: false,
        message: `Erro ao criar tabela ${displayName}`,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          Tabela {displayName} não encontrada
        </CardTitle>
        <CardDescription className="text-yellow-700">
          A tabela {displayName} não existe no banco de dados. Atualmente exibindo dados de exemplo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <Alert
            className={`mb-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            variant={result.success ? "default" : "destructive"}
          >
            {result.success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
              {result.success ? "Sucesso" : "Erro"}
            </AlertTitle>
            <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
              {result.message}
              {result.error && <div className="mt-1 text-sm font-mono">{result.error}</div>}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-yellow-700 mb-4">
          Você pode criar a tabela {displayName} com dados de exemplo clicando no botão abaixo.
        </p>
        <Button onClick={createTable} disabled={isCreating} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando tabela...
            </>
          ) : (
            `Criar tabela ${displayName}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

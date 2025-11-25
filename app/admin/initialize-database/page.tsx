"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react"
import { checkConnection, createTables } from "@/lib/postgres"

export default function InitializeDatabasePage() {
  const [isCreating, setIsCreating] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean
    connected: boolean
    message: string
    error?: string
  }>({
    checked: false,
    connected: false,
    message: "",
  })
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  const checkDatabaseConnection = async () => {
    setConnectionStatus({
      checked: false,
      connected: false,
      message: "Verificando conexão com o banco de dados...",
    })

    try {
      const status = await checkConnection()
      setConnectionStatus({
        checked: true,
        connected: status.connected,
        message: status.message,
        error: status.error,
      })
    } catch (error) {
      setConnectionStatus({
        checked: true,
        connected: false,
        message: "Falha ao verificar conexão com o banco de dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }
  }

  const initializeDatabase = async () => {
    setIsCreating(true)
    setResult(null)

    try {
      // Verificar conexão primeiro
      const connectionCheck = await checkConnection()
      if (!connectionCheck.connected) {
        throw new Error(`Não foi possível conectar ao banco de dados: ${connectionCheck.error}`)
      }

      // Criar tabelas
      const tablesResult = await createTables()
      if (!tablesResult.success) {
        throw new Error(`Erro ao criar tabelas: ${tablesResult.error}`)
      }

      setResult({
        success: true,
        message: "Banco de dados inicializado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error)
      setResult({
        success: false,
        message: "Erro ao inicializar o banco de dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Inicialização do Banco de Dados</h1>
      <p className="text-muted-foreground mb-8">
        Esta página permite verificar a conexão com o banco de dados e criar todas as tabelas necessárias para o
        sistema.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Verificar Conexão
            </CardTitle>
            <CardDescription>Verifica se é possível conectar ao banco de dados PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Este processo verifica se o sistema consegue se conectar ao banco de dados usando as credenciais
              fornecidas.
            </p>
            {connectionStatus.checked && (
              <Alert
                variant={connectionStatus.connected ? "success" : "destructive"}
                className={connectionStatus.connected ? "bg-green-50 border-green-200" : ""}
              >
                {connectionStatus.connected ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{connectionStatus.connected ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>
                  {connectionStatus.message}
                  {connectionStatus.error && (
                    <div className="mt-2 text-sm font-mono bg-red-50 p-2 rounded">{connectionStatus.error}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkDatabaseConnection} disabled={isCreating} className="w-full">
              {connectionStatus.checked && !isCreating ? "Verificar Novamente" : "Verificar Conexão"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Criar Tabelas
            </CardTitle>
            <CardDescription>Cria todas as tabelas necessárias para o funcionamento do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Este processo criará as seguintes tabelas:</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
              <li>schools (Escolas)</li>
              <li>teachers (Professores)</li>
              <li>students (Alunos)</li>
              <li>classes (Turmas)</li>
              <li>subjects (Disciplinas)</li>
              <li>enrollments (Matrículas)</li>
              <li>schedules (Horários)</li>
              <li>attendance (Frequência)</li>
              <li>grades (Notas)</li>
              <li>class_diary (Diário de Classe)</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={initializeDatabase}
              disabled={isCreating || !connectionStatus.connected}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Tabelas...
                </>
              ) : (
                "Criar Tabelas"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {result && (
        <Card className={`mt-6 ${result.success ? "border-green-200" : "border-red-200"}`}>
          <CardHeader>
            <CardTitle className={result.success ? "text-green-600" : "text-red-600"}>
              {result.success ? "Operação Concluída" : "Erro"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded ${result.success ? "bg-green-50" : "bg-red-50"}`}>
              <div className="flex items-start">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                    {result.message}
                  </p>
                  {result.error && <pre className="mt-2 text-sm text-red-800 whitespace-pre-wrap">{result.error}</pre>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <a href="/">Voltar para o Dashboard</a>
        </Button>
      </div>
    </div>
  )
}

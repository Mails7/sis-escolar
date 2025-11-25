"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SetupDatabasePage() {
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

  const [createStatus, setCreateStatus] = useState<{
    loading: boolean
    completed: boolean
    success: boolean
    message: string
    error?: string
  }>({
    loading: false,
    completed: false,
    success: false,
    message: "",
  })

  const [seedStatus, setSeedStatus] = useState<{
    loading: boolean
    completed: boolean
    success: boolean
    message: string
    error?: string
  }>({
    loading: false,
    completed: false,
    success: false,
    message: "",
  })

  const checkConnection = async () => {
    setConnectionStatus({
      checked: false,
      connected: false,
      message: "Verificando conexão com o banco de dados...",
    })

    try {
      const response = await fetch("/api/db-check")
      const data = await response.json()

      setConnectionStatus({
        checked: true,
        connected: data.connected,
        message: data.message,
        error: data.error,
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

  const createTables = async () => {
    setCreateStatus({
      loading: true,
      completed: false,
      success: false,
      message: "Criando tabelas no banco de dados...",
    })

    try {
      const response = await fetch("/api/db-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "createTables" }),
      })

      const data = await response.json()

      setCreateStatus({
        loading: false,
        completed: true,
        success: data.success,
        message: data.success ? "Tabelas criadas com sucesso!" : "Falha ao criar tabelas",
        error: data.error,
      })
    } catch (error) {
      setCreateStatus({
        loading: false,
        completed: true,
        success: false,
        message: "Falha ao criar tabelas",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }
  }

  const seedData = async () => {
    setSeedStatus({
      loading: true,
      completed: false,
      success: false,
      message: "Populando banco de dados com dados iniciais...",
    })

    try {
      const response = await fetch("/api/db-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "seedDatabase" }),
      })

      const data = await response.json()

      setSeedStatus({
        loading: false,
        completed: true,
        success: data.success,
        message: data.success ? "Dados iniciais inseridos com sucesso!" : "Falha ao inserir dados iniciais",
        error: data.error,
      })
    } catch (error) {
      setSeedStatus({
        loading: false,
        completed: true,
        success: false,
        message: "Falha ao inserir dados iniciais",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configuração do Banco de Dados</h1>
      <p className="text-muted-foreground mb-8">
        Esta página permite configurar o banco de dados PostgreSQL para o sistema Educar.
      </p>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Passo 1: Verificar Conexão
            </CardTitle>
            <CardDescription>Verifica se é possível conectar ao banco de dados PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent>
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

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Detalhes da conexão:</p>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <p>Host: escolar_semec (interno) / 168.231.97.96 (externo)</p>
                <p>Porta: 5432 (interno) / 5433 (externo)</p>
                <p>Usuário: semec</p>
                <p>Banco de dados: semec</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={checkConnection} disabled={connectionStatus.checked && connectionStatus.loading}>
              {connectionStatus.checked ? "Verificar Novamente" : "Verificar Conexão"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Passo 2: Criar Tabelas
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

            {createStatus.completed && (
              <Alert
                variant={createStatus.success ? "success" : "destructive"}
                className={createStatus.success ? "bg-green-50 border-green-200" : ""}
              >
                {createStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{createStatus.success ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>
                  {createStatus.message}
                  {createStatus.error && (
                    <div className="mt-2 text-sm font-mono bg-red-50 p-2 rounded">{createStatus.error}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={createTables}
              disabled={createStatus.loading || !connectionStatus.connected}
              className="w-full"
            >
              {createStatus.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Tabelas...
                </>
              ) : createStatus.completed && createStatus.success ? (
                "Criar Tabelas Novamente"
              ) : (
                "Criar Tabelas"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Passo 3: Inserir Dados Iniciais
            </CardTitle>
            <CardDescription>Popula o banco de dados com dados iniciais para teste</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Este processo inserirá dados iniciais nas tabelas:</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
              <li>3 escolas</li>
              <li>5 professores</li>
              <li>5 alunos</li>
              <li>5 disciplinas</li>
              <li>5 turmas</li>
              <li>5 matrículas</li>
              <li>5 horários</li>
            </ul>

            {seedStatus.completed && (
              <Alert
                variant={seedStatus.success ? "success" : "destructive"}
                className={seedStatus.success ? "bg-green-50 border-green-200" : ""}
              >
                {seedStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{seedStatus.success ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>
                  {seedStatus.message}
                  {seedStatus.error && (
                    <div className="mt-2 text-sm font-mono bg-red-50 p-2 rounded">{seedStatus.error}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={seedData}
              disabled={
                seedStatus.loading || !connectionStatus.connected || !createStatus.completed || !createStatus.success
              }
              className="w-full"
            >
              {seedStatus.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inserindo Dados...
                </>
              ) : seedStatus.completed && seedStatus.success ? (
                "Inserir Dados Novamente"
              ) : (
                "Inserir Dados Iniciais"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/">Voltar para o Dashboard</Link>
        </Button>
        {seedStatus.completed && seedStatus.success && (
          <Button asChild>
            <Link href="/schools">Ver Escolas</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

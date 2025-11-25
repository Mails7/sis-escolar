"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckConnectionPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [connectionDetails, setConnectionDetails] = useState<{
    url: string
    host: string
    port: string
    database: string
    user: string
  }>({
    url: "postgres://semec:semec@168.231.97.96:5433/semec?sslmode=disable",
    host: "168.231.97.96",
    port: "5433",
    database: "semec",
    user: "semec",
  })
  const [result, setResult] = useState<{
    checked: boolean
    connected: boolean
    message: string
    timestamp?: string
    error?: string
    details?: any
  }>({
    checked: false,
    connected: false,
    message: "",
  })

  // Verificar conexão automaticamente ao carregar a página
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsChecking(true)
    setResult({
      checked: false,
      connected: false,
      message: "Verificando conexão com o banco de dados...",
    })

    try {
      const response = await fetch("/api/db-check")
      const data = await response.json()

      setResult({
        checked: true,
        connected: data.connected,
        message: data.message,
        timestamp: data.timestamp,
        error: data.error,
        details: data.details,
      })
    } catch (error) {
      setResult({
        checked: true,
        connected: false,
        message: "Falha ao verificar conexão com o banco de dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Verificação de Conexão com o Banco de Dados</h1>
      <p className="text-muted-foreground mb-8">
        Esta página verifica se o sistema consegue se conectar ao banco de dados PostgreSQL.
      </p>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuração de Conexão
            </CardTitle>
            <CardDescription>Detalhes da conexão com o banco de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">URL de Conexão:</h3>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono overflow-x-auto">
                  {connectionDetails.url}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Host:</h3>
                  <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{connectionDetails.host}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Porta:</h3>
                  <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{connectionDetails.port}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Banco de Dados:</h3>
                  <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{connectionDetails.database}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Usuário:</h3>
                  <div className="p-2 bg-gray-50 rounded border text-sm font-mono">{connectionDetails.user}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status da Conexão
            </CardTitle>
            <CardDescription>Resultado da verificação de conexão</CardDescription>
          </CardHeader>
          <CardContent>
            {!result.checked ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Verificando conexão...</p>
              </div>
            ) : result.connected ? (
              <Alert variant="success" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Conexão estabelecida com sucesso</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p>{result.message}</p>
                  {result.timestamp && (
                    <p className="mt-2 text-sm">
                      <strong>Timestamp do servidor:</strong> {result.timestamp}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha na conexão</AlertTitle>
                <AlertDescription>
                  <p>{result.message}</p>
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-50 rounded border border-red-200 text-sm font-mono overflow-x-auto">
                      {result.error}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={checkConnection} disabled={isChecking}>
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Novamente"
              )}
            </Button>
            {result.connected && (
              <Link href="/admin/initialize-database">
                <Button variant="outline">Próximo: Inicializar Banco de Dados</Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solução de Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Se a conexão falhar, verifique:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Se o servidor de banco de dados está em execução</li>
                  <li>Se as credenciais (usuário e senha) estão corretas</li>
                  <li>Se o host e a porta estão corretos</li>
                  <li>Se há algum firewall bloqueando a conexão</li>
                  <li>Se o banco de dados "semec" existe no servidor</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Erros comuns:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>ECONNREFUSED</strong>: O servidor não está aceitando conexões na porta especificada
                  </li>
                  <li>
                    <strong>ETIMEDOUT</strong>: Tempo limite de conexão excedido, verifique o firewall
                  </li>
                  <li>
                    <strong>password authentication failed</strong>: Senha incorreta
                  </li>
                  <li>
                    <strong>database does not exist</strong>: O banco de dados especificado não existe
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

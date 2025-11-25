"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkDatabaseStatus() {
      try {
        const response = await fetch("/api/db-check")
        const data = await response.json()

        if (data.connected) {
          setStatus("ok")
          setMessage(data.message)
        } else {
          setStatus("error")
          setMessage(data.message)
          setError(data.error || "")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Erro ao verificar status do banco de dados")
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      }
    }

    checkDatabaseStatus()
  }, [])

  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Verificando status do banco de dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Verificando conexão...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "ok") {
    return (
      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Banco de dados conectado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">{message}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/setup-database">Gerenciar Banco de Dados</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Problema na conexão com o banco de dados
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Ação necessária</AlertTitle>
            <AlertDescription className="text-amber-700">
              Para utilizar todas as funcionalidades do sistema, é necessário configurar a conexão com o banco de dados.
            </AlertDescription>
          </Alert>

          {error && (
            <div className="p-2 rounded bg-red-50 border border-red-200">
              <p className="text-xs text-red-700 font-mono">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/admin/setup-database">
          <Button>Configurar Banco de Dados</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

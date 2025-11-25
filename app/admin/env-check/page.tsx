"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { checkSupabaseHealth } from "@/lib/supabase"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function EnvCheckPage() {
  const [serverStatus, setServerStatus] = useState<"checking" | "success" | "error">("checking")
  const [clientStatus, setClientStatus] = useState<"checking" | "success" | "error">("checking")
  const [aiStatus, setAiStatus] = useState<"checking" | "success" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Check server connection
    const checkServer = async () => {
      try {
        const result = await checkSupabaseHealth()
        if (result.healthy) {
          setServerStatus("success")
        } else {
          setServerStatus("error")
          setErrorMessage((prev) => `${prev}\nServer error: ${result.error}`)
        }
      } catch (error) {
        setServerStatus("error")
        setErrorMessage((prev) => `${prev}\nServer check failed: ${error}`)
      }
    }

    // Check client connection
    const checkClient = async () => {
      try {
        const { data, error } = await supabaseBrowser.from("students").select("count", { count: "exact", head: true })
        if (!error) {
          setClientStatus("success")
        } else {
          setClientStatus("error")
          setErrorMessage((prev) => `${prev}\nClient error: ${error.message}`)
        }
      } catch (error) {
        setClientStatus("error")
        setErrorMessage((prev) => `${prev}\nClient check failed: ${error}`)
      }
    }

    // Check AI connection
    const checkAI = async () => {
      try {
        // Simple check if XAI_API_KEY exists
        const hasAiKey = process.env.XAI_API_KEY || process.env.NEXT_PUBLIC_XAI_API_KEY
        if (hasAiKey) {
          setAiStatus("success")
        } else {
          setAiStatus("error")
          setErrorMessage((prev) => `${prev}\nAI API key not found`)
        }
      } catch (error) {
        setAiStatus("error")
        setErrorMessage((prev) => `${prev}\nAI check failed: ${error}`)
      }
    }

    checkServer()
    checkClient()
    checkAI()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Verificação de Ambiente</h1>
      <p className="text-muted-foreground mb-8">
        Esta página verifica se todas as variáveis de ambiente estão configuradas corretamente.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conexão com Servidor
              <StatusBadge status={serverStatus} />
            </CardTitle>
            <CardDescription>Verifica a conexão do servidor com o Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {serverStatus === "checking"
                ? "Verificando conexão..."
                : serverStatus === "success"
                  ? "Conexão estabelecida com sucesso!"
                  : "Falha na conexão com o servidor."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conexão com Cliente
              <StatusBadge status={clientStatus} />
            </CardTitle>
            <CardDescription>Verifica a conexão do cliente com o Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {clientStatus === "checking"
                ? "Verificando conexão..."
                : clientStatus === "success"
                  ? "Conexão estabelecida com sucesso!"
                  : "Falha na conexão com o cliente."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              API de IA
              <StatusBadge status={aiStatus} />
            </CardTitle>
            <CardDescription>Verifica a configuração da API de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {aiStatus === "checking"
                ? "Verificando configuração..."
                : aiStatus === "success"
                  ? "API de IA configurada com sucesso!"
                  : "Falha na configuração da API de IA."}
            </p>
          </CardContent>
        </Card>
      </div>

      {errorMessage && (
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Erros Encontrados</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-red-50 p-4 rounded text-red-800 text-sm whitespace-pre-wrap">{errorMessage}</pre>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex gap-4">
        <Button asChild>
          <a href="/setup">Ir para Configuração do Banco de Dados</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Voltar para o Dashboard</a>
        </Button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: "checking" | "success" | "error" }) {
  if (status === "checking") {
    return (
      <Badge variant="outline" className="animate-pulse">
        Verificando
      </Badge>
    )
  } else if (status === "success") {
    return (
      <Badge variant="default" className="bg-green-500">
        Conectado
      </Badge>
    )
  } else {
    return <Badge variant="destructive">Erro</Badge>
  }
}

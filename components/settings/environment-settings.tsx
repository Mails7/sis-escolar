"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, RefreshCw, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

export function EnvironmentSettings() {
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({
    NEXT_PUBLIC_SUPABASE_URL: false,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: false,
    SUPABASE_URL: false,
    SUPABASE_KEY: false,
    NEXT_PUBLIC_XAI_API_KEY: false,
    NEXT_PUBLIC_APP_URL: false,
  })

  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    setIsChecking(true)
    try {
      // Simulação de verificação de variáveis de ambiente
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Em um ambiente real, isso seria verificado pelo servidor
      setEnvStatus({
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_URL: true, // Simulado
        SUPABASE_KEY: true, // Simulado
        NEXT_PUBLIC_XAI_API_KEY: !!process.env.NEXT_PUBLIC_XAI_API_KEY,
        NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      })
    } catch (error) {
      console.error("Erro ao verificar variáveis de ambiente:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const copyEnvTemplate = () => {
    const template = `NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-key
NEXT_PUBLIC_XAI_API_KEY=your-xai-api-key
NEXT_PUBLIC_APP_URL=your-app-url`

    navigator.clipboard
      .writeText(template)
      .then(() => {
        alert("Template copiado para a área de transferência!")
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err)
      })
  }

  const configuredCount = Object.values(envStatus).filter(Boolean).length
  const totalCount = Object.keys(envStatus).length
  const allConfigured = configuredCount === totalCount

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status das Variáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {configuredCount}/{totalCount}
                </span>
                <span className="text-sm text-muted-foreground">configuradas</span>
              </div>
              {allConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={checkEnvironment} disabled={isChecking}>
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Novamente"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Template .env</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Copie o template de variáveis de ambiente para configurar seu projeto.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={copyEnvTemplate}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Template
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variáveis de Ambiente</CardTitle>
          <CardDescription>Status das variáveis de ambiente necessárias para o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(envStatus).map(([env, status]) => (
              <div key={env} className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">{env}</div>
                <Badge variant={status ? "default" : "outline"}>{status ? "Configurada" : "Não Configurada"}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/admin/env-setup" className="w-full">
            <Button className="w-full">Configurar Variáveis de Ambiente</Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Configuração</CardTitle>
          <CardDescription>Como configurar as variáveis de ambiente para o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">1. Crie um arquivo .env.local</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Na raiz do projeto, crie um arquivo chamado .env.local para armazenar suas variáveis de ambiente.
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Configure o Supabase</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Obtenha suas credenciais do Supabase no painel de controle do projeto.
            </p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Acessar Supabase
              </Link>
            </Button>
          </div>

          <div>
            <h3 className="font-medium">3. Configure a API do Xai</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Obtenha sua chave de API do Xai (Grok) para recursos de IA.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Reinicie o servidor</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Após configurar as variáveis, reinicie o servidor para aplicar as alterações.
            </p>
          </div>
        </CardContent>
      </Card>

      {!allConfigured && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração Incompleta</AlertTitle>
          <AlertDescription>
            Algumas variáveis de ambiente necessárias não estão configuradas. Isso pode limitar a funcionalidade do
            sistema.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

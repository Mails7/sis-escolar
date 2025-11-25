"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2, Settings } from "lucide-react"

export default function EnvSetupPage() {
  const [envStatus, setEnvStatus] = useState<{
    variables: Record<string, string | null>
    missing: string[]
    allDefined: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular a verificação das variáveis de ambiente no lado do cliente
    const checkEnv = async () => {
      try {
        // No lado do cliente, não podemos acessar process.env diretamente
        // Então vamos verificar apenas as variáveis públicas
        const variables = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
        }

        const missing = Object.entries(variables)
          .filter(([_, value]) => value === null)
          .map(([key]) => key)

        setEnvStatus({
          variables,
          missing,
          allDefined: missing.length === 0,
        })
      } catch (error) {
        console.error("Erro ao verificar variáveis de ambiente:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnv()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configuração de Variáveis de Ambiente</h1>
      <p className="text-muted-foreground mb-8">
        Esta página permite verificar e configurar as variáveis de ambiente necessárias para o funcionamento do sistema.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Variáveis de Ambiente
              </CardTitle>
              <CardDescription>Verifique o status das variáveis de ambiente necessárias</CardDescription>
            </CardHeader>
            <CardContent>
              {envStatus && (
                <>
                  <div className="mb-4">
                    <Alert
                      className={`${
                        envStatus.allDefined ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      {envStatus.allDefined ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <AlertTitle className={`${envStatus.allDefined ? "text-green-800" : "text-yellow-800"}`}>
                        {envStatus.allDefined
                          ? "Todas as variáveis de ambiente estão configuradas"
                          : "Algumas variáveis de ambiente estão faltando"}
                      </AlertTitle>
                      <AlertDescription className={`${envStatus.allDefined ? "text-green-700" : "text-yellow-700"}`}>
                        {envStatus.allDefined
                          ? "O sistema está pronto para uso."
                          : "Configure as variáveis de ambiente faltantes para garantir o funcionamento correto do sistema."}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Status das Variáveis</h3>
                    <div className="space-y-2">
                      {Object.entries(envStatus.variables).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                          <span className="font-medium">{key}</span>
                          {value ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" /> Configurada
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <AlertCircle className="w-4 h-4 mr-1" /> Não configurada
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!envStatus.allDefined && (
                    <div className="mt-6 p-4 bg-gray-50 border rounded-md">
                      <h3 className="text-lg font-medium mb-2">Como configurar as variáveis de ambiente</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          Crie um arquivo <code className="bg-gray-100 p-1 rounded">.env.local</code> na raiz do
                          projeto.
                        </li>
                        <li>
                          Adicione as seguintes variáveis ao arquivo:
                          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {envStatus.missing.map((key) => `${key}=seu_valor_aqui`).join("\n")}
                          </pre>
                        </li>
                        <li>Reinicie o servidor de desenvolvimento.</li>
                      </ol>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Você pode obter os valores dessas variáveis no painel de controle do Supabase.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href="/">Voltar para o Dashboard</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin/setup-database">Configurar Banco de Dados</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

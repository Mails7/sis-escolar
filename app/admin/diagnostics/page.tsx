import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Database, Server, ShieldCheck } from "lucide-react"

async function testDatabaseConnection() {
  try {
    const startTime = Date.now()
    const { data, error } = await supabase.from("schools").select("count", { count: "exact", head: true })
    const endTime = Date.now()
    const responseTime = endTime - startTime

    return {
      success: !error,
      message: error ? error.message : "Conexão bem-sucedida",
      responseTime,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      responseTime: 0,
    }
  }
}

async function getEnvironmentVariables() {
  const variables = [
    { name: "SUPABASE_URL", exists: !!process.env.SUPABASE_URL },
    { name: "SUPABASE_ANON_KEY", exists: !!process.env.SUPABASE_ANON_KEY },
    { name: "NEXT_PUBLIC_SUPABASE_URL", exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: "XAI_API_KEY", exists: !!process.env.XAI_API_KEY },
  ]

  return variables
}

async function getDatabaseInfo() {
  try {
    // Contar registros em cada tabela
    const tables = ["schools", "teachers", "students", "classes", "subjects", "enrollments", "class_schedules"]

    const counts = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })
        return {
          table,
          count: error ? 0 : count || 0,
          error: error ? error.message : null,
        }
      }),
    )

    return counts
  } catch (error) {
    console.error("Erro ao buscar informações do banco de dados:", error)
    return []
  }
}

function ConnectionStatusSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
      <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}

function EnvVariablesSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2 border rounded-md">
          <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

function DatabaseInfoSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2 border rounded-md">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

export default async function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Diagnóstico do Sistema</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" /> Status da Conexão
            </CardTitle>
            <CardDescription>Verifica a conexão com o banco de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ConnectionStatusSkeleton />}>
              <ConnectionStatus />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" /> Variáveis de Ambiente
            </CardTitle>
            <CardDescription>Verifica as variáveis de ambiente necessárias</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<EnvVariablesSkeleton />}>
              <EnvironmentVariables />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" /> Informações do Banco de Dados
            </CardTitle>
            <CardDescription>Exibe informações sobre as tabelas do banco de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DatabaseInfoSkeleton />}>
              <DatabaseInfo />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function ConnectionStatus() {
  const connection = await testDatabaseConnection()

  return (
    <div>
      {connection.success ? (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Conexão estabelecida</AlertTitle>
          <AlertDescription className="text-green-700">
            A conexão com o banco de dados foi estabelecida com sucesso.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription>{connection.message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Tempo de resposta: <span className="font-medium">{connection.responseTime}ms</span>
        </p>
      </div>
    </div>
  )
}

async function EnvironmentVariables() {
  const variables = await getEnvironmentVariables()

  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div key={variable.name} className="flex items-center justify-between p-2 border rounded-md">
          <span className="font-medium">{variable.name}</span>
          {variable.exists ? (
            <span className="flex items-center text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Configurada
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" /> Não configurada
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

async function DatabaseInfo() {
  const info = await getDatabaseInfo()

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Tabela</th>
            <th className="p-2 text-right">Registros</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {info.map((item) => (
            <tr key={item.table} className="border-b">
              <td className="p-2 font-medium">{item.table}</td>
              <td className="p-2 text-right">{item.count}</td>
              <td className="p-2">
                {item.error ? (
                  <span className="flex items-center text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" /> {item.error}
                  </span>
                ) : (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> OK
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, RefreshCw, Database, Table, Plus } from "lucide-react"
import Link from "next/link"
import { tableExists } from "@/lib/postgres"

export function DatabaseSettings() {
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({
    students: false,
    teachers: false,
    schools: false,
    classes: false,
    enrollments: false,
    schedules: false,
    diary: false,
  })

  const [isChecking, setIsChecking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setIsChecking(true)
    setConnectionStatus("checking")

    try {
      // Verificar conexão com o banco de dados
      const studentsExists = await tableExists("students")
      setConnectionStatus(studentsExists ? "connected" : "error")

      // Verificar tabelas
      const tables = {
        students: await tableExists("students"),
        teachers: await tableExists("teachers"),
        schools: await tableExists("schools"),
        classes: await tableExists("classes"),
        enrollments: await tableExists("enrollments"),
        schedules: await tableExists("schedules"),
        diary: await tableExists("diary"),
      }

      setTablesStatus(tables)
    } catch (error) {
      console.error("Erro ao verificar status do banco de dados:", error)
      setConnectionStatus("error")
    } finally {
      setIsChecking(false)
    }
  }

  const configuredCount = Object.values(tablesStatus).filter(Boolean).length
  const totalCount = Object.keys(tablesStatus).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status da Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span className="font-medium">Banco de Dados</span>
              </div>
              {connectionStatus === "checking" ? (
                <Badge variant="outline" className="animate-pulse">
                  Verificando
                </Badge>
              ) : connectionStatus === "connected" ? (
                <Badge variant="default" className="bg-green-500">
                  Conectado
                </Badge>
              ) : (
                <Badge variant="destructive">Erro</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={checkDatabaseStatus} disabled={isChecking}>
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
            <CardTitle className="text-sm font-medium">Status das Tabelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {configuredCount}/{totalCount}
                </span>
                <span className="text-sm text-muted-foreground">tabelas criadas</span>
              </div>
              <Table className="h-5 w-5" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/setup-database">
                <Plus className="mr-2 h-4 w-4" />
                Criar Tabelas
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabelas do Sistema</CardTitle>
          <CardDescription>Status das tabelas necessárias para o funcionamento do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(tablesStatus).map(([table, status]) => (
              <div key={table} className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium capitalize">{table}</div>
                {status ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" /> Criada
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <AlertCircle className="mr-1 h-3 w-3" /> Não Criada
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" asChild>
            <Link href="/admin/setup-database">Configurar Banco de Dados</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/diagnostics">Diagnóstico do Banco de Dados</Link>
          </Button>
        </CardFooter>
      </Card>

      {connectionStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao banco de dados. Verifique as variáveis de ambiente e a configuração do
            Supabase.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

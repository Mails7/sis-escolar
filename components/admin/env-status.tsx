"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EnvStatus() {
  const [envStatus, setEnvStatus] = useState<{
    allDefined: boolean
    missing: string[]
  } | null>(null)

  useEffect(() => {
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
      missing,
      allDefined: missing.length === 0,
    })
  }, [])

  if (!envStatus) {
    return null
  }

  if (envStatus.allDefined) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Variáveis de Ambiente Configuradas</AlertTitle>
        <AlertDescription className="text-green-700">
          Todas as variáveis de ambiente necessárias estão configuradas corretamente.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Configuração Incompleta</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p className="mb-2">
          As seguintes variáveis de ambiente estão faltando: {envStatus.missing.join(", ")}. Isso pode afetar o
          funcionamento do sistema.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/env-setup">Configurar Variáveis de Ambiente</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

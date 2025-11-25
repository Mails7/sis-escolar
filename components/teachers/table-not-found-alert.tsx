import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TableNotFoundAlert() {
  return (
    <Alert className="mb-6 bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Tabela não encontrada</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p className="mb-2">
          A tabela de professores não foi encontrada no banco de dados. Isso pode ocorrer se o banco de dados não foi
          inicializado corretamente.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/admin/initialize-teachers">Inicializar tabela de professores</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

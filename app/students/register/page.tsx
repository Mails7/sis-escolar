import type { Metadata } from "next"
import { StudentForm } from "@/components/students/student-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cadastrar Aluno | Educar",
  description: "Cadastre um novo aluno no sistema",
}

export default function RegisterStudentPage() {
  return (
    <div className="container mx-auto py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>
                <Home className="mr-1 h-4 w-4 inline" />
                Início
              </BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/students" passHref legacyBehavior>
              <BreadcrumbLink>Alunos</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Cadastrar</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Aluno</h1>
        <p className="text-muted-foreground">Preencha o formulário abaixo para cadastrar um novo aluno.</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Modo de demonstração</AlertTitle>
        <AlertDescription>
          Se o banco de dados não estiver configurado, o sistema funcionará em modo de demonstração, permitindo testar o
          formulário sem salvar os dados.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro</CardTitle>
          <CardDescription>Informações do aluno</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm />
        </CardContent>
      </Card>
    </div>
  )
}

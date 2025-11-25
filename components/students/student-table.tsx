"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MoreHorizontalIcon, RefreshCw, WifiOff } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentFilters } from "./student-filters"

// Sample data as fallback
const sampleStudents = [
  {
    id: "STD001",
    registration_id: "STD001",
    name: "Ana Beatriz Silva",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "ana.silva@example.com",
    grade: "9th",
    status: "Active",
    enrollment_date: "2023-02-15",
  },
  {
    id: "STD002",
    registration_id: "STD002",
    name: "Pedro Henrique Santos",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "pedro.santos@example.com",
    grade: "10th",
    status: "Active",
    enrollment_date: "2022-02-10",
  },
  {
    id: "STD003",
    registration_id: "STD003",
    name: "Gabriela Oliveira",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "gabriela.oliveira@example.com",
    grade: "8th",
    status: "Active",
    enrollment_date: "2023-02-15",
  },
  {
    id: "STD004",
    registration_id: "STD004",
    name: "Lucas Martins",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "lucas.martins@example.com",
    grade: "11th",
    status: "Inactive",
    enrollment_date: "2021-02-12",
  },
  {
    id: "STD005",
    registration_id: "STD005",
    name: "Juliana Costa",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "juliana.costa@example.com",
    grade: "12th",
    status: "Active",
    enrollment_date: "2020-02-14",
  },
]

interface Student {
  id: string
  registration_id: string
  name: string
  email: string
  grade: string
  status: string
  enrollment_date: string
  photo_url?: string
}

export function StudentTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const [totalPages, setTotalPages] = useState(1)
  const [retryCount, setRetryCount] = useState(0)
  const [usingSampleData, setUsingSampleData] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Use sample data immediately to avoid showing loading state
  useEffect(() => {
    setStudents(sampleStudents)
    setFilteredStudents(sampleStudents)
    setUsingSampleData(true)
    setLoading(false)
    setTotalPages(Math.ceil(sampleStudents.length / itemsPerPage))
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const handleFilterChange = (filters: any) => {
    let result = [...students]

    // Filtrar por texto de busca (nome ou ID)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchLower) ||
          student.registration_id.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower),
      )
    }

    // Filtrar por status
    if (filters.status) {
      result = result.filter((student) => student.status === filters.status)
    }

    // Filtrar por série
    if (filters.grade) {
      result = result.filter((student) => student.grade === filters.grade)
    }

    // Filtrar por data de matrícula (de)
    if (filters.enrollmentDateFrom) {
      const fromDate = new Date(filters.enrollmentDateFrom)
      result = result.filter((student) => new Date(student.enrollment_date) >= fromDate)
    }

    // Filtrar por data de matrícula (até)
    if (filters.enrollmentDateTo) {
      const toDate = new Date(filters.enrollmentDateTo)
      toDate.setHours(23, 59, 59, 999) // Fim do dia
      result = result.filter((student) => new Date(student.enrollment_date) <= toDate)
    }

    setFilteredStudents(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setPage(1) // Resetar para a primeira página ao filtrar
  }

  // Calcular os estudantes a serem exibidos na página atual
  const displayStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  if (connectionError) {
    return (
      <Card className="border-red-200 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <WifiOff className="h-5 w-5" />
            Erro de Conexão
          </CardTitle>
          <CardDescription>Não foi possível conectar ao banco de dados. Exibindo dados de exemplo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de Conexão</AlertTitle>
            <AlertDescription>
              {connectionError}
              <div className="mt-2">
                <p className="text-sm">
                  Verifique se as variáveis de ambiente estão configuradas corretamente e se o Supabase está acessível.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRetry} variant="outline" className="mr-2">
            Tentar Novamente
          </Button>
          <Button asChild variant="default">
            <Link href="/admin/env-check">Verificar Configuração</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p>Não foi possível conectar ao banco de dados: {error.message}</p>
              <div className="flex items-center gap-2">
                <p>Exibindo dados de exemplo.</p>
                <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Tentar Novamente
                </Button>
              </div>
              <p className="text-xs mt-2">
                Se o erro persistir, verifique sua conexão com o banco de dados ou visite a{" "}
                <Link href="/setup" className="underline">
                  página de configuração
                </Link>{" "}
                para inicializar seu banco de dados.
              </p>
              <p className="text-xs mt-1">
                Você também pode verificar o status das suas variáveis de ambiente na{" "}
                <Link href="/admin/env-check" className="underline">
                  página de verificação de ambiente
                </Link>
                .
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {usingSampleData && !error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Exibindo dados de exemplo. Para ver dados reais, certifique-se de que seu banco de dados esteja configurado
            corretamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Componente de filtros */}
      <StudentFilters onFilterChange={handleFilterChange} availableGrades={["8th", "9th", "10th", "11th", "12th"]} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudante</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Matrícula</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !usingSampleData ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : displayStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum estudante encontrado.
                </TableCell>
              </TableRow>
            ) : (
              displayStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={student.photo_url || "/placeholder.svg?height=40&width=40"}
                          alt={student.name}
                        />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.registration_id}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "Active"
                          ? "default"
                          : student.status === "Inactive"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${student.id}`}>Ver perfil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${student.id}/edit`}>Editar detalhes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver frequência</DropdownMenuItem>
                        <DropdownMenuItem>Ver notas</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Desativar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage(i + 1)
                }}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

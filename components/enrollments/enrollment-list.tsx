"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Search } from "lucide-react"

type Enrollment = {
  id: string
  student: { id: string; name: string }
  class: { id: string; name: string }
  school_year: number
  enrollment_date: string
  enrollment_number: string
  status: string
}

interface EnrollmentListProps {
  enrollments: Enrollment[]
}

export function EnrollmentList({ enrollments }: EnrollmentListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR").format(date)
  }

  // Filtrar matrículas
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por aluno ou número de matrícula"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="transferred">Transferido</SelectItem>
            <SelectItem value="graduated">Formado</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="current">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ano letivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Ano atual (2023)</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="all">Todos os anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Matrícula</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhuma matrícula encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">{enrollment.enrollment_number}</TableCell>
                  <TableCell>{enrollment.student?.name || "Nome não disponível"}</TableCell>
                  <TableCell>{enrollment.class?.name || "Turma não disponível"}</TableCell>
                  <TableCell>{formatDate(enrollment.enrollment_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        enrollment.status === "active"
                          ? "default"
                          : enrollment.status === "inactive"
                            ? "secondary"
                            : enrollment.status === "transferred"
                              ? "outline"
                              : "success"
                      }
                    >
                      {enrollment.status === "active"
                        ? "Ativo"
                        : enrollment.status === "inactive"
                          ? "Inativo"
                          : enrollment.status === "transferred"
                            ? "Transferido"
                            : "Formado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/enrollments/${enrollment.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </Link>
                      <Link href={`/enrollments/${enrollment.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

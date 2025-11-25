"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, PlusIcon, FilterIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface SchoolStudentsProps {
  id: string
}

export function SchoolStudents({ id }: SchoolStudentsProps) {
  // In a real application, you would fetch this data based on the ID
  const students = [
    {
      id: "STD001",
      name: "Ana Beatriz Silva",
      image: "/placeholder.svg?height=40&width=40",
      initials: "AS",
      grade: "9º ano",
      class: "A",
      age: 14,
      status: "Active",
      enrollmentDate: "2023-02-15",
      attendance: 95,
      guardian: "Maria Silva (Mãe)",
    },
    {
      id: "STD002",
      name: "Pedro Henrique Santos",
      image: "/placeholder.svg?height=40&width=40",
      initials: "PS",
      grade: "Ensino Médio - 1º ano",
      class: "A",
      age: 15,
      status: "Active",
      enrollmentDate: "2022-02-10",
      attendance: 92,
      guardian: "João Santos (Pai)",
    },
    {
      id: "STD003",
      name: "Gabriela Oliveira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "GO",
      grade: "8º ano",
      class: "B",
      age: 13,
      status: "Active",
      enrollmentDate: "2023-02-15",
      attendance: 98,
      guardian: "Carlos Oliveira (Pai)",
    },
    {
      id: "STD004",
      name: "Lucas Martins",
      image: "/placeholder.svg?height=40&width=40",
      initials: "LM",
      grade: "Ensino Médio - 2�� ano",
      class: "A",
      age: 16,
      status: "Inactive",
      enrollmentDate: "2021-02-12",
      attendance: 85,
      guardian: "Fernanda Martins (Mãe)",
    },
    {
      id: "STD005",
      name: "Juliana Costa",
      image: "/placeholder.svg?height=40&width=40",
      initials: "JC",
      grade: "Ensino Médio - 3º ano",
      class: "A",
      age: 17,
      status: "Active",
      enrollmentDate: "2020-02-14",
      attendance: 97,
      guardian: "Roberto Costa (Pai)",
    },
    {
      id: "STD006",
      name: "Rafael Almeida",
      image: "/placeholder.svg?height=40&width=40",
      initials: "RA",
      grade: "9º ano",
      class: "B",
      age: 14,
      status: "Transferred",
      enrollmentDate: "2022-02-10",
      attendance: 90,
      guardian: "Cristina Almeida (Mãe)",
    },
    {
      id: "STD007",
      name: "Mariana Ferreira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "MF",
      grade: "Ensino Médio - 1º ano",
      class: "B",
      age: 15,
      status: "Active",
      enrollmentDate: "2022-02-10",
      attendance: 94,
      guardian: "Paulo Ferreira (Pai)",
    },
    {
      id: "STD008",
      name: "Bruno Cardoso",
      image: "/placeholder.svg?height=40&width=40",
      initials: "BC",
      grade: "7º ano",
      class: "A",
      age: 12,
      status: "Active",
      enrollmentDate: "2023-02-15",
      attendance: 96,
      guardian: "Luciana Cardoso (Mãe)",
    },
    {
      id: "STD009",
      name: "Carolina Mendes",
      image: "/placeholder.svg?height=40&width=40",
      initials: "CM",
      grade: "6º ano",
      class: "B",
      age: 11,
      status: "Active",
      enrollmentDate: "2023-02-15",
      attendance: 98,
      guardian: "Ricardo Mendes (Pai)",
    },
    {
      id: "STD010",
      name: "Thiago Sousa",
      image: "/placeholder.svg?height=40&width=40",
      initials: "TS",
      grade: "8º ano",
      class: "A",
      age: 13,
      status: "Active",
      enrollmentDate: "2022-02-10",
      attendance: 91,
      guardian: "Amanda Sousa (Mãe)",
    },
  ]

  // Group students by grade
  const gradeGroups = students.reduce(
    (groups, student) => {
      const grade = student.grade
      if (!groups[grade]) {
        groups[grade] = []
      }
      groups[grade].push(student)
      return groups
    },
    {} as Record<string, typeof students>,
  )

  // Sort grades in logical order
  const sortedGrades = Object.keys(gradeGroups).sort((a, b) => {
    const gradeOrder = [
      "6º ano",
      "7º ano",
      "8º ano",
      "9º ano",
      "Ensino Médio - 1º ano",
      "Ensino Médio - 2º ano",
      "Ensino Médio - 3º ano",
    ]
    return gradeOrder.indexOf(a) - gradeOrder.indexOf(b)
  })

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list") // list or grid
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const itemsPerPage = 8

  // Filter students based on search term, grade and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesGrade && matchesStatus
  })

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const paginatedStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setIsDialogOpen(true)
  }

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar alunos..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por série" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as séries</SelectItem>
              {sortedGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Active">Ativo</SelectItem>
              <SelectItem value="Inactive">Inativo</SelectItem>
              <SelectItem value="Transferred">Transferido</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddStudent}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedStudent ? "Editar Aluno" : "Adicionar Aluno"}</DialogTitle>
                <DialogDescription>
                  {selectedStudent
                    ? "Edite as informações do aluno selecionado."
                    : "Preencha as informações para adicionar um novo aluno."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedStudent?.name || ""}
                    className="col-span-3"
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="grade" className="text-right">
                    Série
                  </Label>
                  <Select defaultValue={selectedStudent?.grade || ""}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a série" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">
                    Turma
                  </Label>
                  <Input
                    id="class"
                    defaultValue={selectedStudent?.class || ""}
                    className="col-span-3"
                    placeholder="Turma"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                  {selectedStudent ? "Salvar alterações" : "Adicionar aluno"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Alunos</TabsTrigger>
          {sortedGrades.map((grade) => (
            <TabsTrigger key={grade} value={grade} onClick={() => setGradeFilter(grade)}>
              {grade}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {student.grade} {student.class}
                    </p>
                    <Badge
                      variant={
                        student.status === "Active"
                          ? "default"
                          : student.status === "Inactive"
                            ? "secondary"
                            : "outline"
                      }
                      className="mb-4"
                    >
                      {student.status === "Active"
                        ? "Ativo"
                        : student.status === "Inactive"
                          ? "Inativo"
                          : "Transferido"}
                    </Badge>
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span>{student.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Idade:</span>
                        <span>{student.age} anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequência:</span>
                        <span>{student.attendance}%</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => handleEditStudent(student)}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum aluno encontrado com os filtros atuais.</p>
            </Card>
          )}

          {filteredStudents.length > itemsPerPage && (
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
          )}
        </TabsContent>

        {sortedGrades.map((grade) => (
          <TabsContent key={grade} value={grade} className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {gradeGroups[grade].map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{student.initials}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Turma {student.class}</p>
                      <Badge
                        variant={
                          student.status === "Active"
                            ? "default"
                            : student.status === "Inactive"
                              ? "secondary"
                              : "outline"
                        }
                        className="mb-4"
                      >
                        {student.status === "Active"
                          ? "Ativo"
                          : student.status === "Inactive"
                            ? "Inativo"
                            : "Transferido"}
                      </Badge>
                      <div className="w-full space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span>{student.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Idade:</span>
                          <span>{student.age} anos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequência:</span>
                          <span>{student.attendance}%</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleEditStudent(student)}
                      >
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface SchoolTeachersProps {
  id: string
}

export function SchoolTeachers({ id }: SchoolTeachersProps) {
  // In a real application, you would fetch this data based on the ID
  const teachers = [
    {
      id: "TCH001",
      name: "Ricardo Santos",
      image: "/placeholder.svg?height=40&width=40",
      initials: "RS",
      email: "ricardo.santos@example.com",
      department: "Matemática",
      subjects: ["Álgebra", "Cálculo"],
      status: "Active",
      joinDate: "2018-03-10",
      classes: ["9º ano A", "9º ano B", "Ensino Médio - 1º ano A"],
    },
    {
      id: "TCH002",
      name: "Carla Mendes",
      image: "/placeholder.svg?height=40&width=40",
      initials: "CM",
      email: "carla.mendes@example.com",
      department: "Línguas",
      subjects: ["Português", "Literatura"],
      status: "Active",
      joinDate: "2019-02-15",
      classes: ["8º ano A", "8º ano B", "9º ano A"],
    },
    {
      id: "TCH003",
      name: "Paulo Oliveira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "PO",
      email: "paulo.oliveira@example.com",
      department: "Ciências Sociais",
      subjects: ["História", "Geografia"],
      status: "Active",
      joinDate: "2017-08-22",
      classes: ["7º ano A", "7º ano B", "8º ano A"],
    },
    {
      id: "TCH004",
      name: "Fernanda Lima",
      image: "/placeholder.svg?height=40&width=40",
      initials: "FL",
      email: "fernanda.lima@example.com",
      department: "Ciências",
      subjects: ["Biologia", "Química"],
      status: "On Leave",
      joinDate: "2020-01-05",
      classes: ["Ensino Médio - 1º ano A", "Ensino Médio - 2º ano A"],
    },
    {
      id: "TCH005",
      name: "Roberto Alves",
      image: "/placeholder.svg?height=40&width=40",
      initials: "RA",
      email: "roberto.alves@example.com",
      department: "Educação Física",
      subjects: ["Esportes", "Saúde"],
      status: "Active",
      joinDate: "2016-05-18",
      classes: ["6º ano A", "6º ano B", "7º ano A"],
    },
    {
      id: "TCH006",
      name: "Mariana Costa",
      image: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      email: "mariana.costa@example.com",
      department: "Artes",
      subjects: ["Artes Visuais", "Música"],
      status: "Active",
      joinDate: "2021-03-15",
      classes: ["6º ano A", "7º ano A", "8º ano A"],
    },
    {
      id: "TCH007",
      name: "Eduardo Martins",
      image: "/placeholder.svg?height=40&width=40",
      initials: "EM",
      email: "eduardo.martins@example.com",
      department: "Tecnologia",
      subjects: ["Informática", "Robótica"],
      status: "Active",
      joinDate: "2019-09-01",
      classes: ["9º ano A", "Ensino Médio - 1º ano A", "Ensino Médio - 2º ano A"],
    },
  ]

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const itemsPerPage = 6

  // Filter teachers based on search term and department
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDepartment = departmentFilter === "all" || teacher.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
  const paginatedTeachers = filteredTeachers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Get unique departments for filter
  const departments = Array.from(new Set(teachers.map((teacher) => teacher.department)))

  const handleAddTeacher = () => {
    setSelectedTeacher(null)
    setIsDialogOpen(true)
  }

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar professores..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os departamentos</SelectItem>
              {departments.map((department, index) => (
                <SelectItem key={index} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddTeacher}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedTeacher ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
                <DialogDescription>
                  {selectedTeacher
                    ? "Edite as informações do professor selecionado."
                    : "Preencha as informações para adicionar um novo professor."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedTeacher?.name || ""}
                    className="col-span-3"
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    defaultValue={selectedTeacher?.email || ""}
                    className="col-span-3"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Departamento
                  </Label>
                  <Select defaultValue={selectedTeacher?.department || ""}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department, index) => (
                        <SelectItem key={index} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                  {selectedTeacher ? "Salvar alterações" : "Adicionar professor"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedTeachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.image || "/placeholder.svg"} alt={teacher.name} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{teacher.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{teacher.department}</p>
                  </div>
                </div>
                <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>
                  {teacher.status === "Active" ? "Ativo" : "Licença"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Disciplinas</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Turmas</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.classes.map((cls, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleEditTeacher(teacher)}>
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum professor encontrado com os filtros atuais.</p>
        </Card>
      )}

      {filteredTeachers.length > itemsPerPage && (
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
    </div>
  )
}

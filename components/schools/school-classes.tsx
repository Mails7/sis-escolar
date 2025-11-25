"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, PlusIcon, FilterIcon, UsersIcon } from "lucide-react"
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
import Link from "next/link"

interface SchoolClassesProps {
  id: string
}

export function SchoolClasses({ id }: SchoolClassesProps) {
  // In a real application, you would fetch this data based on the ID
  const classes = [
    {
      id: "CLS001",
      name: "6º ano A",
      shift: "Matutino",
      students: 32,
      capacity: 35,
      teacher: "Ricardo Santos",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS002",
      name: "6º ano B",
      shift: "Vespertino",
      students: 30,
      capacity: 35,
      teacher: "Carla Mendes",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS003",
      name: "7º ano A",
      shift: "Matutino",
      students: 28,
      capacity: 30,
      teacher: "Paulo Oliveira",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS004",
      name: "7º ano B",
      shift: "Vespertino",
      students: 27,
      capacity: 30,
      teacher: "Fernanda Lima",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS005",
      name: "8º ano A",
      shift: "Matutino",
      students: 33,
      capacity: 35,
      teacher: "Roberto Alves",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS006",
      name: "8º ano B",
      shift: "Vespertino",
      students: 31,
      capacity: 35,
      teacher: "Mariana Costa",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS007",
      name: "9º ano A",
      shift: "Matutino",
      students: 29,
      capacity: 30,
      teacher: "Eduardo Martins",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
    {
      id: "CLS008",
      name: "9º ano B",
      shift: "Vespertino",
      students: 28,
      capacity: 30,
      teacher: "Ricardo Santos",
      subjects: ["Matemática", "Ciências", "História", "Geografia", "Português", "Artes", "Educação Física"],
    },
  ]

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const itemsPerPage = 6

  // Filter classes based on search term and shift
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesShift = shiftFilter === "all" || cls.shift === shiftFilter

    return matchesSearch && matchesShift
  })

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const paginatedClasses = filteredClasses.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleAddClass = () => {
    setSelectedClass(null)
    setIsDialogOpen(true)
  }

  const handleEditClass = (cls: any) => {
    setSelectedClass(cls)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar turmas..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os turnos</SelectItem>
              <SelectItem value="Matutino">Matutino</SelectItem>
              <SelectItem value="Vespertino">Vespertino</SelectItem>
              <SelectItem value="Noturno">Noturno</SelectItem>
              <SelectItem value="Integral">Integral</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddClass}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedClass ? "Editar Turma" : "Adicionar Turma"}</DialogTitle>
                <DialogDescription>
                  {selectedClass
                    ? "Edite as informações da turma selecionada."
                    : "Preencha as informações para adicionar uma nova turma."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedClass?.name || ""}
                    className="col-span-3"
                    placeholder="Ex: 9º ano A"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shift" className="text-right">
                    Turno
                  </Label>
                  <Select defaultValue={selectedClass?.shift || ""}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matutino">Matutino</SelectItem>
                      <SelectItem value="Vespertino">Vespertino</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                      <SelectItem value="Integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacidade
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    defaultValue={selectedClass?.capacity || ""}
                    className="col-span-3"
                    placeholder="Número de alunos"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher" className="text-right">
                    Professor
                  </Label>
                  <Select defaultValue={selectedClass?.teacher || ""}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ricardo Santos">Ricardo Santos</SelectItem>
                      <SelectItem value="Carla Mendes">Carla Mendes</SelectItem>
                      <SelectItem value="Paulo Oliveira">Paulo Oliveira</SelectItem>
                      <SelectItem value="Fernanda Lima">Fernanda Lima</SelectItem>
                      <SelectItem value="Roberto Alves">Roberto Alves</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                  {selectedClass ? "Salvar alterações" : "Adicionar turma"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{cls.name}</CardTitle>
                <Badge>{cls.shift}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {cls.students} / {cls.capacity} alunos
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Prof. {cls.teacher}</div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Disciplinas</p>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/classes/${cls.id}`}>Ver detalhes</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClass(cls)}>
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma turma encontrada com os filtros atuais.</p>
        </Card>
      )}

      {filteredClasses.length > itemsPerPage && (
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

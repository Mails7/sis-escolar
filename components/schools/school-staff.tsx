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

interface SchoolStaffProps {
  id: string
}

export function SchoolStaff({ id }: SchoolStaffProps) {
  // In a real application, you would fetch this data based on the ID
  const staff = [
    {
      id: "STF001",
      name: "Luiza Pereira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "LP",
      email: "luiza.pereira@example.com",
      role: "Diretor(a)",
      department: "Administração",
      status: "Active",
      joinDate: "2015-01-10",
      phone: "+55 11 98765-4321",
    },
    {
      id: "STF002",
      name: "Carlos Rodrigues",
      image: "/placeholder.svg?height=40&width=40",
      initials: "CR",
      email: "carlos.rodrigues@example.com",
      role: "Vice-Diretor(a)",
      department: "Administração",
      status: "Active",
      joinDate: "2016-03-15",
      phone: "+55 11 98765-4322",
    },
    {
      id: "STF003",
      name: "Amanda Silva",
      image: "/placeholder.svg?height=40&width=40",
      initials: "AS",
      email: "amanda.silva@example.com",
      role: "Coordenador(a) Pedagógico",
      department: "Pedagógico",
      status: "Active",
      joinDate: "2017-02-20",
      phone: "+55 11 98765-4323",
    },
    {
      id: "STF004",
      name: "Roberto Santos",
      image: "/placeholder.svg?height=40&width=40",
      initials: "RS",
      email: "roberto.santos@example.com",
      role: "Secretário(a) Escolar",
      department: "Secretaria",
      status: "Active",
      joinDate: "2018-04-05",
      phone: "+55 11 98765-4324",
    },
    {
      id: "STF005",
      name: "Juliana Costa",
      image: "/placeholder.svg?height=40&width=40",
      initials: "JC",
      email: "juliana.costa@example.com",
      role: "Bibliotecário(a)",
      department: "Biblioteca",
      status: "Active",
      joinDate: "2019-01-15",
      phone: "+55 11 98765-4325",
    },
    {
      id: "STF006",
      name: "Fernando Oliveira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "FO",
      email: "fernando.oliveira@example.com",
      role: "Psicólogo(a) Escolar",
      department: "Apoio Educacional",
      status: "Active",
      joinDate: "2020-02-10",
      phone: "+55 11 98765-4326",
    },
    {
      id: "STF007",
      name: "Patrícia Lima",
      image: "/placeholder.svg?height=40&width=40",
      initials: "PL",
      email: "patricia.lima@example.com",
      role: "Assistente Social",
      department: "Apoio Educacional",
      status: "Active",
      joinDate: "2020-03-15",
      phone: "+55 11 98765-4327",
    },
    {
      id: "STF008",
      name: "Ricardo Almeida",
      image: "/placeholder.svg?height=40&width=40",
      initials: "RA",
      email: "ricardo.almeida@example.com",
      role: "Técnico de Informática",
      department: "Tecnologia",
      status: "Active",
      joinDate: "2021-01-10",
      phone: "+55 11 98765-4328",
    },
    {
      id: "STF009",
      name: "Camila Ferreira",
      image: "/placeholder.svg?height=40&width=40",
      initials: "CF",
      email: "camila.ferreira@example.com",
      role: "Nutricionista",
      department: "Alimentação",
      status: "Active",
      joinDate: "2021-02-15",
      phone: "+55 11 98765-4329",
    },
    {
      id: "STF010",
      name: "Marcos Souza",
      image: "/placeholder.svg?height=40&width=40",
      initials: "MS",
      email: "marcos.souza@example.com",
      role: "Inspetor(a) de Alunos",
      department: "Apoio Escolar",
      status: "Active",
      joinDate: "2022-01-05",
      phone: "+55 11 98765-4330",
    },
    {
      id: "STF011",
      name: "Luciana Martins",
      image: "/placeholder.svg?height=40&width=40",
      initials: "LM",
      email: "luciana.martins@example.com",
      role: "Auxiliar de Limpeza",
      department: "Manutenção",
      status: "Active",
      joinDate: "2022-02-10",
      phone: "+55 11 98765-4331",
    },
    {
      id: "STF012",
      name: "José Cardoso",
      image: "/placeholder.svg?height=40&width=40",
      initials: "JC",
      email: "jose.cardoso@example.com",
      role: "Porteiro",
      department: "Segurança",
      status: "Active",
      joinDate: "2022-03-15",
      phone: "+55 11 98765-4332",
    },
  ]

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const itemsPerPage = 8

  // Get unique departments for filter
  const departments = Array.from(new Set(staff.map((member) => member.department)))

  // Filter staff based on search term and department
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const paginatedStaff = filteredStaff.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar funcionários..."
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
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {paginatedStaff.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <Badge className="mb-4">{member.department}</Badge>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="truncate max-w-[150px]">{member.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desde:</span>
                    <span>{new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Ver perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum funcionário encontrado com os filtros atuais.</p>
        </Card>
      )}

      {filteredStaff.length > itemsPerPage && (
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

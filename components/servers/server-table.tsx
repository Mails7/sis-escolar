"use client"

import { useState } from "react"
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
import { MoreHorizontalIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"

// Dados de exemplo
const servers = [
  {
    id: "SRV001",
    name: "Carlos Eduardo Silva",
    image: "/placeholder.svg?height=40&width=40",
    initials: "CS",
    email: "carlos.silva@educacao.gov.br",
    registration: "12345",
    internalRegistration: "INT001",
    sector: "Secretaria de Educação",
    role: "Professor",
    status: "Ativo",
    userType: "Administrador",
    accessLevel: "Completo",
  },
  {
    id: "SRV002",
    name: "Ana Maria Santos",
    image: "/placeholder.svg?height=40&width=40",
    initials: "AS",
    email: "ana.santos@educacao.gov.br",
    registration: "12346",
    internalRegistration: "INT002",
    sector: "Escola Municipal João Paulo",
    role: "Coordenador Pedagógico",
    status: "Ativo",
    userType: "Escola",
    accessLevel: "Parcial",
  },
  {
    id: "SRV003",
    name: "Roberto Almeida",
    image: "/placeholder.svg?height=40&width=40",
    initials: "RA",
    email: "roberto.almeida@educacao.gov.br",
    registration: "12347",
    internalRegistration: "INT003",
    sector: "Escola Municipal Maria Clara",
    role: "Professor",
    status: "Ativo",
    userType: "Professor",
    accessLevel: "Básico",
  },
  {
    id: "SRV004",
    name: "Juliana Ferreira",
    image: "/placeholder.svg?height=40&width=40",
    initials: "JF",
    email: "juliana.ferreira@educacao.gov.br",
    registration: "12348",
    internalRegistration: "INT004",
    sector: "Secretaria de Educação",
    role: "Assistente Administrativo",
    status: "Inativo",
    userType: "Secretaria",
    accessLevel: "Parcial",
  },
  {
    id: "SRV005",
    name: "Marcos Oliveira",
    image: "/placeholder.svg?height=40&width=40",
    initials: "MO",
    email: "marcos.oliveira@educacao.gov.br",
    registration: "12349",
    internalRegistration: "INT005",
    sector: "Escola Municipal Pedro Álvares",
    role: "Diretor",
    status: "Ativo",
    userType: "Diretor",
    accessLevel: "Completo",
  },
  {
    id: "SRV006",
    name: "Patrícia Lima",
    image: "/placeholder.svg?height=40&width=40",
    initials: "PL",
    email: "patricia.lima@educacao.gov.br",
    registration: "12350",
    internalRegistration: "INT006",
    sector: "Escola Municipal João Paulo",
    role: "Secretária Escolar",
    status: "Ativo",
    userType: "Secretaria",
    accessLevel: "Parcial",
  },
  {
    id: "SRV007",
    name: "Fernando Costa",
    image: "/placeholder.svg?height=40&width=40",
    initials: "FC",
    email: "fernando.costa@educacao.gov.br",
    registration: "12351",
    internalRegistration: "INT007",
    sector: "Secretaria de Educação",
    role: "Analista de Sistemas",
    status: "Ativo",
    userType: "Técnico",
    accessLevel: "Completo",
  },
]

export function ServerTable() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(servers.length / itemsPerPage)

  const paginatedServers = servers.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servidor</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Tipo de Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={server.image || "/placeholder.svg"} alt={server.name} />
                      <AvatarFallback>{server.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Link href={`/servers/${server.id}`} className="font-medium hover:underline">
                        {server.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{server.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{server.registration}</span>
                    <span className="text-xs text-muted-foreground">Int: {server.internalRegistration}</span>
                  </div>
                </TableCell>
                <TableCell>{server.sector}</TableCell>
                <TableCell>{server.role}</TableCell>
                <TableCell>
                  <Badge variant="outline">{server.userType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={server.status === "Ativo" ? "default" : "secondary"}
                    className={server.status === "Inativo" ? "bg-gray-200 text-gray-700 hover:bg-gray-200" : ""}
                  >
                    {server.status}
                  </Badge>
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
                        <Link href={`/servers/${server.id}`}>Ver perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar dados</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Gerenciar permissões</DropdownMenuItem>
                      <DropdownMenuItem>Vincular a escolas</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={server.status === "Ativo" ? "text-red-600" : "text-green-600"}>
                        {server.status === "Ativo" ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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

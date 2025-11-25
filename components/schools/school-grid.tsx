"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  BookOpenIcon,
  BuildingIcon,
  GraduationCapIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  AlertCircle,
  Database,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data
const schools = [
  {
    id: "SCH001",
    name: "Colégio Municipal São Paulo",
    type: "Municipal",
    address: "Rua das Flores, 123 - São Paulo, SP",
    phone: "+55 11 3456-7890",
    students: 1250,
    teachers: 85,
    staff: 42,
    classes: 38,
    status: "Active",
    image: "/traditional-schoolhouse.png",
  },
  {
    id: "SCH002",
    name: "Escola Estadual Rio de Janeiro",
    type: "State",
    address: "Avenida Atlântica, 456 - Rio de Janeiro, RJ",
    phone: "+55 21 3456-7890",
    students: 980,
    teachers: 65,
    staff: 35,
    classes: 30,
    status: "Active",
    image: "/vibrant-school-campus.png",
  },
  {
    id: "SCH003",
    name: "Escola Municipal Belo Horizonte",
    type: "Municipal",
    address: "Rua dos Ipês, 789 - Belo Horizonte, MG",
    phone: "+55 31 3456-7890",
    students: 850,
    teachers: 55,
    staff: 28,
    classes: 25,
    status: "Active",
    image: "/placeholder.svg?key=guaby",
  },
  {
    id: "SCH004",
    name: "Colégio Estadual Salvador",
    type: "State",
    address: "Avenida Oceânica, 101 - Salvador, BA",
    phone: "+55 71 3456-7890",
    students: 720,
    teachers: 48,
    staff: 25,
    classes: 22,
    status: "Active",
    image: "/placeholder.svg?key=9g5yh",
  },
  {
    id: "SCH005",
    name: "Escola Municipal Recife",
    type: "Municipal",
    address: "Rua das Palmeiras, 202 - Recife, PE",
    phone: "+55 81 3456-7890",
    students: 650,
    teachers: 42,
    staff: 22,
    classes: 20,
    status: "Active",
    image: "/placeholder.svg?key=7a243",
  },
  {
    id: "SCH006",
    name: "Colégio Estadual Fortaleza",
    type: "State",
    address: "Avenida Beira Mar, 303 - Fortaleza, CE",
    phone: "+55 85 3456-7890",
    students: 580,
    teachers: 38,
    staff: 20,
    classes: 18,
    status: "Inactive",
    image: "/school-auditorium.png",
  },
  {
    id: "SCH007",
    name: "Escola Municipal Porto Alegre",
    type: "Municipal",
    address: "Rua dos Andradas, 404 - Porto Alegre, RS",
    phone: "+55 51 3456-7890",
    students: 520,
    teachers: 35,
    staff: 18,
    classes: 16,
    status: "Maintenance",
    image: "/placeholder.svg?key=3ghcx",
  },
  {
    id: "SCH008",
    name: "Escola Rural Campos Verdes",
    type: "Municipal",
    address: "Estrada do Campo, Km 5 - Zona Rural",
    phone: "+55 11 3456-7891",
    students: 320,
    teachers: 22,
    staff: 15,
    classes: 12,
    status: "Active",
    image: "/placeholder.svg?key=tsc0a",
  },
]

export function SchoolGrid() {
  const [page, setPage] = useState(1)
  const [schoolsData, setSchoolsData] = useState(schools)
  const [isCreatingTable, setIsCreatingTable] = useState(false)
  const [tableError, setTableError] = useState<string | null>(null)
  const [tableCreated, setTableCreated] = useState(false)
  const itemsPerPage = 6
  const totalPages = Math.ceil(schoolsData.length / itemsPerPage)

  const paginatedSchools = schoolsData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const toggleSchoolStatus = (id: string) => {
    setSchoolsData(
      schoolsData.map((school) => {
        if (school.id === id) {
          return {
            ...school,
            status: school.status === "Active" ? "Inactive" : "Active",
          }
        }
        return school
      }),
    )
  }

  const createSchoolsTable = async () => {
    setIsCreatingTable(true)
    setTableError(null)

    try {
      // Primeiro, criar a função execute_sql se não existir
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `

      // Tentar criar a função (pode falhar se já existir, mas isso é ok)
      try {
        const response = await fetch("/api/execute-sql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql: createFunctionSQL }),
        })

        if (!response.ok) {
          console.log("Função pode já existir ou houve um erro ao criá-la")
        }
      } catch (error) {
        console.log("Erro ao criar função, continuando mesmo assim:", error)
      }

      // SQL para criar a tabela schools
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS schools (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT,
          address TEXT,
          phone TEXT,
          students INTEGER,
          teachers INTEGER,
          staff INTEGER,
          classes INTEGER,
          status TEXT,
          image TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      // SQL para inserir dados de exemplo
      const insertDataSQL = `
        INSERT INTO schools (id, name, type, address, phone, students, teachers, staff, classes, status, image)
        VALUES 
          ('SCH001', 'Colégio Municipal São Paulo', 'Municipal', 'Rua das Flores, 123 - São Paulo, SP', '+55 11 3456-7890', 1250, 85, 42, 38, 'Active', '/traditional-schoolhouse.png'),
          ('SCH002', 'Escola Estadual Rio de Janeiro', 'State', 'Avenida Atlântica, 456 - Rio de Janeiro, RJ', '+55 21 3456-7890', 980, 65, 35, 30, 'Active', '/vibrant-school-campus.png'),
          ('SCH003', 'Escola Municipal Belo Horizonte', 'Municipal', 'Rua dos Ipês, 789 - Belo Horizonte, MG', '+55 31 3456-7890', 850, 55, 28, 25, 'Active', '/placeholder.svg?key=ey1l9'),
          ('SCH004', 'Colégio Estadual Salvador', 'State', 'Avenida Oceânica, 101 - Salvador, BA', '+55 71 3456-7890', 720, 48, 25, 22, 'Active', '/placeholder.svg?key=893l0'),
          ('SCH005', 'Escola Municipal Recife', 'Municipal', 'Rua das Palmeiras, 202 - Recife, PE', '+55 81 3456-7890', 650, 42, 22, 20, 'Active', '/placeholder.svg?key=n7cz9'),
          ('SCH006', 'Colégio Estadual Fortaleza', 'State', 'Avenida Beira Mar, 303 - Fortaleza, CE', '+55 85 3456-7890', 580, 38, 20, 18, 'Inactive', '/school-auditorium.png'),
          ('SCH007', 'Escola Municipal Porto Alegre', 'Municipal', 'Rua dos Andradas, 404 - Porto Alegre, RS', '+55 51 3456-7890', 520, 35, 18, 16, 'Maintenance', '/placeholder.svg?key=0nmp5'),
          ('SCH008', 'Escola Rural Campos Verdes', 'Municipal', 'Estrada do Campo, Km 5 - Zona Rural', '+55 11 3456-7891', 320, 22, 15, 12, 'Active', '/placeholder.svg?key=dqds8')
        ON CONFLICT (id) DO NOTHING;
      `

      // Executar o SQL para criar a tabela
      const createTableResponse = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: createTableSQL }),
      })

      if (!createTableResponse.ok) {
        throw new Error(`Erro ao criar tabela: ${await createTableResponse.text()}`)
      }

      // Executar o SQL para inserir dados
      const insertDataResponse = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: insertDataSQL }),
      })

      if (!insertDataResponse.ok) {
        throw new Error(`Erro ao inserir dados: ${await insertDataResponse.text()}`)
      }

      setTableCreated(true)
      // Não tentamos buscar dados reais aqui, mantemos os dados de exemplo
      // para simplificar e evitar erros adicionais
    } catch (error) {
      console.error("Erro ao criar tabela:", error)
      setTableError(error instanceof Error ? error.message : "Erro desconhecido ao criar tabela")
    } finally {
      setIsCreatingTable(false)
    }
  }

  return (
    <div className="space-y-6">
      {!tableCreated && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200 mb-6">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertTitle className="text-yellow-800">Tabela não encontrada</AlertTitle>
          <AlertDescription className="text-yellow-700">
            <p className="mb-2">
              A tabela de escolas não foi encontrada no banco de dados. Os dados exibidos abaixo são exemplos.
            </p>
            <Button
              onClick={createSchoolsTable}
              disabled={isCreatingTable}
              variant="outline"
              className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              {isCreatingTable ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando tabela...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Criar tabela de escolas
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tableError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao criar tabela</AlertTitle>
          <AlertDescription>
            {tableError}
            <div className="mt-2">
              <Button onClick={createSchoolsTable} variant="outline" size="sm" disabled={isCreatingTable}>
                Tentar Novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {tableCreated && (
        <Alert variant="success" className="bg-green-50 border-green-200 mb-6">
          <AlertCircle className="h-4 w-4 text-green-800" />
          <AlertTitle className="text-green-800">Tabela criada com sucesso</AlertTitle>
          <AlertDescription className="text-green-700">
            A tabela de escolas foi criada e populada com dados de exemplo.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedSchools.map((school) => (
          <Card key={school.id} className={school.status !== "Active" ? "opacity-70" : ""}>
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={school.image || "/placeholder.svg?height=200&width=300&query=school"}
                  alt={school.name}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant={school.type === "Municipal" ? "default" : "secondary"} className="text-xs">
                    {school.type}
                  </Badge>
                  <Badge
                    variant={
                      school.status === "Active" ? "default" : school.status === "Inactive" ? "destructive" : "outline"
                    }
                    className="text-xs"
                  >
                    {school.status === "Active" ? "Ativa" : school.status === "Inactive" ? "Inativa" : "Em manutenção"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{school.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{school.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{school.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <GraduationCapIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{school.students} alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{school.teachers} professores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{school.staff} funcionários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{school.classes} turmas</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={school.status === "Active"}
                  onCheckedChange={() => toggleSchoolStatus(school.id)}
                  aria-label={`Ativar ou desativar ${school.name}`}
                />
                <span className="text-sm">{school.status === "Active" ? "Ativa" : "Inativa"}</span>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/schools/${school.id}`}>Gerenciar</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SchoolOverviewProps {
  id: string
}

export function SchoolOverview({ id }: SchoolOverviewProps) {
  // In a real application, you would fetch this data based on the ID
  const school = {
    id: "SCH001",
    name: "Colégio Municipal São Paulo",
    type: "Municipal",
    address: "Rua das Flores, 123 - São Paulo, SP",
    phone: "+55 11 3456-7890",
    email: "contato@colegiomunicipalsp.edu.br",
    website: "www.colegiomunicipalsp.edu.br",
    director: "Maria Oliveira",
    foundedYear: "1985",
    students: 1250,
    teachers: 85,
    staff: 42,
    classes: 38,
    status: "Active",
    image: "/placeholder.svg?height=300&width=600",
    facilities: [
      "Biblioteca",
      "Laboratório de Ciências",
      "Laboratório de Informática",
      "Quadra Poliesportiva",
      "Refeitório",
      "Sala de Música",
      "Auditório",
    ],
    gradeDistribution: [
      { grade: "1º ano", students: 120, capacity: 150 },
      { grade: "2º ano", students: 115, capacity: 150 },
      { grade: "3º ano", students: 118, capacity: 150 },
      { grade: "4º ano", students: 125, capacity: 150 },
      { grade: "5º ano", students: 122, capacity: 150 },
      { grade: "6º ano", students: 130, capacity: 150 },
      { grade: "7º ano", students: 135, capacity: 150 },
      { grade: "8º ano", students: 128, capacity: 150 },
      { grade: "9º ano", students: 132, capacity: 150 },
      { grade: "Ensino Médio - 1º ano", students: 75, capacity: 100 },
      { grade: "Ensino Médio - 2º ano", students: 70, capacity: 100 },
      { grade: "Ensino Médio - 3º ano", students: 80, capacity: 100 },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={school.image || "/placeholder.svg"}
              alt={school.name}
              className="h-60 w-full object-cover rounded-t-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-white">{school.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={school.type === "Municipal" ? "default" : "secondary"}>{school.type}</Badge>
                <Badge
                  variant={
                    school.status === "Active" ? "default" : school.status === "Inactive" ? "destructive" : "outline"
                  }
                  className="bg-green-600 hover:bg-green-600"
                >
                  {school.status === "Active" ? "Ativa" : school.status === "Inactive" ? "Inativa" : "Em manutenção"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-6">
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" /> Endereço
            </span>
            <p>{school.address}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" /> Telefone
            </span>
            <p>{school.phone}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MailIcon className="h-4 w-4" /> Email
            </span>
            <p>{school.email}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Fundação
            </span>
            <p>{school.foundedYear}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <GraduationCapIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{school.students}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <UsersIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{school.teachers}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <BuildingIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{school.staff}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <BookOpenIcon className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">{school.classes}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Séries</CardTitle>
            <CardDescription>Ocupação de vagas por série</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {school.gradeDistribution.map((grade, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{grade.grade}</span>
                    <span className="text-sm text-muted-foreground">
                      {grade.students}/{grade.capacity} alunos
                    </span>
                  </div>
                  <Progress value={(grade.students / grade.capacity) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infraestrutura</CardTitle>
            <CardDescription>Instalações e recursos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {school.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

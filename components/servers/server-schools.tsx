import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

interface ServerSchoolsProps {
  id: string
}

export function ServerSchools({ id }: ServerSchoolsProps) {
  // Em uma aplicação real, você buscaria esses dados do servidor com base no ID
  const schools = [
    {
      id: "SCH001",
      name: "Escola Municipal João Paulo",
      role: "Professor",
      subjects: ["Matemática", "Física"],
      classes: ["9º Ano A", "9º Ano B", "1º Ano EM"],
      status: "Ativo",
    },
    {
      id: "SCH002",
      name: "Escola Municipal Maria Clara",
      role: "Coordenador Pedagógico",
      subjects: [],
      classes: [],
      status: "Ativo",
    },
    {
      id: "SCH003",
      name: "Escola Municipal Pedro Álvares",
      role: "Professor",
      subjects: ["Matemática"],
      classes: ["8º Ano A", "8º Ano B"],
      status: "Inativo",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Escolas Vinculadas</CardTitle>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Adicionar Escola
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escola</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Disciplinas</TableHead>
                <TableHead>Turmas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {school.subjects.length > 0 ? (
                        school.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {school.classes.length > 0 ? (
                        school.classes.map((cls, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cls}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={school.status === "Ativo" ? "default" : "secondary"}
                      className={school.status === "Inativo" ? "bg-gray-200 text-gray-700 hover:bg-gray-200" : ""}
                    >
                      {school.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/schools/${school.id}`}>Ver Escola</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Alocação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total de Escolas</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Escolas Ativas</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Turmas Atribuídas</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

type StudentHistoryProps = {
  studentId: string
  studentName: string
}

type HistoryEntry = {
  year: string
  grade: string
  school: string
  status: "approved" | "disapproved" | "transferred" | "in_progress"
  finalGrade: number | null
  attendance: number
}

type SubjectHistory = {
  year: string
  grade: string
  subject: string
  teacher: string
  finalGrade: number | null
  status: "approved" | "disapproved" | "in_progress"
}

export function StudentHistory({ studentId, studentName }: StudentHistoryProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Dados de exemplo para demonstração
  const mockHistory: HistoryEntry[] = [
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      school: "Escola Municipal São Paulo",
      status: "approved",
      finalGrade: 8.2,
      attendance: 95,
    },
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      school: "Escola Municipal São Paulo",
      status: "approved",
      finalGrade: 7.8,
      attendance: 92,
    },
    {
      year: "2021",
      grade: "6º Ano - Ensino Fundamental",
      school: "Escola Municipal São Paulo",
      status: "approved",
      finalGrade: 8.5,
      attendance: 97,
    },
    {
      year: "2020",
      grade: "5º Ano - Ensino Fundamental",
      school: "Escola Estadual Rio de Janeiro",
      status: "transferred",
      finalGrade: null,
      attendance: 88,
    },
    {
      year: "2019",
      grade: "4º Ano - Ensino Fundamental",
      school: "Escola Estadual Rio de Janeiro",
      status: "approved",
      finalGrade: 7.5,
      attendance: 94,
    },
  ]

  const mockSubjectHistory: SubjectHistory[] = [
    // 2023
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      subject: "Matemática",
      teacher: "Ricardo Santos",
      finalGrade: 8.5,
      status: "approved",
    },
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      subject: "Português",
      teacher: "Carla Mendes",
      finalGrade: 7.8,
      status: "approved",
    },
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      subject: "História",
      teacher: "Paulo Oliveira",
      finalGrade: 9.0,
      status: "approved",
    },
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      subject: "Geografia",
      teacher: "Paulo Oliveira",
      finalGrade: 8.2,
      status: "approved",
    },
    {
      year: "2023",
      grade: "8º Ano - Ensino Fundamental",
      subject: "Ciências",
      teacher: "Fernanda Lima",
      finalGrade: 7.5,
      status: "approved",
    },

    // 2022
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      subject: "Matemática",
      teacher: "Ricardo Santos",
      finalGrade: 7.0,
      status: "approved",
    },
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      subject: "Português",
      teacher: "Carla Mendes",
      finalGrade: 8.5,
      status: "approved",
    },
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      subject: "História",
      teacher: "Paulo Oliveira",
      finalGrade: 8.0,
      status: "approved",
    },
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      subject: "Geografia",
      teacher: "Paulo Oliveira",
      finalGrade: 7.5,
      status: "approved",
    },
    {
      year: "2022",
      grade: "7º Ano - Ensino Fundamental",
      subject: "Ciências",
      teacher: "Fernanda Lima",
      finalGrade: 8.0,
      status: "approved",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "disapproved":
        return "text-red-600"
      case "transferred":
        return "text-yellow-600"
      default:
        return "text-blue-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado"
      case "disapproved":
        return "Reprovado"
      case "transferred":
        return "Transferido"
      default:
        return "Em andamento"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Lógica para gerar PDF e fazer download
    alert("Funcionalidade de download em desenvolvimento")
  }

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <div>
          <CardTitle>Histórico Escolar</CardTitle>
          <CardDescription>Visualize o histórico acadêmico completo do aluno</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="print:block print:mb-6">
          <h2 className="text-2xl font-bold print:text-center hidden print:block">Histórico Escolar</h2>
          <div className="print:flex print:justify-between print:mt-4 hidden print:block">
            <p>
              <strong>Aluno:</strong> {studentName}
            </p>
            <p>
              <strong>Matrícula:</strong> {studentId}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="print:hidden">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="subjects">Disciplinas</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Série/Ano</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead className="text-center">Média Final</TableHead>
                    <TableHead className="text-center">Frequência</TableHead>
                    <TableHead className="text-center">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.year}</TableCell>
                      <TableCell>{entry.grade}</TableCell>
                      <TableCell>{entry.school}</TableCell>
                      <TableCell className="text-center">
                        {entry.finalGrade !== null ? entry.finalGrade.toFixed(1) : "-"}
                      </TableCell>
                      <TableCell className="text-center">{entry.attendance}%</TableCell>
                      <TableCell className={`text-center ${getStatusColor(entry.status)}`}>
                        {getStatusText(entry.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="subjects" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Série/Ano</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead className="text-center">Média Final</TableHead>
                    <TableHead className="text-center">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubjectHistory.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.year}</TableCell>
                      <TableCell>{entry.grade}</TableCell>
                      <TableCell>{entry.subject}</TableCell>
                      <TableCell>{entry.teacher}</TableCell>
                      <TableCell className="text-center">
                        {entry.finalGrade !== null ? entry.finalGrade.toFixed(1) : "-"}
                      </TableCell>
                      <TableCell className={`text-center ${getStatusColor(entry.status)}`}>
                        {getStatusText(entry.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

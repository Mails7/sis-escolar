"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

type Grade = {
  subject: string
  period1: number | null
  period2: number | null
  period3: number | null
  period4: number | null
  recovery: number | null
  finalGrade: number | null
  status: "approved" | "disapproved" | "in_progress"
}

type Attendance = {
  totalDays: number
  presentDays: number
  absentDays: number
  justifiedAbsences: number
  attendancePercentage: number
}

type ReportCardProps = {
  studentId: string
  studentName: string
}

export function StudentReportCard({ studentId, studentName }: ReportCardProps) {
  const [selectedYear, setSelectedYear] = useState<string>("2023")
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Dados de exemplo para demonstração
  const availableYears = ["2023", "2022", "2021"]

  const mockGrades: Grade[] = [
    {
      subject: "Matemática",
      period1: 8.5,
      period2: 7.0,
      period3: 9.0,
      period4: 8.5,
      recovery: null,
      finalGrade: 8.3,
      status: "approved",
    },
    {
      subject: "Português",
      period1: 7.0,
      period2: 6.5,
      period3: 8.0,
      period4: 7.5,
      recovery: null,
      finalGrade: 7.3,
      status: "approved",
    },
    {
      subject: "História",
      period1: 6.0,
      period2: 5.5,
      period3: 4.0,
      period4: null,
      recovery: 6.0,
      finalGrade: 5.4,
      status: "in_progress",
    },
    {
      subject: "Geografia",
      period1: 7.5,
      period2: 8.0,
      period3: 7.0,
      period4: 7.5,
      recovery: null,
      finalGrade: 7.5,
      status: "approved",
    },
    {
      subject: "Ciências",
      period1: 9.0,
      period2: 8.5,
      period3: 9.5,
      period4: 9.0,
      recovery: null,
      finalGrade: 9.0,
      status: "approved",
    },
  ]

  const mockAttendance: Attendance = {
    totalDays: 200,
    presentDays: 185,
    absentDays: 15,
    justifiedAbsences: 10,
    attendancePercentage: 92.5,
  }

  useEffect(() => {
    const fetchReportCard = async () => {
      setIsLoading(true)
      try {
        // Simulando uma chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Em produção, substituir por chamada real à API
        setGrades(mockGrades)
        setAttendance(mockAttendance)
      } catch (error) {
        console.error("Erro ao buscar boletim:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportCard()
  }, [selectedYear, studentId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Lógica para gerar PDF e fazer download
    alert("Funcionalidade de download em desenvolvimento")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600"
      case "disapproved":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado"
      case "disapproved":
        return "Reprovado"
      default:
        return "Em andamento"
    }
  }

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <div>
          <CardTitle>Boletim Escolar</CardTitle>
          <CardDescription>Visualize as notas e frequência do aluno</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano letivo" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <h2 className="text-2xl font-bold print:text-center hidden print:block">Boletim Escolar - {selectedYear}</h2>
          <div className="print:flex print:justify-between print:mt-4 hidden print:block">
            <p>
              <strong>Aluno:</strong> {studentName}
            </p>
            <p>
              <strong>Matrícula:</strong> {studentId}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">Notas</h3>
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Disciplina</TableHead>
                    <TableHead className="text-center">1º Bim</TableHead>
                    <TableHead className="text-center">2º Bim</TableHead>
                    <TableHead className="text-center">3º Bim</TableHead>
                    <TableHead className="text-center">4º Bim</TableHead>
                    <TableHead className="text-center">Rec</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead className="text-center">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{grade.subject}</TableCell>
                      <TableCell className="text-center">{grade.period1?.toFixed(1) || "-"}</TableCell>
                      <TableCell className="text-center">{grade.period2?.toFixed(1) || "-"}</TableCell>
                      <TableCell className="text-center">{grade.period3?.toFixed(1) || "-"}</TableCell>
                      <TableCell className="text-center">{grade.period4?.toFixed(1) || "-"}</TableCell>
                      <TableCell className="text-center">{grade.recovery?.toFixed(1) || "-"}</TableCell>
                      <TableCell className="text-center font-semibold">{grade.finalGrade?.toFixed(1) || "-"}</TableCell>
                      <TableCell className={`text-center ${getStatusColor(grade.status)}`}>
                        {getStatusText(grade.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {attendance && (
              <>
                <h3 className="text-lg font-semibold mb-2">Frequência</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Dias Letivos</p>
                        <p className="text-3xl font-bold">{attendance.totalDays}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Faltas</p>
                        <p className="text-3xl font-bold">{attendance.absentDays}</p>
                        <p className="text-xs text-muted-foreground">({attendance.justifiedAbsences} justificadas)</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Frequência</p>
                        <p className="text-3xl font-bold">{attendance.attendancePercentage}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

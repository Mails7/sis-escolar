"use client"

import { useState } from "react"
import { useReportGenerator } from "@/hooks/use-report-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Download } from "lucide-react"

interface StudentPerformanceReportProps {
  student: {
    id: string
    name: string
    grades: Array<{ subject: string; value: number }>
    attendance: number
  }
  class: {
    id: string
    name: string
    studentCount: number
    averageGrades: Array<{ subject: string; average: number }>
    averageAttendance: number
  }
}

export function StudentPerformanceReport({ student, class: classData }: StudentPerformanceReportProps) {
  const [period, setPeriod] = useState("1º Bimestre")
  const { report, isLoading, error, generateReport } = useReportGenerator()

  const handleGenerateReport = () => {
    generateReport({
      reportType: "student-performance",
      studentData: student,
      classData,
      period,
    })
  }

  const handleDownloadReport = () => {
    if (!report) return

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${student.name.toLowerCase().replace(/\s+/g, "-")}-${period.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatório de Desempenho do Aluno</CardTitle>
        <CardDescription>
          Gere um relatório detalhado sobre o desempenho do aluno {student.name} na turma {classData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Aluno</label>
              <div className="mt-1 p-2 border rounded-md bg-muted">{student.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Turma</label>
              <div className="mt-1 p-2 border rounded-md bg-muted">{classData.name}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Período</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1º Bimestre">1º Bimestre</SelectItem>
                <SelectItem value="2º Bimestre">2º Bimestre</SelectItem>
                <SelectItem value="3º Bimestre">3º Bimestre</SelectItem>
                <SelectItem value="4º Bimestre">4º Bimestre</SelectItem>
                <SelectItem value="Ano Letivo Completo">Ano Letivo Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!report && !isLoading && (
            <div className="flex justify-center mt-6">
              <Button onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Relatório
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}

          {error && (
            <div className="p-4 mt-4 bg-red-50 text-red-800 rounded-md">
              <p>Erro ao gerar relatório: {error}</p>
            </div>
          )}

          {report && (
            <Tabs defaultValue="preview" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Visualização</TabsTrigger>
                <TabsTrigger value="raw">Texto Completo</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <div className="p-4 border rounded-md bg-white">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, "<br />") }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="raw" className="mt-4">
                <pre className="p-4 border rounded-md bg-muted overflow-auto whitespace-pre-wrap">{report}</pre>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      {report && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

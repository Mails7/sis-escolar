"use client"

import { useState } from "react"

interface StudentData {
  id: string
  name: string
  grades: Array<{ subject: string; value: number }>
  attendance: number
}

interface ClassData {
  id: string
  name: string
  studentCount: number
  averageGrades: Array<{ subject: string; average: number }>
  averageAttendance: number
}

interface ReportGeneratorProps {
  reportType: "student-performance" | "class-overview"
  studentData?: StudentData
  classData: ClassData
  period: string
}

export function useReportGenerator() {
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateReport = async ({ reportType, studentData, classData, period }: ReportGeneratorProps) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/report-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          studentData,
          classData,
          period,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao gerar relatório")
      }

      const data = await response.json()
      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      console.error("Erro ao gerar relatório:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    report,
    isLoading,
    error,
    generateReport,
  }
}

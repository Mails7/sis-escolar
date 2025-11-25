"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Period {
  id: number
  name: string
  startDate: Date
  endDate: Date
  description?: string
  color?: string
}

// Mock data for school periods
const initialPeriods = [
  {
    id: 1,
    name: "1º Bimestre",
    startDate: new Date(2024, 1, 5),
    endDate: new Date(2024, 3, 15),
    description: "Primeiro bimestre do ano letivo",
    color: "#f44336",
  },
  {
    id: 2,
    name: "2º Bimestre",
    startDate: new Date(2024, 3, 16),
    endDate: new Date(2024, 5, 30),
    description: "Segundo bimestre do ano letivo",
    color: "#e91e63",
  },
  {
    id: 3,
    name: "3º Bimestre",
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 8, 15),
    description: "Terceiro bimestre do ano letivo",
    color: "#9c27b0",
  },
  {
    id: 4,
    name: "4º Bimestre",
    startDate: new Date(2024, 8, 16),
    endDate: new Date(2024, 11, 15),
    description: "Quarto bimestre do ano letivo",
    color: "#673ab7",
  },
  {
    id: 5,
    name: "1º Semestre",
    startDate: new Date(2024, 1, 5),
    endDate: new Date(2024, 5, 30),
    description: "Primeiro semestre do ano letivo",
    color: "#3f51b5",
  },
  {
    id: 6,
    name: "2º Semestre",
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 11, 15),
    description: "Segundo semestre do ano letivo",
    color: "#2196f3",
  },
  {
    id: 7,
    name: "Ano Letivo 2024",
    startDate: new Date(2024, 1, 5),
    endDate: new Date(2024, 11, 15),
    description: "Ano letivo de 2024",
    color: "#03a9f4",
  },
]

interface CalendarPeriodsProps {
  expanded?: boolean
  periods?: Period[]
}

export function CalendarPeriods({ periods = initialPeriods }: CalendarPeriodsProps) {
  // Ordenar períodos por data de início
  const sortedPeriods = [...periods].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  // Função para calcular o progresso do período
  const calculateProgress = (startDate: Date, endDate: Date) => {
    const now = new Date()
    const total = endDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()

    if (now < startDate) return 0
    if (now > endDate) return 100

    return Math.round((elapsed / total) * 100)
  }

  // Função para obter o status do período
  const getPeriodStatus = (startDate: Date, endDate: Date) => {
    const now = new Date()

    if (now < startDate) return { label: "Não iniciado", variant: "outline" as const }
    if (now > endDate) return { label: "Concluído", variant: "secondary" as const }
    return { label: "Em andamento", variant: "default" as const }
  }

  // Função para formatar intervalo de datas
  const formatDateRange = (startDate: Date, endDate: Date) => {
    return `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`
  }

  return (
    <div className="space-y-4">
      {sortedPeriods.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">Nenhum período letivo definido</CardContent>
        </Card>
      ) : (
        sortedPeriods.map((period) => {
          const progress = calculateProgress(period.startDate, period.endDate)
          const status = getPeriodStatus(period.startDate, period.endDate)

          return (
            <Card key={period.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{period.name}</CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateRange(period.startDate, period.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {period.description && <p className="text-sm text-muted-foreground mb-2">{period.description}</p>}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

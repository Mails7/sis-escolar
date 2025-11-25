"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Printer, Download, Plus } from "lucide-react"

type CalendarEvent = {
  id: string
  date: Date
  name: string
  type: "holiday" | "exam" | "event" | "period_start" | "period_end"
  description?: string
}

export function AcademicCalendar() {
  const [selectedYear, setSelectedYear] = useState<string>("2023")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"month" | "list">("month")

  // Dados de exemplo para demonstração
  const availableYears = ["2023", "2022", "2021"]

  const events: CalendarEvent[] = [
    {
      id: "1",
      date: new Date(2023, 0, 1),
      name: "Ano Novo",
      type: "holiday",
      description: "Feriado Nacional",
    },
    {
      id: "2",
      date: new Date(2023, 1, 20),
      name: "Carnaval",
      type: "holiday",
      description: "Feriado Nacional",
    },
    {
      id: "3",
      date: new Date(2023, 3, 7),
      name: "Sexta-feira Santa",
      type: "holiday",
      description: "Feriado Nacional",
    },
    {
      id: "4",
      date: new Date(2023, 3, 21),
      name: "Tiradentes",
      type: "holiday",
      description: "Feriado Nacional",
    },
    {
      id: "5",
      date: new Date(2023, 4, 1),
      name: "Dia do Trabalho",
      type: "holiday",
      description: "Feriado Nacional",
    },
    {
      id: "6",
      date: new Date(2023, 1, 6),
      name: "Início do 1º Bimestre",
      type: "period_start",
      description: "Início do período letivo",
    },
    {
      id: "7",
      date: new Date(2023, 3, 14),
      name: "Fim do 1º Bimestre",
      type: "period_end",
      description: "Fim do período letivo",
    },
    {
      id: "8",
      date: new Date(2023, 3, 17),
      name: "Início do 2º Bimestre",
      type: "period_start",
      description: "Início do período letivo",
    },
    {
      id: "9",
      date: new Date(2023, 5, 30),
      name: "Fim do 2º Bimestre",
      type: "period_end",
      description: "Fim do período letivo",
    },
    {
      id: "10",
      date: new Date(2023, 7, 1),
      name: "Início do 3º Bimestre",
      type: "period_start",
      description: "Início do período letivo",
    },
  ]

  const getEventsByDate = (date: Date | undefined) => {
    if (!date) return []
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "holiday":
        return "bg-red-500"
      case "exam":
        return "bg-blue-500"
      case "event":
        return "bg-green-500"
      case "period_start":
        return "bg-purple-500"
      case "period_end":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const selectedDateEvents = getEventsByDate(date)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Calendário Acadêmico</CardTitle>
          <CardDescription>Visualize eventos, feriados e períodos letivos</CardDescription>
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
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")}>
            <TabsList>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={view} className="w-full">
          <TabsContent value="month" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              <div className="col-span-1 md:col-span-5">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    holiday: events.filter((event) => event.type === "holiday").map((event) => event.date),
                    event: events.filter((event) => event.type === "event").map((event) => event.date),
                    period_start: events.filter((event) => event.type === "period_start").map((event) => event.date),
                    period_end: events.filter((event) => event.type === "period_end").map((event) => event.date),
                    exam: events.filter((event) => event.type === "exam").map((event) => event.date),
                  }}
                  modifiersStyles={{
                    holiday: { color: "red", fontWeight: "bold" },
                    event: { color: "green", fontWeight: "bold" },
                    period_start: { color: "purple", fontWeight: "bold" },
                    period_end: { color: "orange", fontWeight: "bold" },
                    exam: { color: "blue", fontWeight: "bold" },
                  }}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {date?.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    <CardDescription>
                      {selectedDateEvents.length === 0
                        ? "Nenhum evento neste dia"
                        : `${selectedDateEvents.length} evento(s)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDateEvents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDateEvents.map((event) => (
                          <div
                            key={event.id}
                            className="border-l-4 pl-3 py-1"
                            style={{ borderColor: getEventBadgeColor(event.type).replace("bg-", "") }}
                          >
                            <h4 className="font-semibold">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <Badge className={`mt-1 ${getEventBadgeColor(event.type)}`}>
                              {event.type === "holiday"
                                ? "Feriado"
                                : event.type === "exam"
                                  ? "Avaliação"
                                  : event.type === "event"
                                    ? "Evento"
                                    : event.type === "period_start"
                                      ? "Início de Período"
                                      : event.type === "period_end"
                                        ? "Fim de Período"
                                        : "Outro"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40">
                        <p className="text-muted-foreground">Nenhum evento agendado</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" /> Adicionar Evento
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-0">
            <div className="rounded-md border">
              <div className="p-4 space-y-4">
                {events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-2 hover:bg-muted rounded-md">
                      <div className="min-w-24 text-right">
                        <div className="font-medium">
                          {event.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString("pt-BR", { weekday: "short" })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.description}</div>
                      </div>
                      <Badge className={getEventBadgeColor(event.type)}>
                        {event.type === "holiday"
                          ? "Feriado"
                          : event.type === "exam"
                            ? "Avaliação"
                            : event.type === "event"
                              ? "Evento"
                              : event.type === "period_start"
                                ? "Início de Período"
                                : event.type === "period_end"
                                  ? "Fim de Período"
                                  : "Outro"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

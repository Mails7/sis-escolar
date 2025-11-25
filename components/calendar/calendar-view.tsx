"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarPeriods } from "./calendar-periods"
import { CalendarHolidays } from "./calendar-holidays"
import { CalendarEvents } from "./calendar-events"
import { CalendarIcon, ListIcon, LayoutGridIcon } from "lucide-react"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")

  // Dados de exemplo para eventos
  const events = [
    { id: 1, title: "Reunião de Pais", date: new Date(2023, 4, 15), type: "meeting" },
    { id: 2, title: "Prova de Matemática", date: new Date(2023, 4, 18), type: "exam" },
    { id: 3, title: "Feriado Municipal", date: new Date(2023, 4, 20), type: "holiday" },
    { id: 4, title: "Conselho de Classe", date: new Date(2023, 4, 25), type: "meeting" },
  ]

  // Função para renderizar eventos no calendário
  const renderEvents = (day: Date) => {
    const dayEvents = events.filter((event) => event.date.toDateString() === day.toDateString())

    if (dayEvents.length === 0) return null

    return (
      <div className="absolute bottom-0 left-0 right-0">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={`text-xs truncate px-1 rounded-sm mt-0.5 ${
              event.type === "holiday"
                ? "bg-red-100 text-red-800"
                : event.type === "exam"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {event.title}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <Tabs defaultValue="calendar" className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="grid">
                <LayoutGridIcon className="h-4 w-4 mr-2" />
                Grade
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="flex-1 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              <div className="md:col-span-5">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border h-full"
                  components={{
                    DayContent: ({ day }) => (
                      <div className="relative h-full w-full p-2">
                        <span>{day.day}</span>
                        {renderEvents(day.date)}
                      </div>
                    ),
                  }}
                />
              </div>
              <div className="md:col-span-2 space-y-6">
                <CalendarPeriods />
                <CalendarHolidays />
                <CalendarEvents />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="flex-1 pt-2">
            <div className="space-y-6">
              <CalendarEvents expanded />
              <CalendarHolidays expanded />
              <CalendarPeriods expanded />
            </div>
          </TabsContent>

          <TabsContent value="grid" className="flex-1 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className={`h-2 ${
                        event.type === "holiday"
                          ? "bg-red-500"
                          : event.type === "exam"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString("pt-BR")}</p>
                      <h3 className="font-medium mt-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 capitalize">
                        {event.type === "holiday" ? "Feriado" : event.type === "exam" ? "Avaliação" : "Reunião"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

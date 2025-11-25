"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer, Download, Edit, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type ScheduleEntry = {
  id: string
  class_id: string
  subject: {
    name: string
  }
  teacher: {
    name: string
  }
  day_of_week: number
  start_time: string
  end_time: string
  room: string
}

type Class = {
  id: string
  name: string
}

type Subject = {
  id: string
  name: string
}

type Teacher = {
  id: string
  name: string
}

type ClassScheduleProps = {
  classes: Class[]
  subjects: Subject[]
  teachers: Teacher[]
  scheduleEntries: ScheduleEntry[]
  selectedClassId?: string
}

export function ClassSchedule({ classes, subjects, teachers, scheduleEntries, selectedClassId }: ClassScheduleProps) {
  const [selectedClass, setSelectedClass] = useState<string>(selectedClassId || "")
  const [view, setView] = useState<"grid" | "list">("grid")

  // Filtrar entradas do horário pela turma selecionada
  const filteredEntries = selectedClass
    ? scheduleEntries.filter((entry) => entry.class_id === selectedClass)
    : scheduleEntries

  const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

  const periods = [
    "1º Período (7:30 - 8:20)",
    "2º Período (8:20 - 9:10)",
    "3º Período (9:10 - 10:00)",
    "Intervalo (10:00 - 10:20)",
    "4º Período (10:20 - 11:10)",
    "5º Período (11:10 - 12:00)",
  ]

  const getScheduleForPeriod = (day: number, period: number) => {
    return filteredEntries.find(
      (entry) =>
        entry.day_of_week === day &&
        ((entry.start_time.startsWith("07:30") && period === 0) ||
          (entry.start_time.startsWith("08:20") && period === 1) ||
          (entry.start_time.startsWith("09:10") && period === 2) ||
          (entry.start_time.startsWith("10:20") && period === 4) ||
          (entry.start_time.startsWith("11:10") && period === 5)),
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Lógica para gerar PDF e fazer download
    alert("Funcionalidade de download em desenvolvimento")
  }

  const handleEdit = () => {
    // Redirecionar para a página de edição
    alert("Funcionalidade de edição em desenvolvimento")
  }

  const handleAdd = () => {
    // Redirecionar para a página de adição
    alert("Funcionalidade de adição em desenvolvimento")
  }

  // Verificar se há dados para exibir
  const hasData = classes.length > 0 && subjects.length > 0 && teachers.length > 0

  if (!hasData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Dados insuficientes</AlertTitle>
        <AlertDescription>
          Não há turmas, disciplinas ou professores cadastrados. Por favor, cadastre esses dados antes de criar
          horários.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <div>
          <CardTitle>Quadro de Horários</CardTitle>
          <CardDescription>Visualize os horários de aulas da turma</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {classes.length > 0 && (
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid">Grade</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="print:block print:mb-6">
          <h2 className="text-2xl font-bold print:text-center hidden print:block">
            Quadro de Horários - {classes.find((c) => c.id === selectedClass)?.name || "Todas as turmas"}
          </h2>
        </div>

        {scheduleEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum horário cadastrado.</p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Horário
            </Button>
          </div>
        ) : (
          <Tabs value={view} className="w-full">
            <TabsContent value="grid" className="mt-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Horário</TableHead>
                      {weekDays.slice(1, 6).map((day, index) => (
                        <TableHead key={index}>{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map((period, periodIndex) => (
                      <TableRow key={periodIndex}>
                        <TableCell className="font-medium">
                          {periodIndex === 3 ? <Badge variant="outline">Intervalo</Badge> : period.split(" ")[0]}
                          <div className="text-xs text-muted-foreground">{period.match(/$$(.*?)$$/)?.[1] || ""}</div>
                        </TableCell>
                        {weekDays.slice(1, 6).map((_, dayIndex) => (
                          <TableCell key={dayIndex}>
                            {periodIndex !== 3
                              ? (() => {
                                  const entry = getScheduleForPeriod(dayIndex + 1, periodIndex)
                                  return entry ? (
                                    <div>
                                      <div className="font-medium">{entry.subject.name}</div>
                                      <div className="text-xs text-muted-foreground">{entry.teacher.name}</div>
                                      <div className="text-xs text-muted-foreground">{entry.room}</div>
                                    </div>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="h-8 w-full justify-start">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Adicionar
                                    </Button>
                                  )
                                })()
                              : null}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries
                      .sort((a, b) => {
                        if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week
                        return a.start_time.localeCompare(b.start_time)
                      })
                      .map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{weekDays[entry.day_of_week]}</TableCell>
                          <TableCell>
                            {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                          </TableCell>
                          <TableCell>
                            {classes.find((c) => c.id === entry.class_id)?.name || "Turma não encontrada"}
                          </TableCell>
                          <TableCell>{entry.subject.name}</TableCell>
                          <TableCell>{entry.teacher.name}</TableCell>
                          <TableCell>{entry.room}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

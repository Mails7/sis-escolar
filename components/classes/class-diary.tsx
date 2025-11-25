"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { getStudentsByClassId, getDiaryEntries, getDiaryEntryByDate, saveDiaryEntry } from "@/app/actions/class-diary-actions"

interface ClassDiaryProps {
  classId: string
  classDetails: any
  isDemo?: boolean
}

interface Student {
  id: string
  name: string
  present: boolean
}

interface DiaryEntry {
  id?: string
  date: Date
  subject: string
  content: string
  activities: string
  homework: string
  observations: string
  students: Student[]
}

export default function ClassDiary({ classId, classDetails, isDemo = false }: ClassDiaryProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry>({
    date: new Date(),
    subject: "",
    content: "",
    activities: "",
    homework: "",
    observations: "",
    students: [],
  })
  const [loading, setLoading] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [entries, setEntries] = useState<{ date: string; id: string }[]>([])
  const [activeTab, setActiveTab] = useState("content")

  // Carregar alunos da turma
  useEffect(() => {
    async function fetchStudents() {
      try {
        if (isDemo) {
          // Dados de demonstração
          const demoStudents = [
            { id: "1", name: "Ana Silva", present: true },
            { id: "2", name: "Bruno Oliveira", present: true },
            { id: "3", name: "Carla Santos", present: false },
            { id: "4", name: "Daniel Pereira", present: true },
            { id: "5", name: "Eduarda Lima", present: true },
            { id: "6", name: "Fábio Costa", present: true },
            { id: "7", name: "Gabriela Martins", present: false },
            { id: "8", name: "Henrique Souza", present: true },
          ]
          setStudents(demoStudents)
          setDiaryEntry((prev) => ({ ...prev, students: demoStudents }))
          return
        }

        const { students: fetchedStudents, error } = await getStudentsByClassId(classId)

        if (error) {
          console.error("Error fetching students:", error)
          toast({
            title: "Erro ao carregar alunos",
            description: error,
            variant: "destructive",
          })
          // Fallback to empty or handle error gracefully
          setStudents([])
          return
        }

        setStudents(fetchedStudents)
        setDiaryEntry((prev) => ({ ...prev, students: fetchedStudents }))
      } catch (error) {
        console.error("Error in fetchStudents:", error)
        toast({
          title: "Erro ao carregar alunos",
          description: "Ocorreu um erro ao carregar a lista de alunos.",
          variant: "destructive",
        })
      }
    }

    fetchStudents()
  }, [classId, isDemo])

  // Carregar entradas do diário
  useEffect(() => {
    async function fetchDiaryEntries() {
      try {
        if (isDemo) {
          // Dados de demonstração para entradas do diário
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const twoDaysAgo = new Date(today)
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

          const demoEntries = [
            { date: format(today, "yyyy-MM-dd"), id: "today" },
            { date: format(yesterday, "yyyy-MM-dd"), id: "yesterday" },
            { date: format(twoDaysAgo, "yyyy-MM-dd"), id: "twodaysago" },
          ]
          setEntries(demoEntries)
          return
        }

        const { entries: fetchedEntries, error } = await getDiaryEntries(classId)

        if (error) {
          console.error("Error fetching diary entries:", error)
          toast({
            title: "Erro ao carregar entradas do diário",
            description: error,
            variant: "destructive",
          })
          return
        }

        setEntries(fetchedEntries)
      } catch (error) {
        console.error("Error in fetchDiaryEntries:", error)
        toast({
          title: "Erro ao carregar entradas do diário",
          description: "Ocorreu um erro ao carregar as entradas do diário.",
          variant: "destructive",
        })
      }
    }

    fetchDiaryEntries()
  }, [classId, isDemo])

  // Carregar entrada do diário para a data selecionada
  useEffect(() => {
    async function fetchDiaryEntry() {
      setLoadingEntry(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")

        // Verificar se estamos no modo de demonstração
        if (isDemo) {
          // Dados de demonstração para a entrada do diário
          const demoEntry = {
            id: "demo",
            date: date,
            subject: "Matemática - Operações Básicas",
            content: "Introdução às operações de adição e subtração com números naturais até 10.",
            activities: "Exercícios do livro páginas 15-17. Atividade em grupo para contagem com material concreto.",
            homework: "Exercícios 1 a 5 da página 18 do livro.",
            observations:
              "A turma demonstrou bom entendimento do conteúdo. Alguns alunos precisam de reforço na contagem regressiva.",
            students: students.map((student) => ({
              ...student,
              present: Math.random() > 0.2, // 80% de chance de estar presente
            })),
          }
          setDiaryEntry(demoEntry)
          setLoadingEntry(false)
          return
        }

        const { entry, error } = await getDiaryEntryByDate(classId, formattedDate)

        if (error) {
          console.error("Error fetching diary entry:", error)
          toast({
            title: "Erro ao carregar entrada do diário",
            description: error,
            variant: "destructive",
          })
          setLoadingEntry(false)
          return
        }

        if (!entry) {
          // Entrada não encontrada para esta data, criar uma nova
          const newEntry = {
            date: date,
            subject: "",
            content: "",
            activities: "",
            homework: "",
            observations: "",
            students: students.map((student) => ({
              ...student,
              present: true,
            })),
          }
          setDiaryEntry(newEntry)
        } else {
          // Processar dados de presença
          let studentsWithAttendance = [...students]
          if (entry.attendance && Array.isArray(entry.attendance)) {
            studentsWithAttendance = students.map((student) => {
              const attendanceRecord = entry.attendance.find((a: any) => a.student_id === student.id)
              return {
                ...student,
                present: attendanceRecord ? attendanceRecord.present : true,
              }
            })
          }

          setDiaryEntry({
            id: entry.id,
            date: new Date(entry.date),
            subject: entry.subject || "",
            content: entry.content || "",
            activities: entry.activities || "",
            homework: entry.homework || "",
            observations: entry.observations || "",
            students: studentsWithAttendance,
          })
        }
      } catch (error) {
        console.error("Error in fetchDiaryEntry:", error)
        toast({
          title: "Erro ao carregar entrada do diário",
          description: "Ocorreu um erro ao carregar a entrada do diário para a data selecionada.",
          variant: "destructive",
        })
      } finally {
        setLoadingEntry(false)
      }
    }

    if (students.length > 0) {
      fetchDiaryEntry()
    }
  }, [date, classId, students, isDemo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiaryEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setDiaryEntry((prev) => ({
      ...prev,
      students: prev.students.map((student) => (student.id === studentId ? { ...student, present } : student)),
    }))
  }

  const handleSave = async () => {
    if (isDemo) {
      toast({
        title: "Modo de demonstração",
        description: "No modo de demonstração, os dados não são salvos no banco de dados.",
      })
      return
    }

    setLoading(true)
    try {
      const formattedDate = format(diaryEntry.date, "yyyy-MM-dd")

      // Preparar dados de presença
      const attendance = diaryEntry.students.map((student) => ({
        student_id: student.id,
        present: student.present,
      }))

      const entryData = {
        id: diaryEntry.id,
        class_id: classId,
        date: formattedDate,
        subject: diaryEntry.subject,
        content: diaryEntry.content,
        activities: diaryEntry.activities,
        homework: diaryEntry.homework,
        observations: diaryEntry.observations,
        attendance: attendance,
      }

      const result = await saveDiaryEntry(entryData)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Atualizar o ID da entrada atual se for uma nova inserção
      if (!diaryEntry.id && result.id) {
        setDiaryEntry((prev) => ({ ...prev, id: result.id }))

        // Atualizar a lista de entradas
        setEntries((prev) => [
          { date: formattedDate, id: result.id },
          ...prev.filter((entry) => entry.date !== formattedDate),
        ])
      }

      toast({
        title: "Diário salvo",
        description: "As informações do diário foram salvas com sucesso.",
      })

      // Atualizar a lista de entradas
      router.refresh()
    } catch (error) {
      console.error("Error saving diary entry:", error)
      toast({
        title: "Erro ao salvar diário",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o diário.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="date">Data da Aula</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="subject">Disciplina/Conteúdo</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Ex: Matemática - Operações Básicas"
              value={diaryEntry.subject}
              onChange={handleInputChange}
              disabled={loadingEntry}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="content">Conteúdo e Atividades</TabsTrigger>
            <TabsTrigger value="attendance">Frequência</TabsTrigger>
            <TabsTrigger value="notes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo Ministrado</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Descreva o conteúdo ministrado na aula..."
                value={diaryEntry.content}
                onChange={handleInputChange}
                rows={4}
                disabled={loadingEntry}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activities">Atividades Realizadas</Label>
              <Textarea
                id="activities"
                name="activities"
                placeholder="Descreva as atividades realizadas em sala..."
                value={diaryEntry.activities}
                onChange={handleInputChange}
                rows={3}
                disabled={loadingEntry}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homework">Tarefa de Casa</Label>
              <Textarea
                id="homework"
                name="homework"
                placeholder="Descreva a tarefa de casa..."
                value={diaryEntry.homework}
                onChange={handleInputChange}
                rows={2}
                disabled={loadingEntry}
              />
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Lista de Presença</h3>
                <div className="text-sm text-muted-foreground">
                  Presentes: {diaryEntry.students.filter((s) => s.present).length}/{diaryEntry.students.length}
                </div>
              </div>

              {diaryEntry.students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum aluno matriculado nesta turma.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {diaryEntry.students.map((student) => (
                    <div
                      key={student.id}
                      className={cn(
                        "flex items-center space-x-2 border rounded-md p-3",
                        student.present ? "bg-green-50" : "bg-red-50",
                      )}
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={student.present}
                        onCheckedChange={(checked) => handleAttendanceChange(student.id, checked === true)}
                        disabled={loadingEntry}
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                      >
                        {student.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                name="observations"
                placeholder="Observações sobre a aula, comportamento dos alunos, etc..."
                value={diaryEntry.observations}
                onChange={handleInputChange}
                rows={6}
                disabled={loadingEntry}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={loading || loadingEntry}>
            {loading ? "Salvando..." : "Salvar Diário"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

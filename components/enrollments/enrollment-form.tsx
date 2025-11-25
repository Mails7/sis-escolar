"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { createEnrollment, updateEnrollment } from "@/app/actions/enrollment-actions"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Definir o esquema de validação
const enrollmentFormSchema = z.object({
  student_id: z.string({
    required_error: "Por favor, selecione um aluno",
  }),
  class_id: z.string({
    required_error: "Por favor, selecione uma turma",
  }),
  school_year: z.coerce
    .number({
      required_error: "Por favor, informe o ano letivo",
      invalid_type_error: "O ano letivo deve ser um número",
    })
    .int()
    .min(2000)
    .max(2100),
  enrollment_date: z.date({
    required_error: "Por favor, selecione a data de matrícula",
  }),
  status: z.enum(["active", "transferred", "abandoned", "concluded"], {
    required_error: "Por favor, selecione o status",
  }),
})

type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>

type Student = {
  id: string
  name: string
  registration_code: string
}

type Class = {
  id: string
  name: string
  school_year: number
  grade: string
}

interface EnrollmentFormProps {
  enrollment?: {
    id: string
    student_id: string
    class_id: string
    school_year: number
    enrollment_date: string
    status: string
  }
}

// Criar uma instância do cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export function EnrollmentForm({ enrollment }: EnrollmentFormProps) {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Definir valores padrão
  const defaultValues: Partial<EnrollmentFormValues> = {
    student_id: enrollment?.student_id || "",
    class_id: enrollment?.class_id || "",
    school_year: enrollment?.school_year || new Date().getFullYear(),
    enrollment_date: enrollment?.enrollment_date ? new Date(enrollment.enrollment_date) : new Date(),
    status: (enrollment?.status as "active" | "transferred" | "abandoned" | "concluded") || "active",
  }

  // Inicializar o formulário
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues,
  })

  // Carregar alunos e turmas
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true)
      setError(null)

      try {
        // Verificar se as tabelas existem
        const { error: studentsTableError } = await supabase
          .from("students")
          .select("count", { count: "exact", head: true })

        if (studentsTableError && studentsTableError.code === "42P01") {
          setError("A tabela de alunos não existe. Por favor, configure o banco de dados primeiro.")
          setIsLoadingData(false)
          return
        }

        const { error: classesTableError } = await supabase
          .from("classes")
          .select("count", { count: "exact", head: true })

        if (classesTableError && classesTableError.code === "42P01") {
          setError("A tabela de turmas não existe. Por favor, configure o banco de dados primeiro.")
          setIsLoadingData(false)
          return
        }

        // Carregar alunos
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("id, name, registration_code")
          .order("name")

        if (studentsError) {
          console.error("Erro ao carregar alunos:", studentsError)
          setError("Erro ao carregar alunos. Por favor, tente novamente.")
        } else if (studentsData) {
          setStudents(studentsData)
        }

        // Carregar turmas
        const { data: classesData, error: classesError } = await supabase
          .from("classes")
          .select("id, name, school_year, grade")
          .order("name")

        if (classesError) {
          console.error("Erro ao carregar turmas:", classesError)
          setError("Erro ao carregar turmas. Por favor, tente novamente.")
        } else if (classesData) {
          setClasses(classesData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Ocorreu um erro inesperado. Por favor, tente novamente.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [])

  // Função para lidar com o envio do formulário
  async function onSubmit(data: EnrollmentFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      if (enrollment) {
        // Atualizar matrícula existente
        const result = await updateEnrollment({
          id: enrollment.id,
          ...data,
          enrollment_date: format(data.enrollment_date, "yyyy-MM-dd"),
        })

        if (!result.success) {
          throw new Error(result.error || "Erro ao atualizar matrícula")
        }
      } else {
        // Criar nova matrícula
        const result = await createEnrollment({
          ...data,
          enrollment_date: format(data.enrollment_date, "yyyy-MM-dd"),
        })

        if (!result.success) {
          throw new Error(result.error || "Erro ao criar matrícula")
        }
      }

      router.push("/enrollments")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar matrícula:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao salvar matrícula")
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" onClick={() => router.push("/enrollments")}>
              Voltar para Matrículas
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluno</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um aluno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.registration_code})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-students" disabled>
                            Nenhum aluno encontrado
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma turma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.length > 0 ? (
                          classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name} ({classItem.grade} - {classItem.school_year})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-classes" disabled>
                            Nenhuma turma encontrada
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano Letivo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value.toString()}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ano letivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enrollment_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Matrícula</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            disabled={isLoading}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="transferred">Transferida</SelectItem>
                        <SelectItem value="abandoned">Abandonada</SelectItem>
                        <SelectItem value="concluded">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Status atual da matrícula do aluno</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {enrollment ? "Atualizar" : "Cadastrar"} Matrícula
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

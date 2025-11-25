"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// Tipos
interface School {
  id: string
  name: string
}

interface Teacher {
  id: string
  name: string
}

interface ClassFormProps {
  schools: School[]
  teachers: Teacher[]
  initialData?: any
  demoMode?: boolean
}

// Schema de validação
const classFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  school_id: z.string().min(1, "Selecione uma escola"),
  school_year: z.coerce.number().int().min(2000, "O ano letivo deve ser maior que 2000"),
  grade: z.string().min(1, "Selecione uma série"),
  shift: z.string().min(1, "Selecione um turno"),
  classroom: z.string().min(1, "Informe a sala de aula"),
  max_students: z.coerce.number().int().min(1, "A capacidade deve ser maior que 0"),
  teacher_id: z.string().min(1, "Selecione um professor responsável"),
  start_date: z.date({
    required_error: "Selecione a data de início",
  }),
})

type ClassFormValues = z.infer<typeof classFormSchema>

// Função para criar uma nova turma
async function createClass(data: ClassFormValues) {
  try {
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erro ao criar turma")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating class:", error)
    throw error
  }
}

// Função para atualizar uma turma existente
async function updateClass(id: string, data: ClassFormValues) {
  try {
    const response = await fetch(`/api/classes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erro ao atualizar turma")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating class:", error)
    throw error
  }
}

export function ClassForm({ schools, teachers, initialData, demoMode = false }: ClassFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configurar o formulário com valores iniciais
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          school_year: Number.parseInt(initialData.school_year),
          max_students: Number.parseInt(initialData.max_students),
          start_date: initialData.start_date ? new Date(initialData.start_date) : new Date(),
        }
      : {
          name: "",
          school_id: "",
          school_year: new Date().getFullYear(),
          grade: "",
          shift: "",
          classroom: "",
          max_students: 30,
          teacher_id: "",
          start_date: new Date(),
        },
  })

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: ClassFormValues) => {
    setIsSubmitting(true)

    try {
      if (demoMode) {
        // No modo de demonstração, apenas simular o envio
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast({
          title: "Modo de demonstração",
          description: "No modo de demonstração, os dados não são salvos no banco de dados.",
        })
        router.push("/classes")
        return
      }

      if (initialData?.id) {
        // Atualizar turma existente
        await updateClass(initialData.id, data)
        toast({
          title: "Turma atualizada",
          description: "A turma foi atualizada com sucesso.",
        })
      } else {
        // Criar nova turma
        await createClass(data)
        toast({
          title: "Turma criada",
          description: "A turma foi criada com sucesso.",
        })
      }

      router.push("/classes")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Turma</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1º Ano A - Ensino Fundamental" {...field} />
                    </FormControl>
                    <FormDescription>Nome completo da turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma escola" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Escola onde a turma está localizada</FormDescription>
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
                      <Input type="number" min="2000" max="2100" {...field} />
                    </FormControl>
                    <FormDescription>Ano letivo da turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma série" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1º Ano">1º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="2º Ano">2º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="3º Ano">3º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="4º Ano">4º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="5º Ano">5º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="6º Ano">6º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="7º Ano">7º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="8º Ano">8º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="9º Ano">9º Ano - Ensino Fundamental</SelectItem>
                        <SelectItem value="1º Ano EM">1º Ano - Ensino Médio</SelectItem>
                        <SelectItem value="2º Ano EM">2º Ano - Ensino Médio</SelectItem>
                        <SelectItem value="3º Ano EM">3º Ano - Ensino Médio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Série/ano da turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manhã">Manhã</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noite">Noite</SelectItem>
                        <SelectItem value="Integral">Integral</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Turno de funcionamento da turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sala de Aula</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sala 101" {...field} />
                    </FormControl>
                    <FormDescription>Sala onde a turma tem aulas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_students"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormDescription>Número máximo de alunos na turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor Responsável</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um professor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Professor responsável pela turma</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Data de início das aulas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : initialData ? (
                  "Atualizar Turma"
                ) : (
                  "Cadastrar Turma"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

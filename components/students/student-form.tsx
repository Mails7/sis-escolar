"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CameraIcon, TrashIcon, UploadIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createStudent, updateStudent } from "@/app/actions/student-actions"

// Student form schema remains the same
const studentFormSchema = z.object({
  // Dados básicos
  nome: z.string().min(2, { message: "Nome é obrigatório" }),
  data_nascimento: z.date({ required_error: "Data de nascimento é obrigatória" }),
  sexo: z.string().min(1, { message: "Sexo é obrigatório" }),
  cor_raca: z.string().optional(),
  nacionalidade: z.string().optional(),
  naturalidade: z.string().optional(),
  estado_naturalidade: z.string().optional(),

  // Documentos
  cpf: z.string().optional(),
  rg: z.string().optional(),
  data_emissao_rg: z.date().optional(),
  orgao_emissao_rg: z.string().optional(),
  uf_emissao_rg: z.string().optional(),
  nis_pis_pasep: z.string().optional(),
  certidao_nascimento: z.string().optional(),
  livro_certidao: z.string().optional(),
  folha_certidao: z.string().optional(),
  termo_certidao: z.string().optional(),
  data_emissao_certidao: z.date().optional(),
  uf_emissao_certidao: z.string().optional(),
  cartorio_certidao: z.string().optional(),
  passaporte: z.string().optional(),

  // Contato
  telefone_residencial: z.string().optional(),
  telefone_celular: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),

  // Endereço
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  zona_localizacao: z.string().optional(),

  // Filiação
  nome_pai: z.string().optional(),
  cpf_pai: z.string().optional(),
  nome_mae: z.string().optional(),
  cpf_mae: z.string().optional(),

  // Responsável
  tipo_responsavel: z.string().optional(),
  nome_responsavel: z.string().optional(),
  cpf_responsavel: z.string().optional(),
  parentesco_responsavel: z.string().optional(),

  // Autorizados a buscar
  autorizado_um: z.string().optional(),
  parentesco_um: z.string().optional(),
  autorizado_dois: z.string().optional(),
  parentesco_dois: z.string().optional(),
  autorizado_tres: z.string().optional(),
  parentesco_tres: z.string().optional(),
  autorizado_quatro: z.string().optional(),
  parentesco_quatro: z.string().optional(),
  autorizado_cinco: z.string().optional(),
  parentesco_cinco: z.string().optional(),

  // Dados escolares
  inep_id: z.string().optional(),
  estado_id: z.string().optional(),
  alfabetizado: z.boolean().optional(),

  // Transporte
  tipo_transporte: z.string().optional(),
  utiliza_transporte_rural: z.boolean().optional(),
  veiculo_transporte: z.array(z.string()).optional(),
  rota_transporte: z.string().optional(),

  // Saúde
  grupo_sanguineo: z.string().optional(),
  fator_rh: z.string().optional(),
  sus: z.string().optional(),
  alergia_medicamento: z.boolean().optional(),
  desc_alergia_medicamento: z.string().optional(),
  alergia_alimento: z.boolean().optional(),
  desc_alergia_alimento: z.string().optional(),
  doenca_congenita: z.boolean().optional(),
  desc_doenca_congenita: z.string().optional(),
  fumante: z.boolean().optional(),
  doenca_caxumba: z.boolean().optional(),
  doenca_sarampo: z.boolean().optional(),
  doenca_rubeola: z.boolean().optional(),
  doenca_catapora: z.boolean().optional(),
  doenca_escarlatina: z.boolean().optional(),
  doenca_coqueluche: z.boolean().optional(),
  doenca_outras: z.string().optional(),
  epiletico: z.boolean().optional(),
  epiletico_tratamento: z.boolean().optional(),
  hemofilico: z.boolean().optional(),
  hipertenso: z.boolean().optional(),
  asmatico: z.boolean().optional(),
  diabetico: z.boolean().optional(),
  insulina: z.boolean().optional(),
  tratamento_medico: z.boolean().optional(),
  desc_tratamento_medico: z.string().optional(),
  medicacao_especifica: z.boolean().optional(),
  desc_medicacao_especifica: z.string().optional(),
  acomp_medico_psicologico: z.boolean().optional(),
  desc_acomp_medico_psicologico: z.string().optional(),
  restricao_atividade_fisica: z.boolean().optional(),
  desc_restricao_atividade_fisica: z.string().optional(),
  fratura_trauma: z.boolean().optional(),
  desc_fratura_trauma: z.string().optional(),
  plano_saude: z.boolean().optional(),
  desc_plano_saude: z.string().optional(),
  aceita_hospital_proximo: z.boolean().optional(),
  desc_aceita_hospital_proximo: z.string().optional(),

  // Contato de emergência
  responsavel_emergencia: z.string().optional(),
  responsavel_emergencia_parentesco: z.string().optional(),
  responsavel_emergencia_telefone: z.string().optional(),
  responsavel_emergencia_celular: z.string().optional(),

  // Dados socioeconômicos
  moradia: z.string().optional(),
  material: z.string().optional(),
  casa_outra: z.string().optional(),
  moradia_situacao: z.string().optional(),
  quartos: z.string().optional(),
  sala: z.string().optional(),
  copa: z.string().optional(),
  banheiro: z.string().optional(),
  garagem: z.string().optional(),
  empregada_domestica: z.boolean().optional(),
  automovel: z.boolean().optional(),
  motocicleta: z.boolean().optional(),
  geladeira: z.boolean().optional(),
  fogao: z.boolean().optional(),
  maquina_lavar: z.boolean().optional(),
  microondas: z.boolean().optional(),
  video_dvd: z.boolean().optional(),
  televisao: z.boolean().optional(),
  telefone: z.boolean().optional(),
  recursos_tecnologicos: z.array(z.string()).optional(),
  quant_pessoas: z.string().optional(),
  renda: z.string().optional(),
  agua_encanada: z.boolean().optional(),
  poco: z.boolean().optional(),
  energia: z.boolean().optional(),
  esgoto: z.boolean().optional(),
  fossa: z.boolean().optional(),
  lixo: z.string().optional(),

  // Dados para o censo
  recursos_prova_inep: z.array(z.string()).optional(),
  recebe_escolarizacao_em_outro_espaco: z.string().optional(),

  // Observações
  observacao: z.string().optional(),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

interface StudentFormProps {
  studentId?: string
  initialData?: Partial<StudentFormValues>
}

export function StudentForm({ studentId, initialData }: StudentFormProps = {}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isEditing = !!studentId

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData || {
      alfabetizado: false,
      utiliza_transporte_rural: false,
      alergia_medicamento: false,
      alergia_alimento: false,
      doenca_congenita: false,
      fumante: false,
      doenca_caxumba: false,
      doenca_sarampo: false,
      doenca_rubeola: false,
      doenca_catapora: false,
      doenca_escarlatina: false,
      doenca_coqueluche: false,
      epiletico: false,
      epiletico_tratamento: false,
      hemofilico: false,
      hipertenso: false,
      asmatico: false,
      diabetico: false,
      insulina: false,
      tratamento_medico: false,
      medicacao_especifica: false,
      acomp_medico_psicologico: false,
      restricao_atividade_fisica: false,
      fratura_trauma: false,
      plano_saude: false,
      aceita_hospital_proximo: false,
      empregada_domestica: false,
      automovel: false,
      motocicleta: false,
      geladeira: false,
      fogao: false,
      maquina_lavar: false,
      microondas: false,
      video_dvd: false,
      televisao: false,
      telefone: false,
      agua_encanada: false,
      poco: false,
      energia: false,
      esgoto: false,
      fossa: false,
      lixo: false,
      recursos_tecnologicos: [],
      recursos_prova_inep: [],
      veiculo_transporte: [],
    },
  })

  async function onSubmit(data: StudentFormValues) {
    setIsSubmitting(true)
    try {
      // Convert form data to FormData for server action
      const formData = new FormData()

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString())
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item))
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      // Add photo if available
      if (photoPreview) {
        // In a real app, you'd handle file upload to storage
        formData.append("photo", photoPreview)
      }

      // Submit to server action
      const result = isEditing ? await updateStudent(studentId, formData) : await createStudent(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Aluno atualizado" : "Aluno cadastrado",
          description: result.message,
        })

        // Se estiver em modo de demonstração, não redirecione
        if (result.demoMode) {
          toast({
            title: "Modo de demonstração",
            description:
              "O sistema está funcionando em modo de demonstração. Os dados não foram salvos no banco de dados.",
            variant: "warning",
          })
          setIsSubmitting(false)
          return
        }

        router.push("/students")
      } else {
        if (result.needsSetup) {
          toast({
            title: "Configuração necessária",
            description: "É necessário configurar o banco de dados antes de usar esta funcionalidade.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro",
            description: result.message,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Rest of the component remains the same...
  // ... (keeping the existing JSX)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="dados-pessoais" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="filiacao">Filiação</TabsTrigger>
            <TabsTrigger value="saude">Saúde</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
            <TabsTrigger value="socioeconomico">Socioeconômico</TabsTrigger>
            <TabsTrigger value="outros">Outros</TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="dados-pessoais" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4 mb-4 md:mb-0">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        {photoPreview ? (
                          <AvatarImage src={photoPreview || "/placeholder.svg"} alt="Foto do aluno" />
                        ) : (
                          <AvatarFallback className="bg-muted">
                            <CameraIcon className="h-12 w-12 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <UploadIcon className="h-4 w-4" />
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Formatos: JPG, PNG, GIF
                      <br />
                      Tamanho máximo: 2MB
                    </p>
                  </div>

                  <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome completo*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="data_nascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de nascimento*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="M">Masculino</SelectItem>
                              <SelectItem value="F">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cor_raca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raça/Cor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Branca</SelectItem>
                              <SelectItem value="2">Preta</SelectItem>
                              <SelectItem value="3">Parda</SelectItem>
                              <SelectItem value="4">Amarela</SelectItem>
                              <SelectItem value="5">Indígena</SelectItem>
                              <SelectItem value="6">Não declarada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nacionalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nacionalidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Brasileiro</SelectItem>
                              <SelectItem value="2">Naturalizado brasileiro</SelectItem>
                              <SelectItem value="3">Estrangeiro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="naturalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naturalidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade de nascimento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado_naturalidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF Naturalidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AC">Acre</SelectItem>
                              <SelectItem value="AL">Alagoas</SelectItem>
                              <SelectItem value="AP">Amapá</SelectItem>
                              <SelectItem value="AM">Amazonas</SelectItem>
                              <SelectItem value="BA">Bahia</SelectItem>
                              <SelectItem value="CE">Ceará</SelectItem>
                              <SelectItem value="DF">Distrito Federal</SelectItem>
                              <SelectItem value="ES">Espírito Santo</SelectItem>
                              <SelectItem value="GO">Goiás</SelectItem>
                              <SelectItem value="MA">Maranhão</SelectItem>
                              <SelectItem value="MT">Mato Grosso</SelectItem>
                              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                              <SelectItem value="MG">Minas Gerais</SelectItem>
                              <SelectItem value="PA">Pará</SelectItem>
                              <SelectItem value="PB">Paraíba</SelectItem>
                              <SelectItem value="PR">Paraná</SelectItem>
                              <SelectItem value="PE">Pernambuco</SelectItem>
                              <SelectItem value="PI">Piauí</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                              <SelectItem value="RO">Rondônia</SelectItem>
                              <SelectItem value="RR">Roraima</SelectItem>
                              <SelectItem value="SC">Santa Catarina</SelectItem>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="SE">Sergipe</SelectItem>
                              <SelectItem value="TO">Tocantins</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone_celular"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone celular</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alfabetizado"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Alfabetizado</FormLabel>
                            <FormDescription>Marque se o aluno já é alfabetizado</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dados para o Censo Escolar</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inep_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código INEP</FormLabel>
                          <FormControl>
                            <Input placeholder="Código INEP do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código rede estadual (RA)</FormLabel>
                          <FormControl>
                            <Input placeholder="Código RA do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recebe_escolarizacao_em_outro_espaco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recebe escolarização em outro espaço</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Não recebe escolarização fora da escola</SelectItem>
                              <SelectItem value="2">Em hospital</SelectItem>
                              <SelectItem value="3">Em domicílio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recursos_prova_inep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recursos necessários para realização de provas</FormLabel>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="auxilio_ledor"
                                checked={field.value?.includes("1")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "1"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "1") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="auxilio_ledor">Auxílio ledor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="auxilio_transcricao"
                                checked={field.value?.includes("2")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "2"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "2") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="auxilio_transcricao">Auxílio transcrição</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="guia_interprete"
                                checked={field.value?.includes("3")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "3"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "3") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="guia_interprete">Guia-intérprete</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="tradutor_libras"
                                checked={field.value?.includes("4")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "4"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "4") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="tradutor_libras">Tradutor-intérprete de Libras</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="leitura_labial"
                                checked={field.value?.includes("5")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "5"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "5") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="leitura_labial">Leitura labial</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="prova_ampliada"
                                checked={field.value?.includes("6")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "6"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "6") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="prova_ampliada">Prova ampliada</Label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Documentos Pessoais</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nis_pis_pasep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIS (PIS/PASEP)</FormLabel>
                          <FormControl>
                            <Input placeholder="000.00000.00-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="rg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RG</FormLabel>
                            <FormControl>
                              <Input placeholder="Documento de identidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="data_emissao_rg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de emissão</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="orgao_emissao_rg"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Órgão emissor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SSP">SSP</SelectItem>
                                  <SelectItem value="DETRAN">DETRAN</SelectItem>
                                  <SelectItem value="MAER">MAER</SelectItem>
                                  <SelectItem value="MEX">MEX</SelectItem>
                                  <SelectItem value="MMA">MMA</SelectItem>
                                  <SelectItem value="OUTROS">OUTROS</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="uf_emissao_rg"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>UF</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="UF" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="AC">AC</SelectItem>
                                  <SelectItem value="AL">AL</SelectItem>
                                  <SelectItem value="AP">AP</SelectItem>
                                  <SelectItem value="AM">AM</SelectItem>
                                  <SelectItem value="BA">BA</SelectItem>
                                  <SelectItem value="CE">CE</SelectItem>
                                  <SelectItem value="DF">DF</SelectItem>
                                  <SelectItem value="ES">ES</SelectItem>
                                  <SelectItem value="GO">GO</SelectItem>
                                  <SelectItem value="MA">MA</SelectItem>
                                  <SelectItem value="MT">MT</SelectItem>
                                  <SelectItem value="MS">MS</SelectItem>
                                  <SelectItem value="MG">MG</SelectItem>
                                  <SelectItem value="PA">PA</SelectItem>
                                  <SelectItem value="PB">PB</SelectItem>
                                  <SelectItem value="PR">PR</SelectItem>
                                  <SelectItem value="PE">PE</SelectItem>
                                  <SelectItem value="PI">PI</SelectItem>
                                  <SelectItem value="RJ">RJ</SelectItem>
                                  <SelectItem value="RN">RN</SelectItem>
                                  <SelectItem value="RS">RS</SelectItem>
                                  <SelectItem value="RO">RO</SelectItem>
                                  <SelectItem value="RR">RR</SelectItem>
                                  <SelectItem value="SC">SC</SelectItem>
                                  <SelectItem value="SP">SP</SelectItem>
                                  <SelectItem value="SE">SE</SelectItem>
                                  <SelectItem value="TO">TO</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="passaporte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passaporte</FormLabel>
                          <FormControl>
                            <Input placeholder="Número do passaporte" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Certidão Civil</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="certidao_nascimento"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Certidão de Nascimento (novo formato)</FormLabel>
                          <FormControl>
                            <Input placeholder="0000000000000000000000000000000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="termo_certidao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Termo</FormLabel>
                            <FormControl>
                              <Input placeholder="Termo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="livro_certidao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Livro</FormLabel>
                            <FormControl>
                              <Input placeholder="Livro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="folha_certidao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Folha</FormLabel>
                            <FormControl>
                              <Input placeholder="Folha" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="data_emissao_certidao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de emissão</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="uf_emissao_certidao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF emissão</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AC">AC</SelectItem>
                              <SelectItem value="AL">AL</SelectItem>
                              <SelectItem value="AP">AP</SelectItem>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="BA">BA</SelectItem>
                              <SelectItem value="CE">CE</SelectItem>
                              <SelectItem value="DF">DF</SelectItem>
                              <SelectItem value="ES">ES</SelectItem>
                              <SelectItem value="GO">GO</SelectItem>
                              <SelectItem value="MA">MA</SelectItem>
                              <SelectItem value="MT">MT</SelectItem>
                              <SelectItem value="MS">MS</SelectItem>
                              <SelectItem value="MG">MG</SelectItem>
                              <SelectItem value="PA">PA</SelectItem>
                              <SelectItem value="PB">PB</SelectItem>
                              <SelectItem value="PR">PR</SelectItem>
                              <SelectItem value="PE">PE</SelectItem>
                              <SelectItem value="PI">PI</SelectItem>
                              <SelectItem value="RJ">RJ</SelectItem>
                              <SelectItem value="RN">RN</SelectItem>
                              <SelectItem value="RS">RS</SelectItem>
                              <SelectItem value="RO">RO</SelectItem>
                              <SelectItem value="RR">RR</SelectItem>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="SP">SP</SelectItem>
                              <SelectItem value="SE">SE</SelectItem>
                              <SelectItem value="TO">TO</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cartorio_emissao_certidao"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Cartório de emissão</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Nome do cartório" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Anexar Documentos</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Documentos pessoais</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" id="documento" />
                        <Button type="button" variant="outline" size="icon">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        São aceitos arquivos nos formatos jpg, png, pdf e gif. Tamanho máximo: 2MB
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Laudo médico</Label>
                      <div className="flex items-center gap-2">
                        <Input type="file" id="laudo_medico" />
                        <Button type="button" variant="outline" size="icon">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        São aceitos arquivos nos formatos jpg, png, pdf e gif. Tamanho máximo: 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="endereco" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Endereço Residencial</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logradouro"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Logradouro</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, Avenida, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Apartamento, bloco, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AC">Acre</SelectItem>
                              <SelectItem value="AL">Alagoas</SelectItem>
                              <SelectItem value="AP">Amapá</SelectItem>
                              <SelectItem value="AM">Amazonas</SelectItem>
                              <SelectItem value="BA">Bahia</SelectItem>
                              <SelectItem value="CE">Ceará</SelectItem>
                              <SelectItem value="DF">Distrito Federal</SelectItem>
                              <SelectItem value="ES">Espírito Santo</SelectItem>
                              <SelectItem value="GO">Goiás</SelectItem>
                              <SelectItem value="MA">Maranhão</SelectItem>
                              <SelectItem value="MT">Mato Grosso</SelectItem>
                              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                              <SelectItem value="MG">Minas Gerais</SelectItem>
                              <SelectItem value="PA">Pará</SelectItem>
                              <SelectItem value="PB">Paraíba</SelectItem>
                              <SelectItem value="PR">Paraná</SelectItem>
                              <SelectItem value="PE">Pernambuco</SelectItem>
                              <SelectItem value="PI">Piauí</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                              <SelectItem value="RO">Rondônia</SelectItem>
                              <SelectItem value="RR">Roraima</SelectItem>
                              <SelectItem value="SC">Santa Catarina</SelectItem>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="SE">Sergipe</SelectItem>
                              <SelectItem value="TO">Tocantins</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zona_localizacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zona de localização</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Urbana</SelectItem>
                              <SelectItem value="2">Rural</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filiação */}
          <TabsContent value="filiacao" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Filiação</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome_pai"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome do pai</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo do pai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf_pai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF do pai</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 h-px bg-border my-2"></div>

                    <FormField
                      control={form.control}
                      name="nome_mae"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome da mãe</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo da mãe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf_mae"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF da mãe</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Responsável</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo_responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de responsável</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pai">Pai</SelectItem>
                              <SelectItem value="mae">Mãe</SelectItem>
                              <SelectItem value="outro">Outro responsável</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nome_responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do responsável</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo do responsável" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf_responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF do responsável</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentesco_responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parentesco</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Avô, Tio, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pessoas autorizadas a buscar o aluno</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="autorizado_um"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nome autorizado 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentesco_um"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="autorizado_dois"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nome autorizado 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentesco_dois"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="autorizado_tres"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nome autorizado 3</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentesco_tres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="autorizado_quatro"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nome autorizado 4</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentesco_quatro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="autorizado_cinco"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nome autorizado 5</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentesco_cinco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saúde */}
          <TabsContent value="saude" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações de Saúde</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="grupo_sanguineo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grupo sanguíneo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fator_rh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fator RH</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+">Positivo (+)</SelectItem>
                              <SelectItem value="-">Negativo (-)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número da Carteira do SUS</FormLabel>
                          <FormControl>
                            <Input placeholder="000 0000 0000 0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="alergia_medicamento"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é alérgico a algum medicamento?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("alergia_medicamento") && (
                      <FormField
                        control={form.control}
                        name="desc_alergia_medicamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quais medicamentos?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva os medicamentos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="alergia_alimento"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é alérgico a algum alimento?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("alergia_alimento") && (
                      <FormField
                        control={form.control}
                        name="desc_alergia_alimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quais alimentos?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva os alimentos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="doenca_congenita"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno possui doença congênita?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("doenca_congenita") && (
                      <FormField
                        control={form.control}
                        name="desc_doenca_congenita"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quais doenças?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva as doenças" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Histórico de Doenças</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="doenca_caxumba"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu caxumba?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_sarampo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu sarampo?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_rubeola"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu rubéola?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_catapora"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu catapora?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_escarlatina"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu escarlatina?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_coqueluche"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Já contraiu coqueluche?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doenca_outras"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Outras doenças que o aluno já contraiu</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva outras doenças" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Condições de Saúde</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="epiletico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é epilético?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("epiletico") && (
                      <FormField
                        control={form.control}
                        name="epiletico_tratamento"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Está em tratamento?</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="hemofilico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é hemofílico?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hipertenso"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno tem hipertensão?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="asmatico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é asmático?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diabetico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno é diabético?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("diabetico") && (
                      <FormField
                        control={form.control}
                        name="insulina"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Depende de insulina?</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tratamentos e Restrições</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tratamento_medico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno faz algum tratamento médico?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("tratamento_medico") && (
                      <FormField
                        control={form.control}
                        name="desc_tratamento_medico"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual tratamento?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva o tratamento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="medicacao_especifica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno está ingerindo medicação específica?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("medicacao_especifica") && (
                      <FormField
                        control={form.control}
                        name="desc_medicacao_especifica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual medicação?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva a medicação" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="acomp_medico_psicologico"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno tem acompanhamento médico ou psicológico?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("acomp_medico_psicologico") && (
                      <FormField
                        control={form.control}
                        name="desc_acomp_medico_psicologico"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva o motivo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="restricao_atividade_fisica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno tem restrição a alguma atividade física?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("restricao_atividade_fisica") && (
                      <FormField
                        control={form.control}
                        name="desc_restricao_atividade_fisica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual restrição?</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva a restrição" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emergência</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="plano_saude"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>O aluno possui algum plano de saúde?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("plano_saude") && (
                      <FormField
                        control={form.control}
                        name="desc_plano_saude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual plano?</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do plano de saúde" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="aceita_hospital_proximo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Em caso de emergência, autorizo levar meu(minha) filho(a) para o Hospital ou Clínica mais
                              próximos
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("aceita_hospital_proximo") && (
                      <FormField
                        control={form.control}
                        name="desc_aceita_hospital_proximo"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Responsável pela autorização</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-2 pt-4">
                    <h4 className="font-medium">
                      Em caso de emergência, caso não seja encontrado pais ou responsáveis, avisar:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="responsavel_emergencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsavel_emergencia_parentesco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parentesco</FormLabel>
                            <FormControl>
                              <Input placeholder="Parentesco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsavel_emergencia_telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsavel_emergencia_celular"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transporte */}
          <TabsContent value="transporte" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Transporte Escolar</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo_transporte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de transporte</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nenhum">Não utiliza</SelectItem>
                              <SelectItem value="municipal">Municipal</SelectItem>
                              <SelectItem value="estadual">Estadual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utiliza_transporte_rural"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Utiliza transporte rural</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="veiculo_transporte"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Veículo utilizado</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_1"
                                checked={field.value?.includes("1")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "1"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "1") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_1">Ônibus</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_2"
                                checked={field.value?.includes("2")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "2"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "2") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_2">Micro-ônibus</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_3"
                                checked={field.value?.includes("3")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "3"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "3") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_3">Van</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_4"
                                checked={field.value?.includes("4")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "4"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "4") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_4">Kombi</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_5"
                                checked={field.value?.includes("5")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "5"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "5") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_5">Bicicleta</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_6"
                                checked={field.value?.includes("6")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "6"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "6") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_6">Tração animal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_7"
                                checked={field.value?.includes("7")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "7"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "7") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_7">Embarcação</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="veiculo_8"
                                checked={field.value?.includes("8")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), "8"])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== "8") || [])
                                  }
                                }}
                              />
                              <Label htmlFor="veiculo_8">Outro</Label>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rota_transporte"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Rota</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva a rota de transporte" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Socioeconômico */}
          <TabsContent value="socioeconomico" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Moradia</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="moradia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de moradia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">Apartamento</SelectItem>
                              <SelectItem value="C">Casa</SelectItem>
                              <SelectItem value="O">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">Alvenaria</SelectItem>
                              <SelectItem value="M">Madeira</SelectItem>
                              <SelectItem value="I">Mista</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("moradia") === "O" && (
                      <FormField
                        control={form.control}
                        name="casa_outra"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descreva</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva o tipo de moradia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="moradia_situacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situação</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Alugado</SelectItem>
                              <SelectItem value="2">Próprio</SelectItem>
                              <SelectItem value="3">Cedido</SelectItem>
                              <SelectItem value="4">Financiado</SelectItem>
                              <SelectItem value="5">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <FormField
                      control={form.control}
                      name="quartos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartos</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sala"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salas</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="copa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copas</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="banheiro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banheiros</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="garagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Garagens</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bens e Recursos</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="empregada_domestica"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Empregada doméstica</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="automovel"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Automóvel</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motocicleta"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Motocicleta</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="geladeira"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Geladeira</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fogao"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Fogão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maquina_lavar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Máquina de lavar</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="microondas"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Microondas</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="video_dvd"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Vídeo/DVD</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="televisao"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Televisão</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Telefone</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="recursos_tecnologicos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recursos tecnológicos</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="internet"
                              checked={field.value?.includes("Internet")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "Internet"])
                                } else {
                                  field.onChange(field.value?.filter((value) => value !== "Internet") || [])
                                }
                              }}
                            />
                            <Label htmlFor="internet">Internet</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="computador"
                              checked={field.value?.includes("Computador")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "Computador"])
                                } else {
                                  field.onChange(field.value?.filter((value) => value !== "Computador") || [])
                                }
                              }}
                            />
                            <Label htmlFor="computador">Computador</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="smartphone"
                              checked={field.value?.includes("Smartphone")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "Smartphone"])
                                } else {
                                  field.onChange(field.value?.filter((value) => value !== "Smartphone") || [])
                                }
                              }}
                            />
                            <Label htmlFor="smartphone">Smartphone</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="whatsapp"
                              checked={field.value?.includes("WhatsApp")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "WhatsApp"])
                                } else {
                                  field.onChange(field.value?.filter((value) => value !== "WhatsApp") || [])
                                }
                              }}
                            />
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="nenhum"
                              checked={field.value?.includes("Nenhum")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange(["Nenhum"])
                                } else {
                                  field.onChange(field.value?.filter((value) => value !== "Nenhum") || [])
                                }
                              }}
                            />
                            <Label htmlFor="nenhum">Nenhum</Label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Infraestrutura</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="agua_encanada"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Água encanada</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poco"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Poço</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="energia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Energia elétrica</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="esgoto"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Esgoto</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fossa"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Fossa</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lixo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Coleta de lixo</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quant_pessoas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de pessoas residentes no lar</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="renda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Renda familiar em R$</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="0,00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outros */}
          <TabsContent value="outros" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Observações</h3>

                  <FormField
                    control={form.control}
                    name="observacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações sobre o aluno</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações adicionais relevantes sobre o aluno"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/students")} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface SchoolFormProps {
  schoolId?: string
  initialData?: any
}

export function SchoolForm({ schoolId, initialData }: SchoolFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!schoolId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Escola atualizada" : "Escola cadastrada",
        description: isEditing
          ? "As informações da escola foram atualizadas com sucesso."
          : "A escola foi cadastrada com sucesso no sistema.",
      })

      router.push(isEditing ? `/schools/${schoolId}` : "/schools")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Dados básicos da instituição de ensino.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Escola</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo da instituição"
                    defaultValue={initialData?.name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código INEP</Label>
                  <Input
                    id="code"
                    placeholder="Código INEP da escola"
                    defaultValue={initialData?.code || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Escola</Label>
                  <Select defaultValue={initialData?.type || "public"}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Pública</SelectItem>
                      <SelectItem value="private">Privada</SelectItem>
                      <SelectItem value="mixed">Mista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Níveis de Ensino</Label>
                  <Select defaultValue={initialData?.level || "elementary"}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Selecione os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindergarten">Educação Infantil</SelectItem>
                      <SelectItem value="elementary">Ensino Fundamental</SelectItem>
                      <SelectItem value="highschool">Ensino Médio</SelectItem>
                      <SelectItem value="all">Todos os Níveis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Breve descrição sobre a escola"
                  rows={4}
                  defaultValue={initialData?.description || ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Localização física da instituição.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipcode">CEP</Label>
                  <Input id="zipcode" placeholder="00000-000" defaultValue={initialData?.zipcode || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select defaultValue={initialData?.state || ""}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="Nome da cidade" defaultValue={initialData?.city || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Nome do bairro"
                    defaultValue={initialData?.neighborhood || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Logradouro</Label>
                <Input id="street" placeholder="Rua, Avenida, etc." defaultValue={initialData?.street || ""} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="Número" defaultValue={initialData?.number || ""} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" placeholder="Complemento" defaultValue={initialData?.complement || ""} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
              <CardDescription>Informações de contato da instituição.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@escola.edu.br"
                    defaultValue={initialData?.email || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 0000-0000" defaultValue={initialData?.phone || ""} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://www.escola.edu.br"
                    defaultValue={initialData?.website || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal">Diretor(a)</Label>
                  <Input id="principal" placeholder="Nome do diretor" defaultValue={initialData?.principal || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNotes">Observações de Contato</Label>
                <Textarea
                  id="contactNotes"
                  placeholder="Informações adicionais de contato"
                  rows={4}
                  defaultValue={initialData?.contactNotes || ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Configurações gerais da instituição no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Determina se a escola está ativa no sistema e pode ser utilizada.
                  </p>
                </div>
                <Switch id="active" defaultChecked={initialData?.active !== false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enrollmentOpen">Matrículas Abertas</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que novas matrículas sejam realizadas para esta escola.
                  </p>
                </div>
                <Switch id="enrollmentOpen" defaultChecked={initialData?.enrollmentOpen || false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Destacada</Label>
                  <p className="text-sm text-muted-foreground">
                    Destaca esta escola em listagens e na página inicial do sistema.
                  </p>
                </div>
                <Switch id="featured" defaultChecked={initialData?.featured || false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push(isEditing ? `/schools/${schoolId}` : "/schools")}
          disabled={isSubmitting}
          type="button"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : isEditing ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </form>
  )
}

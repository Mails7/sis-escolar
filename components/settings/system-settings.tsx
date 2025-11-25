"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export function SystemSettings() {
  const [schoolName, setSchoolName] = useState("Educar")
  const [language, setLanguage] = useState("pt-BR")
  const [theme, setTheme] = useState("system")
  const [demoMode, setDemoMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const handleSaveGeneral = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações gerais foram salvas com sucesso.",
    })
  }

  const handleSaveAppearance = () => {
    toast({
      title: "Aparência atualizada",
      description: "As configurações de aparência foram atualizadas com sucesso.",
    })
  }

  const handleSaveAdvanced = () => {
    toast({
      title: "Configurações avançadas salvas",
      description: "As configurações avançadas foram salvas com sucesso.",
    })
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="appearance">Aparência</TabsTrigger>
        <TabsTrigger value="advanced">Avançado</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>Configure as informações básicas do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school-name">Nome da Instituição</Label>
              <Input
                id="school-name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Nome da sua instituição"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGeneral}>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure as notificações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Ativar Notificações</Label>
                <p className="text-sm text-muted-foreground">Receba notificações sobre eventos importantes</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receba notificações por e-mail</p>
              </div>
              <Switch id="email-notifications" checked={false} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGeneral}>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema do Sistema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAppearance}>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalização</CardTitle>
            <CardDescription>Personalize a interface do usuário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Compacto</Label>
                <p className="text-sm text-muted-foreground">Reduz o espaçamento entre elementos</p>
              </div>
              <Switch checked={false} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">Ativa animações na interface</p>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAppearance}>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>Configure opções avançadas do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="demo-mode">Modo de Demonstração</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa o modo de demonstração quando o banco de dados não está disponível
                </p>
              </div>
              <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Salvamento Automático</Label>
                <p className="text-sm text-muted-foreground">Salva automaticamente as alterações nos formulários</p>
              </div>
              <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAdvanced}>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cache e Armazenamento</CardTitle>
            <CardDescription>Gerencie o cache e o armazenamento do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Limpar Cache</Label>
              <p className="text-sm text-muted-foreground">Limpa o cache do sistema para liberar espaço</p>
            </div>
            <Button variant="outline" className="w-full">
              Limpar Cache
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

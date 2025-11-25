import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseSettings } from "@/components/settings/database-settings"
import { EnvironmentSettings } from "@/components/settings/environment-settings"
import { SystemSettings } from "@/components/settings/system-settings"
import { UserSettings } from "@/components/settings/user-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"

export const metadata: Metadata = {
  title: "Configurações | Educar",
  description: "Configurações do sistema Educar",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema Educar</p>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="environment">Ambiente</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="user">Usuário</TabsTrigger>
          <TabsTrigger value="integration">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Banco de Dados</CardTitle>
              <CardDescription>
                Gerencie as configurações de conexão com o banco de dados e estrutura das tabelas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Ambiente</CardTitle>
              <CardDescription>
                Gerencie as variáveis de ambiente necessárias para o funcionamento do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnvironmentSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Personalize as configurações gerais do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Usuário</CardTitle>
              <CardDescription>Gerencie seu perfil de usuário e outros usuários do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Integrações</CardTitle>
              <CardDescription>Configure integrações com outros sistemas e serviços.</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

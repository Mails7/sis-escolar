import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon, PencilIcon } from "lucide-react"
import { ServerProfile } from "@/components/servers/server-profile"
import { ServerPermissions } from "@/components/servers/server-permissions"
import { ServerSchools } from "@/components/servers/server-schools"
import { ServerHistory } from "@/components/servers/server-history"

export default function ServerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <HomeIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/servers">Servidores</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/servers/${params.id}`}>Detalhes do Servidor</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Servidor</h1>
          <p className="text-muted-foreground">Visualize e gerencie as informações do servidor</p>
        </div>
        <Button className="sm:w-auto w-full" size="sm" asChild>
          <a href={`/servers/${params.id}/edit`}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar Servidor
          </a>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="schools">Escolas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ServerProfile id={params.id} />
        </TabsContent>
        <TabsContent value="permissions" className="space-y-4">
          <ServerPermissions id={params.id} />
        </TabsContent>
        <TabsContent value="schools" className="space-y-4">
          <ServerSchools id={params.id} />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <ServerHistory id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

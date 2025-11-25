import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"

interface ServerPermissionsProps {
  id: string
}

export function ServerPermissions({ id }: ServerPermissionsProps) {
  // Em uma aplicação real, você buscaria esses dados do servidor com base no ID
  const permissions = [
    {
      module: "Alunos",
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    {
      module: "Professores",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Turmas",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Matrículas",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Notas",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Frequência",
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    {
      module: "Relatórios",
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    {
      module: "Configurações",
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Permissões do Sistema</CardTitle>
          <Button size="sm">
            <SaveIcon className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Módulo</TableHead>
                <TableHead className="text-center">Visualizar</TableHead>
                <TableHead className="text-center">Criar</TableHead>
                <TableHead className="text-center">Editar</TableHead>
                <TableHead className="text-center">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.module}>
                  <TableCell className="font-medium">{permission.module}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch checked={permission.view} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch checked={permission.create} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch checked={permission.edit} />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch checked={permission.delete} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Usuário</p>
              <Badge className="mt-1">Administrador</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível de Acesso</p>
              <Badge className="mt-1">Completo</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Último Acesso</p>
              <p>15/04/2023 às 14:32</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status da Conta</p>
              <Badge variant="default" className="mt-1">
                Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

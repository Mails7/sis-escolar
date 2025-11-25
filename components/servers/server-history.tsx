import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ServerHistoryProps {
  id: string
}

export function ServerHistory({ id }: ServerHistoryProps) {
  // Em uma aplicação real, você buscaria esses dados do servidor com base no ID
  const history = [
    {
      id: 1,
      date: "2023-04-15T14:32:00",
      action: "Login",
      description: "Login no sistema",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      date: "2023-04-15T10:15:00",
      action: "Alteração de Dados",
      description: "Atualização de informações pessoais",
      ip: "192.168.1.100",
    },
    {
      id: 3,
      date: "2023-04-10T09:45:00",
      action: "Alteração de Permissões",
      description: "Adicionada permissão para módulo de Relatórios",
      ip: "192.168.1.100",
    },
    {
      id: 4,
      date: "2023-03-22T16:20:00",
      action: "Vínculo Escolar",
      description: "Adicionado vínculo com Escola Municipal Pedro Álvares",
      ip: "192.168.1.100",
    },
    {
      id: 5,
      date: "2023-03-15T11:05:00",
      action: "Login",
      description: "Login no sistema",
      ip: "192.168.1.100",
    },
    {
      id: 6,
      date: "2023-02-28T14:30:00",
      action: "Alteração de Função",
      description: "Alteração de função para Professor",
      ip: "192.168.1.100",
    },
    {
      id: 7,
      date: "2023-02-10T09:15:00",
      action: "Cadastro",
      description: "Cadastro inicial no sistema",
      ip: "192.168.1.100",
    },
  ]

  const activityTypes = [
    {
      type: "Login",
      count: 10,
      lastDate: "2023-04-15",
    },
    {
      type: "Alteração de Dados",
      count: 5,
      lastDate: "2023-04-15",
    },
    {
      type: "Alteração de Permissões",
      count: 2,
      lastDate: "2023-04-10",
    },
    {
      type: "Vínculo Escolar",
      count: 3,
      lastDate: "2023-03-22",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.action === "Login"
                          ? "default"
                          : item.action === "Alteração de Dados"
                            ? "outline"
                            : item.action === "Alteração de Permissões"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {item.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activityTypes.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">Última: {activity.lastDate}</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {activity.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

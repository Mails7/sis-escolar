import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ServerProfileProps {
  id: string
}

export function ServerProfile({ id }: ServerProfileProps) {
  // Em uma aplicação real, você buscaria esses dados do servidor com base no ID
  const server = {
    id: "SRV001",
    name: "Carlos Eduardo Silva",
    image: "/placeholder.svg?height=128&width=128",
    initials: "CS",
    email: "carlos.silva@educacao.gov.br",
    phone: "(11) 3456-7890",
    cellphone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    birthDate: "1985-05-15",
    gender: "Masculino",
    registration: "12345",
    internalRegistration: "INT001",
    sector: "Secretaria de Educação",
    role: "Professor",
    admissionDate: "2010-03-01",
    status: "Ativo",
    userType: "Administrador",
    accessLevel: "Completo",
    address: {
      street: "Avenida Paulista",
      number: "1000",
      complement: "Apto 123",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={server.image || "/placeholder.svg"} alt={server.name} />
            <AvatarFallback>{server.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{server.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{server.status}</Badge>
              <span className="text-sm text-muted-foreground">ID: {server.id}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p>{server.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
              <p>{new Date(server.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gênero</p>
              <p>{server.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p>{server.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">RG</p>
              <p>{server.rg}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{server.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p>{server.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Celular</p>
              <p>{server.cellphone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Funcionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Matrícula</p>
              <p>{server.registration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Matrícula Interna</p>
              <p>{server.internalRegistration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Admissão</p>
              <p>{new Date(server.admissionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Setor</p>
              <p>{server.sector}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Função</p>
              <p>{server.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{server.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Usuário</p>
              <p>{server.userType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível de Acesso</p>
              <p>{server.accessLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CEP</p>
              <p>{server.address.zipCode}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
              <p>
                {server.address.street}, {server.address.number}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Complemento</p>
              <p>{server.address.complement || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bairro</p>
              <p>{server.address.neighborhood}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cidade/UF</p>
              <p>
                {server.address.city} - {server.address.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

# Sistema de Gestão Escolar SEMEC

Sistema completo de gestão escolar desenvolvido com Next.js 15 e PostgreSQL.

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js Server Actions
- **Banco de Dados**: PostgreSQL
- **UI**: shadcn/ui, Tailwind CSS
- **Autenticação**: Supabase Auth (legado, migrar para NextAuth)

## 📋 Funcionalidades

- ✅ Gestão de Escolas
- ✅ Gestão de Professores
- ✅ Gestão de Alunos
- ✅ Gestão de Turmas
- ✅ Gestão de Matrículas
- ✅ Diário de Classe
- ✅ Dashboard com estatísticas
- 🔄 Relatórios (em desenvolvimento)

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/Mails7/sis-escolar.git
cd sis-escolar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Edite o arquivo `lib/db-config.ts` com suas credenciais do PostgreSQL:

```typescript
export const dbConfig = {
  user: "seu_usuario",
  password: "sua_senha",
  database: "nome_do_banco",
  production: {
    host: "seu_host",
    port: 5432,
    connectionString: "postgres://usuario:senha@host:porta/banco?sslmode=disable",
  },
  development: {
    host: "localhost",
    port: 5432,
    connectionString: "postgres://usuario:senha@localhost:5432/banco?sslmode=disable",
  },
}
```

4. Inicialize o banco de dados:
```bash
npx tsx scripts/init-database.ts
```

Este script irá:
- Criar todas as tabelas necessárias
- Popular o banco com dados de exemplo (2 escolas, 4 professores, 3 turmas, 5 alunos)

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
├── app/                    # Páginas e rotas do Next.js
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   └── ...                # Páginas (teachers, students, classes, etc.)
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── ...               # Componentes específicos
├── lib/                   # Utilitários e configurações
│   ├── db.ts             # Pool de conexões PostgreSQL
│   ├── db-config.ts      # Configurações do banco
│   ├── postgres.ts       # Funções de query
│   └── init-db.ts        # Script de inicialização
└── scripts/              # Scripts utilitários
    └── init-database.ts  # Inicialização do banco
```

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

- **schools**: Escolas cadastradas
- **teachers**: Professores
- **students**: Alunos
- **classes**: Turmas
- **enrollments**: Matrículas (relaciona alunos com turmas)
- **class_diary**: Diário de classe (frequência, conteúdo, atividades)

## 🔧 Configuração para Produção

### Deploy na VPS

1. Clone o repositório na VPS:
```bash
git clone https://github.com/Mails7/sis-escolar.git
cd sis-escolar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as credenciais do PostgreSQL em `lib/db-config.ts`

4. Inicialize o banco de dados:
```bash
npx tsx scripts/init-database.ts
```

5. Build da aplicação:
```bash
npm run build
```

6. Inicie a aplicação:
```bash
npm start
```

### Variáveis de Ambiente Recomendadas

Crie um arquivo `.env.local` (não commitado):

```env
NODE_ENV=production
DATABASE_URL=postgres://usuario:senha@host:porta/banco?sslmode=disable
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npx tsx scripts/init-database.ts` - Inicializa o banco de dados

## 🐛 Problemas Conhecidos

### Timeout de Conexão

Se você encontrar erros de timeout ao acessar as páginas, ajuste as configurações do pool em `lib/db.ts`:

```typescript
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- **SEMEC** - Sistema de Gestão Escolar

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

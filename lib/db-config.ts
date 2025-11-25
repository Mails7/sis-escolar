// Configurações do banco de dados PostgreSQL
export const dbConfig = {
  user: "postgres",
  password: "postgres",
  database: "postgres",
  // Configuração para ambiente de produção (externo)
  production: {
    host: "157.180.78.134",
    port: 5435,
    connectionString: "postgres://postgres:postgres@157.180.78.134:5435/postgres?sslmode=disable",
  },
  // Configuração para ambiente de desenvolvimento (interno)
  development: {
    host: "157.180.78.134",
    port: 5435,
    connectionString: "postgres://postgres:postgres@157.180.78.134:5435/postgres?sslmode=disable",
  },
}

// Obter a string de conexão com base no ambiente
export const getConnectionString = () => {
  const isProduction = process.env.NODE_ENV === "production"
  return isProduction ? dbConfig.production.connectionString : dbConfig.development.connectionString
}

// String de conexão para uso direto
export const connectionString = getConnectionString()


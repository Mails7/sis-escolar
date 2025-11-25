import { Pool } from "pg"
import { dbConfig, getConnectionString } from "./db-config"

// Configuração do pool de conexões
const connectionString = getConnectionString()

// Configuração SSL baseada no ambiente
// Em produção (Render, Vercel, etc) geralmente precisa de SSL
// Em desenvolvimento local, geralmente não
const isProduction = process.env.NODE_ENV === "production"

const poolConfig = {
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20, // Número máximo de clientes no pool
  idleTimeoutMillis: 30000, // Tempo que um cliente pode ficar ocioso antes de ser fechado
  connectionTimeoutMillis: 2000, // Tempo máximo para aguardar uma conexão
}

// Criar o pool
const pool = new Pool(poolConfig)

// Listeners de eventos do pool
pool.on("connect", () => {
  // console.log("Nova conexão criada com o banco de dados")
})

pool.on("error", (err) => {
  console.error("Erro inesperado no cliente inativo", err)
  // Não sair do processo, apenas logar
})

/**
 * Executa uma query no banco de dados
 * @param text A query SQL
 * @param params Os parâmetros da query
 * @returns O resultado da query
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    // console.log("Query executada", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Erro ao executar query", { text, error })
    throw error
  }
}

/**
 * Obtém um cliente do pool para transações
 * @returns Um cliente do pool
 */
export async function getClient() {
  const client = await pool.connect()
  return client
}

export default pool

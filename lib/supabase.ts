import { createClient } from "@supabase/supabase-js"

// Valores padrão para desenvolvimento local (não use em produção)
const DEFAULT_SUPABASE_URL = "https://tbtlheaptncptysbxvvh.supabase.co"
const DEFAULT_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGxoZWFwdG5jcHR5c2J4dnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NzA5NTAsImV4cCI6MjA2MjA0Njk1MH0.Wc8ee8aQUWOBVgsS3vx65MD9Bqde25ZTRJL-1zflT6M"

// Obtenha as variáveis de ambiente ou use valores padrão
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY

// Crie o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      "X-Client-Info": "educar-app",
    },
  },
})

// Adicione uma função de verificação de saúde
export async function checkSupabaseHealth() {
  try {
    // Tente fazer uma consulta simples
    const { data, error } = await supabase
      .from("students")
      .select("count", { count: "exact", head: true })
      .maybeSingle()

    if (error) {
      // Se houver um erro específico sobre a tabela não existir, isso é diferente de um erro de conexão
      if (error.message.includes("does not exist")) {
        return {
          healthy: true,
          tablesExist: false,
          message: "Conexão estabelecida, mas as tabelas não existem",
        }
      }

      return {
        healthy: false,
        tablesExist: false,
        error: error.message,
        message: "Erro ao conectar ao Supabase",
      }
    }

    return {
      healthy: true,
      tablesExist: true,
      message: "Conexão estabelecida e tabelas existem",
    }
  } catch (err) {
    return {
      healthy: false,
      tablesExist: false,
      error: err instanceof Error ? err.message : "Erro desconhecido",
      message: "Erro ao conectar ao Supabase",
    }
  }
}

// Adicione uma função para verificar as variáveis de ambiente
export function checkEnvironmentVariables() {
  const variables = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    SUPABASE_KEY: process.env.SUPABASE_KEY || null,
  }

  const missing = Object.entries(variables)
    .filter(([_, value]) => value === null)
    .map(([key]) => key)

  return {
    variables,
    missing,
    allDefined: missing.length === 0,
  }
}

"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Valores padrão para desenvolvimento local (não use em produção)
const DEFAULT_SUPABASE_URL = "https://tbtlheaptncptysbxvvh.supabase.co"
const DEFAULT_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGxoZWFwdG5jcHR5c2J4dnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NzA5NTAsImV4cCI6MjA2MjA0Njk1MH0.Wc8ee8aQUWOBVgsS3vx65MD9Bqde25ZTRJL-1zflT6M"

// Obtenha as variáveis de ambiente ou use valores padrão
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error("Variáveis de ambiente do Supabase não estão configuradas corretamente")
}

// Crie o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
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

export async function getStudents() {
  try {
    // Primeiro, verificar se a tabela existe
    const { error: checkError } = await supabase
      .from("students")
      .select("count", { count: "exact", head: true })
      .limit(1)

    // Se a tabela não existir, retornar dados de demonstração
    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Tabela students não existe. Retornando dados de demonstração.")
      return {
        students: [
          {
            id: "demo-1",
            nome: "Ana Silva",
            email: "ana.silva@exemplo.com",
            telefone_celular: "(11) 98765-4321",
            data_nascimento: "2005-03-15",
          },
          {
            id: "demo-2",
            nome: "Pedro Santos",
            email: "pedro.santos@exemplo.com",
            telefone_celular: "(11) 91234-5678",
            data_nascimento: "2006-07-22",
          },
          {
            id: "demo-3",
            nome: "Mariana Oliveira",
            email: "mariana.oliveira@exemplo.com",
            telefone_celular: "(11) 99876-5432",
            data_nascimento: "2005-11-10",
          },
        ],
        demoMode: true,
      }
    }

    // Se a tabela existir, buscar os dados reais
    const { data, error } = await supabase.from("students").select("*").order("nome")

    if (error) throw error

    return { students: data }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function getStudentById(id: string) {
  try {
    // Se o ID começar com "demo-", retornar dados de demonstração
    if (id.startsWith("demo-")) {
      const demoId = id.split("-")[1]
      const demoStudents = [
        {
          id: "demo-1",
          nome: "Ana Silva",
          email: "ana.silva@exemplo.com",
          telefone_celular: "(11) 98765-4321",
          data_nascimento: "2005-03-15",
        },
        {
          id: "demo-2",
          nome: "Pedro Santos",
          email: "pedro.santos@exemplo.com",
          telefone_celular: "(11) 91234-5678",
          data_nascimento: "2006-07-22",
        },
        {
          id: "demo-3",
          nome: "Mariana Oliveira",
          email: "mariana.oliveira@exemplo.com",
          telefone_celular: "(11) 99876-5432",
          data_nascimento: "2005-11-10",
        },
      ]
      const student = demoStudents.find((s) => s.id === id)
      return { student, demoMode: true }
    }

    // Buscar dados reais
    const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

    if (error) throw error

    return { student: data }
  } catch (error) {
    console.error("Error fetching student:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function createStudent(formData: FormData) {
  try {
    // Extrair os dados do formulário
    const nome = formData.get("nome") as string
    const email = (formData.get("email") as string) || null
    const telefone_celular = (formData.get("telefone_celular") as string) || null
    const data_nascimento = formData.get("data_nascimento")
      ? new Date(formData.get("data_nascimento") as string).toISOString()
      : null

    // Verificar se a tabela students existe
    const { error: checkError } = await supabase
      .from("students")
      .select("count", { count: "exact", head: true })
      .limit(1)

    // Se a tabela não existir, retornar uma mensagem amigável
    if (checkError && checkError.message.includes("does not exist")) {
      console.log("Tabela students não existe. Retornando resposta simulada.")
      return {
        success: true,
        message: "Aluno cadastrado com sucesso (modo demonstração)",
        id: "demo-" + Date.now(),
        demoMode: true,
      }
    }

    // Se a tabela existir, inserir os dados
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          nome,
          email,
          telefone_celular,
          data_nascimento,
          // Adicione outros campos conforme necessário
        },
      ])
      .select()

    if (error) throw error

    revalidatePath("/students")
    return {
      success: true,
      message: "Aluno cadastrado com sucesso",
      id: data?.[0]?.id,
    }
  } catch (error) {
    console.error("Erro ao criar aluno:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      needsSetup: error instanceof Error && error.message.includes("does not exist"),
    }
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    // Se for um ID de demonstração, simular atualização
    if (id.startsWith("demo-")) {
      return {
        success: true,
        message: "Aluno atualizado com sucesso (modo demonstração)",
        demoMode: true,
      }
    }

    // Extrair os dados do formulário
    const nome = formData.get("nome") as string
    const email = (formData.get("email") as string) || null
    const telefone_celular = (formData.get("telefone_celular") as string) || null
    const data_nascimento = formData.get("data_nascimento")
      ? new Date(formData.get("data_nascimento") as string).toISOString()
      : null

    // Atualizar os dados
    const { error } = await supabase
      .from("students")
      .update({
        nome,
        email,
        telefone_celular,
        data_nascimento,
        // Adicione outros campos conforme necessário
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath(`/students/${id}`)
    revalidatePath("/students")
    return {
      success: true,
      message: "Aluno atualizado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      needsSetup: error instanceof Error && error.message.includes("does not exist"),
    }
  }
}

export async function deleteStudent(id: string) {
  try {
    // Se for um ID de demonstração, simular exclusão
    if (id.startsWith("demo-")) {
      return {
        success: true,
        message: "Aluno excluído com sucesso (modo demonstração)",
        demoMode: true,
      }
    }

    // Excluir o aluno
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/students")
    return { success: true, message: "Aluno excluído com sucesso" }
  } catch (error) {
    console.error("Error deleting student:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

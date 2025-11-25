"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { dbSchema } from "@/lib/db-schema"

export async function setupAdditionalTables() {
  try {
    // Criar tabela de horários
    const { error: schedulesError } = await supabase.rpc("create_class_schedules_table", {
      sql: dbSchema.class_schedules,
    })

    if (schedulesError) {
      console.error("Error creating class_schedules table:", schedulesError)
      return { success: false, message: "Erro ao criar tabela de horários: " + schedulesError.message }
    }

    // Adicionar dados de exemplo para disciplinas
    const { data: subjects, error: subjectsCheckError } = await supabase.from("subjects").select("id").limit(1)

    if (subjectsCheckError || !subjects || subjects.length === 0) {
      const { error: subjectsError } = await supabase.from("subjects").upsert([
        {
          name: "Matemática",
          workload: 80,
          grade: "Ensino Fundamental",
          description: "Matemática básica para ensino fundamental",
        },
        {
          name: "Português",
          workload: 80,
          grade: "Ensino Fundamental",
          description: "Língua portuguesa para ensino fundamental",
        },
        {
          name: "História",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "História geral e do Brasil",
        },
        {
          name: "Geografia",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "Geografia geral e do Brasil",
        },
        {
          name: "Ciências",
          workload: 60,
          grade: "Ensino Fundamental",
          description: "Ciências naturais",
        },
        {
          name: "Educação Física",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Atividades físicas e esportes",
        },
        {
          name: "Artes",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Artes visuais e música",
        },
        {
          name: "Inglês",
          workload: 40,
          grade: "Ensino Fundamental",
          description: "Língua inglesa básica",
        },
      ])

      if (subjectsError) {
        console.error("Error inserting subjects:", subjectsError)
        return { success: false, message: "Erro ao inserir disciplinas: " + subjectsError.message }
      }
    }

    revalidatePath("/admin/setup-additional-tables")
    revalidatePath("/schedule")

    return { success: true, message: "Tabelas adicionais configuradas com sucesso!" }
  } catch (error) {
    console.error("Error setting up additional tables:", error)
    return { success: false, message: "Erro ao configurar tabelas adicionais." }
  }
}

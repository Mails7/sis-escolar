"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function createScheduleEntry(formData: FormData) {
  try {
    const class_id = formData.get("class_id") as string
    const subject_id = formData.get("subject_id") as string
    const teacher_id = formData.get("teacher_id") as string
    const day_of_week = Number.parseInt(formData.get("day_of_week") as string)
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const room = formData.get("room") as string

    // Validar dados
    if (!class_id || !subject_id || !teacher_id || isNaN(day_of_week) || !start_time || !end_time) {
      return { success: false, message: "Todos os campos obrigatórios devem ser preenchidos." }
    }

    // Verificar se já existe um horário para a mesma turma, dia e horário
    const { data: existingEntries, error: checkError } = await supabase
      .from("class_schedules")
      .select("id")
      .eq("class_id", class_id)
      .eq("day_of_week", day_of_week)
      .lte("start_time", end_time)
      .gte("end_time", start_time)

    if (checkError) {
      console.error("Error checking existing schedule entries:", checkError)
      return { success: false, message: "Erro ao verificar horários existentes." }
    }

    if (existingEntries && existingEntries.length > 0) {
      return {
        success: false,
        message: "Já existe um horário cadastrado para esta turma neste dia e horário.",
      }
    }

    // Inserir novo horário
    const { error } = await supabase.from("class_schedules").insert({
      class_id,
      subject_id,
      teacher_id,
      day_of_week,
      start_time,
      end_time,
      room,
    })

    if (error) {
      console.error("Error creating schedule entry:", error)
      return { success: false, message: "Erro ao criar horário: " + error.message }
    }

    revalidatePath("/schedule")
    return { success: true, message: "Horário criado com sucesso!" }
  } catch (error) {
    console.error("Error creating schedule entry:", error)
    return { success: false, message: "Erro ao criar horário." }
  }
}

export async function updateScheduleEntry(id: string, formData: FormData) {
  try {
    const class_id = formData.get("class_id") as string
    const subject_id = formData.get("subject_id") as string
    const teacher_id = formData.get("teacher_id") as string
    const day_of_week = Number.parseInt(formData.get("day_of_week") as string)
    const start_time = formData.get("start_time") as string
    const end_time = formData.get("end_time") as string
    const room = formData.get("room") as string

    // Validar dados
    if (!class_id || !subject_id || !teacher_id || isNaN(day_of_week) || !start_time || !end_time) {
      return { success: false, message: "Todos os campos obrigatórios devem ser preenchidos." }
    }

    // Verificar se já existe um horário para a mesma turma, dia e horário (excluindo o atual)
    const { data: existingEntries, error: checkError } = await supabase
      .from("class_schedules")
      .select("id")
      .eq("class_id", class_id)
      .eq("day_of_week", day_of_week)
      .lte("start_time", end_time)
      .gte("end_time", start_time)
      .neq("id", id)

    if (checkError) {
      console.error("Error checking existing schedule entries:", checkError)
      return { success: false, message: "Erro ao verificar horários existentes." }
    }

    if (existingEntries && existingEntries.length > 0) {
      return {
        success: false,
        message: "Já existe um horário cadastrado para esta turma neste dia e horário.",
      }
    }

    // Atualizar horário
    const { error } = await supabase
      .from("class_schedules")
      .update({
        class_id,
        subject_id,
        teacher_id,
        day_of_week,
        start_time,
        end_time,
        room,
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating schedule entry:", error)
      return { success: false, message: "Erro ao atualizar horário: " + error.message }
    }

    revalidatePath("/schedule")
    return { success: true, message: "Horário atualizado com sucesso!" }
  } catch (error) {
    console.error("Error updating schedule entry:", error)
    return { success: false, message: "Erro ao atualizar horário." }
  }
}

export async function deleteScheduleEntry(id: string) {
  try {
    const { error } = await supabase.from("class_schedules").delete().eq("id", id)

    if (error) {
      console.error("Error deleting schedule entry:", error)
      return { success: false, message: "Erro ao excluir horário: " + error.message }
    }

    revalidatePath("/schedule")
    return { success: true, message: "Horário excluído com sucesso!" }
  } catch (error) {
    console.error("Error deleting schedule entry:", error)
    return { success: false, message: "Erro ao excluir horário." }
  }
}

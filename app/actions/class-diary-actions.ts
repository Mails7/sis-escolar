"use server"

import { query } from "@/lib/postgres"
import { revalidatePath } from "next/cache"

export async function getStudentsByClassId(classId: string) {
  try {
    // Verificar se a tabela de matrículas existe
    const tableCheck = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enrollments')"
    )

    if (!tableCheck.rows[0].exists) {
      return { error: "Tabela de matrículas não encontrada", students: [] }
    }

    const result = await query(
      `SELECT s.id, s.name 
       FROM students s
       JOIN enrollments e ON s.id = e.student_id
       WHERE e.class_id = $1 AND e.status = 'active'
       ORDER BY s.name`,
      [classId]
    )

    return { students: result.rows.map(row => ({ ...row, present: true })) }
  } catch (error) {
    console.error("Error fetching students:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido", students: [] }
  }
}

export async function getDiaryEntries(classId: string) {
  try {
    const tableCheck = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'class_diary')"
    )

    if (!tableCheck.rows[0].exists) {
      return { error: "Tabela de diário não encontrada", entries: [] }
    }

    const result = await query(
      "SELECT id, date FROM class_diary WHERE class_id = $1 ORDER BY date DESC",
      [classId]
    )

    return { entries: result.rows.map(row => ({ ...row, date: new Date(row.date).toISOString().split('T')[0] })) }
  } catch (error) {
    console.error("Error fetching diary entries:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido", entries: [] }
  }
}

export async function getDiaryEntryByDate(classId: string, date: string) {
  try {
    const result = await query(
      `SELECT id, date, subject, content, activities, homework, observations, attendance 
       FROM class_diary 
       WHERE class_id = $1 AND date = $2`,
      [classId, date]
    )

    if (result.rows.length === 0) {
      return { entry: null }
    }

    const entry = result.rows[0]
    // Parse attendance if it's stored as a string (JSON)
    if (typeof entry.attendance === 'string') {
      try {
        entry.attendance = JSON.parse(entry.attendance)
      } catch (e) {
        console.error("Error parsing attendance JSON:", e)
        entry.attendance = []
      }
    }

    return { entry }
  } catch (error) {
    console.error("Error fetching diary entry:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function saveDiaryEntry(data: any) {
  try {
    const { id, class_id, date, subject, content, activities, homework, observations, attendance } = data

    // Ensure table exists (simple check, ideally handled by migrations)
    await query(`
      CREATE TABLE IF NOT EXISTS class_diary (
        id SERIAL PRIMARY KEY,
        class_id INTEGER,
        date DATE NOT NULL,
        subject TEXT,
        content TEXT,
        activities TEXT,
        homework TEXT,
        observations TEXT,
        attendance JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(class_id, date)
      );
    `)

    if (id) {
      // Update
      await query(
        `UPDATE class_diary 
         SET subject = $1, content = $2, activities = $3, homework = $4, observations = $5, attendance = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7`,
        [subject, content, activities, homework, observations, JSON.stringify(attendance), id]
      )
    } else {
      // Insert
      const result = await query(
        `INSERT INTO class_diary 
         (class_id, date, subject, content, activities, homework, observations, attendance) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [class_id, date, subject, content, activities, homework, observations, JSON.stringify(attendance)]
      )
      data.id = result.rows[0].id
    }

    revalidatePath(`/classes/${class_id}/diary`)
    return { success: true, id: data.id }
  } catch (error) {
    console.error("Error saving diary entry:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

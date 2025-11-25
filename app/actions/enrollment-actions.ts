"use server"

import { query } from "@/lib/postgres"
import { revalidatePath } from "next/cache"

export async function getEnrollments() {
  try {
    const result = await query(`
      SELECT e.*, s.name as student_name, c.name as class_name 
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN classes c ON e.class_id = c.id
      ORDER BY e.enrollment_date DESC
    `)
    return { enrollments: result.rows }
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function getEnrollmentById(id: string) {
  try {
    const result = await query(
      `
      SELECT 
        e.*,
        s.id as student_id_joined,
        s.name as student_name,
        s.registration_code,
        s.birth_date,
        c.id as class_id_joined,
        c.name as class_name,
        c.grade,
        c.shift
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN classes c ON e.class_id = c.id
      WHERE e.id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) {
      return { error: "Matrícula não encontrada" }
    }

    const row = result.rows[0]
    const enrollment = {
      id: row.id,
      student_id: row.student_id,
      class_id: row.class_id,
      school_year: row.school_year,
      enrollment_date: row.enrollment_date,
      enrollment_number: row.enrollment_number || row.id.substring(0, 8).toUpperCase(),
      status: row.status,
      student: {
        id: row.student_id_joined,
        name: row.student_name,
        registration_code: row.registration_code,
        birth_date: row.birth_date
      },
      class: {
        id: row.class_id_joined,
        name: row.class_name,
        grade: row.grade,
        shift: row.shift
      }
    }

    return { enrollment }
  } catch (error) {
    console.error("Error fetching enrollment:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function createEnrollment(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string
    const classId = formData.get("classId") as string
    const schoolYear = formData.get("schoolYear") as string
    const enrollmentDate = formData.get("enrollmentDate") as string
    const enrollmentNumber = formData.get("enrollmentNumber") as string
    const status = formData.get("status") as string
    const notes = formData.get("notes") as string

    const result = await query(
      `INSERT INTO enrollments 
       (student_id, class_id, school_year, enrollment_date, enrollment_number, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [studentId, classId, schoolYear, enrollmentDate, enrollmentNumber, status, notes],
    )

    revalidatePath("/enrollments")
    return { success: true, id: result.rows[0].id }
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function updateEnrollment(id: string, formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string
    const classId = formData.get("classId") as string
    const schoolYear = formData.get("schoolYear") as string
    const enrollmentDate = formData.get("enrollmentDate") as string
    const enrollmentNumber = formData.get("enrollmentNumber") as string
    const status = formData.get("status") as string
    const notes = formData.get("notes") as string

    await query(
      `UPDATE enrollments 
       SET student_id = $1, class_id = $2, school_year = $3, enrollment_date = $4, 
           enrollment_number = $5, status = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [studentId, classId, schoolYear, enrollmentDate, enrollmentNumber, status, notes, id],
    )

    revalidatePath(`/enrollments/${id}`)
    revalidatePath("/enrollments")
    return { success: true }
  } catch (error) {
    console.error("Error updating enrollment:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function deleteEnrollment(id: string) {
  try {
    await query("DELETE FROM enrollments WHERE id = $1", [id])
    revalidatePath("/enrollments")
    return { success: true }
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

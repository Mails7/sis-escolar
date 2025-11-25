"use server"

import { query } from "@/lib/postgres"
import { revalidatePath } from "next/cache"

export async function getTeachers(
  page: number = 1,
  limit: number = 5,
  search?: string,
  department?: string,
  status?: string
) {
  try {
    const offset = (page - 1) * limit
    const params: any[] = [limit, offset]
    let paramIndex = 3
    let whereClause = ""

    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (department) {
      whereClause += ` AND subject_area = $${paramIndex}`
      params.push(department)
      paramIndex++
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // Remove first " AND " if exists and add WHERE
    if (whereClause) {
      whereClause = "WHERE " + whereClause.substring(5)
    }

    // Get teachers with pagination
    const teachersResult = await query(
      `SELECT * FROM teachers ${whereClause} ORDER BY name LIMIT $1 OFFSET $2`,
      params
    )

    // Get total count
    // We need to use the same where clause but with different params (without limit/offset)
    const countParams = params.slice(2)
    // Adjust param placeholders in whereClause for count query
    let countWhereClause = whereClause
    if (countWhereClause) {
      // This is a bit tricky with simple string replacement if indices change.
      // Simpler approach: Rebuild params for count
      let countParamIndex = 1
      let countWhere = ""
      const newCountParams = []

      if (search) {
        countWhere += ` AND (name ILIKE $${countParamIndex} OR email ILIKE $${countParamIndex})`
        newCountParams.push(`%${search}%`)
        countParamIndex++
      }
      if (department) {
        countWhere += ` AND subject_area = $${countParamIndex}`
        newCountParams.push(department)
        countParamIndex++
      }
      if (status) {
        countWhere += ` AND status = $${countParamIndex}`
        newCountParams.push(status)
        countParamIndex++
      }

      if (countWhere) {
        countWhereClause = "WHERE " + countWhere.substring(5)
      }

      const countResult = await query(`SELECT COUNT(*) as total FROM teachers ${countWhereClause}`, newCountParams)
      const total = parseInt(countResult.rows[0].total)

      return {
        teachers: teachersResult.rows,
        total,
        totalPages: Math.ceil(total / limit)
      }
    } else {
      const countResult = await query("SELECT COUNT(*) as total FROM teachers")
      const total = parseInt(countResult.rows[0].total)
      return {
        teachers: teachersResult.rows,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

  } catch (error) {
    console.error("Error fetching teachers:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido", teachers: [], total: 0, totalPages: 0 }
  }
}

export async function getTeacherById(id: string) {
  try {
    const result = await query("SELECT * FROM teachers WHERE id = $1", [id])
    return { teacher: result.rows[0] }
  } catch (error) {
    console.error("Error fetching teacher:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function createTeacher(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const specialization = formData.get("specialization") as string
    const hireDate = formData.get("hireDate") as string
    const schoolId = formData.get("schoolId") as string

    const result = await query(
      `INSERT INTO teachers 
       (name, email, phone, subject_area, hire_date, school_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [name, email, phone, specialization, hireDate, schoolId],
    )

    revalidatePath("/teachers")
    return { success: true, id: result.rows[0].id }
  } catch (error) {
    console.error("Error creating teacher:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function updateTeacher(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const specialization = formData.get("specialization") as string
    const hireDate = formData.get("hireDate") as string
    const status = formData.get("status") as string
    const schoolId = formData.get("schoolId") as string

    await query(
      `UPDATE teachers 
       SET name = $1, email = $2, phone = $3, subject_area = $4, hire_date = $5, 
           status = $6, school_id = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [name, email, phone, specialization, hireDate, status, schoolId, id],
    )

    revalidatePath(`/teachers/${id}`)
    revalidatePath("/teachers")
    return { success: true }
  } catch (error) {
    console.error("Error updating teacher:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function deleteTeacher(id: string) {
  try {
    await query("DELETE FROM teachers WHERE id = $1", [id])
    revalidatePath("/teachers")
    return { success: true }
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

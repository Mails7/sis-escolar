"use server"

import { query } from "@/lib/postgres"
import { revalidatePath } from "next/cache"

export async function getSchools(page: number = 1, limit: number = 5) {
  try {
    const offset = (page - 1) * limit

    // Get schools with pagination
    const schoolsResult = await query(
      "SELECT * FROM schools ORDER BY name LIMIT $1 OFFSET $2",
      [limit, offset]
    )

    // Get total count
    const countResult = await query("SELECT COUNT(*) as total FROM schools")
    const total = parseInt(countResult.rows[0].total)

    return {
      schools: schoolsResult.rows,
      total,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error("Error fetching schools:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido", schools: [], total: 0, totalPages: 0 }
  }
}

export async function getSchoolById(id: string) {
  try {
    const result = await query("SELECT * FROM schools WHERE id = $1", [id])
    return { school: result.rows[0] }
  } catch (error) {
    console.error("Error fetching school:", error)
    return { error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function createSchool(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const principalName = formData.get("principalName") as string

    const result = await query(
      `INSERT INTO schools 
       (name, address, phone, email, principal_name) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [name, address, phone, email, principalName],
    )

    revalidatePath("/schools")
    return { success: true, id: result.rows[0].id }
  } catch (error) {
    console.error("Error creating school:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function updateSchool(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const principalName = formData.get("principalName") as string

    await query(
      `UPDATE schools 
       SET name = $1, address = $2, phone = $3, email = $4, principal_name = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [name, address, phone, email, principalName, id],
    )

    revalidatePath(`/schools/${id}`)
    revalidatePath("/schools")
    return { success: true }
  } catch (error) {
    console.error("Error updating school:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function deleteSchool(id: string) {
  try {
    await query("DELETE FROM schools WHERE id = $1", [id])
    revalidatePath("/schools")
    return { success: true }
  } catch (error) {
    console.error("Error deleting school:", error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

"use server"

import { query } from "@/lib/postgres"
import { revalidatePath } from "next/cache"

export async function getClasses() {
    try {
        // Check if table exists
        const tableCheck = await query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'classes')"
        )

        if (!tableCheck.rows[0].exists) {
            return { error: "Tabela de turmas não encontrada", classes: [] }
        }

        const result = await query(`
      SELECT 
        c.id, c.name, c.grade, c.shift, c.classroom, c.max_students,
        s.name as school_name,
        t.name as teacher_name
      FROM classes c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN teachers t ON c.teacher_id = t.id
      ORDER BY c.name
    `)

        const classes = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            grade: row.grade,
            shift: row.shift,
            classroom: row.classroom,
            max_students: row.max_students,
            school: { name: row.school_name },
            teacher: { name: row.teacher_name }
        }))

        return { classes }
    } catch (error) {
        console.error("Error fetching classes:", error)
        return { error: error instanceof Error ? error.message : "Erro desconhecido", classes: [] }
    }
}

export async function getClassById(id: string) {
    try {
        const result = await query(`
      SELECT 
        c.*,
        s.id as school_id_joined,
        s.name as school_name,
        t.id as teacher_id_joined,
        t.name as teacher_name
      FROM classes c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN teachers t ON c.teacher_id = t.id
      WHERE c.id = $1
    `, [id])

        if (result.rows.length === 0) {
            return { error: "Turma não encontrada" }
        }

        const row = result.rows[0]
        const classItem = {
            ...row,
            school: { id: row.school_id_joined, name: row.school_name },
            teacher: { id: row.teacher_id_joined, name: row.teacher_name }
        }

        return { classItem }
    } catch (error) {
        console.error("Error fetching class:", error)
        return { error: error instanceof Error ? error.message : "Erro desconhecido" }
    }
}

export async function getClassStudents(classId: string) {
    try {
        const result = await query(`
      SELECT 
        e.id,
        e.enrollment_date,
        e.status,
        s.id as student_id,
        s.name as student_name,
        s.registration_code
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      WHERE e.class_id = $1
      ORDER BY s.name
    `, [classId])

        const students = result.rows.map(row => ({
            id: row.id,
            enrollment_date: row.enrollment_date,
            status: row.status,
            student: {
                id: row.student_id,
                name: row.student_name,
                registration_code: row.registration_code
            }
        }))

        return { students }
    } catch (error) {
        console.error("Error fetching class students:", error)
        return { error: error instanceof Error ? error.message : "Erro desconhecido", students: [] }
    }
}

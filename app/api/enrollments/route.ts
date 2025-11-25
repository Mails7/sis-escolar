import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET() {
  try {
    // Verificar se a tabela existe
    try {
      await query("SELECT 1 FROM enrollments LIMIT 1")
    } catch (error) {
      // Se a tabela não existir, retornar um erro em formato JSON válido
      if (error instanceof Error && error.message.includes("relation") && error.message.includes("does not exist")) {
        return NextResponse.json(
          { error: "table_not_found", message: "A tabela de matrículas não existe" },
          { status: 404 },
        )
      }

      // Para outros erros, retornar um erro genérico em formato JSON válido
      return NextResponse.json(
        { error: "database_error", message: error instanceof Error ? error.message : "Erro desconhecido" },
        { status: 500 },
      )
    }

    // Buscar matrículas
    const { rows: enrollments } = await query(`
      SELECT 
        e.id, 
        e.enrollment_date, 
        e.status,
        s.id as student_id, 
        s.name as student_name,
        c.id as class_id, 
        c.name as class_name
      FROM 
        enrollments e
      LEFT JOIN 
        students s ON e.student_id = s.id
      LEFT JOIN 
        classes c ON e.class_id = c.id
      ORDER BY 
        e.enrollment_date DESC
    `)

    // Formatar os dados
    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      student: {
        id: enrollment.student_id,
        name: enrollment.student_name || "Aluno não encontrado",
      },
      class: {
        id: enrollment.class_id,
        name: enrollment.class_name || "Turma não encontrada",
      },
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status,
      enrollment_number: `ENR-${enrollment.id.toString().padStart(6, "0")}`,
    }))

    return NextResponse.json(formattedEnrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    // Garantir que sempre retornamos JSON válido
    return NextResponse.json(
      { error: "fetch_error", message: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

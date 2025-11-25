import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get("school_id")
    const year = searchParams.get("year")
    const status = searchParams.get("status")

    // Verificar primeiro se a tabela existe
    const { error: tableCheckError } = await supabase.from("classes").select("id").limit(1).maybeSingle()

    // Se houver erro na verificação da tabela, retornar dados de demonstração
    if (tableCheckError) {
      console.log("Tabela de classes não encontrada ou erro de acesso:", tableCheckError.message)
      return NextResponse.json({
        data: [
          {
            id: "1",
            name: "1º Ano A - Ensino Fundamental",
            grade: "1º Ano",
            shift: "Manhã",
            classroom: "Sala 101",
            max_students: 30,
            school_year: 2023,
            status: "active",
            school: { id: "1", name: "Escola Municipal São Paulo" },
            teacher: { id: "1", name: "Prof. Ricardo Santos" },
          },
          {
            id: "2",
            name: "2º Ano B - Ensino Fundamental",
            grade: "2º Ano",
            shift: "Manhã",
            classroom: "Sala 102",
            max_students: 30,
            school_year: 2023,
            status: "active",
            school: { id: "1", name: "Escola Municipal São Paulo" },
            teacher: { id: "2", name: "Profa. Carla Mendes" },
          },
          {
            id: "3",
            name: "3º Ano A - Ensino Fundamental",
            grade: "3º Ano",
            shift: "Tarde",
            classroom: "Sala 201",
            max_students: 25,
            school_year: 2023,
            status: "active",
            school: { id: "2", name: "Escola Estadual Rio de Janeiro" },
            teacher: { id: "3", name: "Prof. Paulo Oliveira" },
          },
        ],
        isDemo: true,
      })
    }

    // Se a tabela existir, prosseguir com a consulta completa
    let query = supabase.from("classes").select(`
        id, 
        name, 
        grade, 
        shift, 
        classroom,
        max_students,
        school_year,
        status,
        school:school_id (id, name),
        teacher:teacher_id (id, name)
      `)

    if (schoolId) {
      query = query.eq("school_id", schoolId)
    }

    if (year) {
      query = query.eq("school_year", year)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("name")

    if (error) {
      console.error("Error fetching classes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("Unexpected error in GET /api/classes:", error)
    return NextResponse.json(
      {
        error: "Erro inesperado ao buscar turmas. Verifique o console para mais detalhes.",
        data: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Adicionar campos padrão
    const classData = {
      ...body,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("classes").insert([classData]).select()

    if (error) {
      console.error("Error creating class:", error)

      // Se a tabela não existir, retornar erro específico
      if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "A tabela de turmas não existe. Por favor, configure o banco de dados.",
            needsSetup: true,
          },
          { status: 400 },
        )
      }

      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data[0], message: "Turma criada com sucesso" })
  } catch (error) {
    console.error("Unexpected error in POST /api/classes:", error)
    return NextResponse.json(
      { error: "Erro inesperado ao criar turma. Verifique o console para mais detalhes." },
      { status: 500 },
    )
  }
}

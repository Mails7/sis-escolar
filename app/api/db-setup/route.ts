import { NextResponse } from "next/server"
import { createTables, seedDatabase } from "@/lib/postgres"

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === "createTables") {
      const result = await createTables()
      return NextResponse.json(result)
    } else if (action === "seedDatabase") {
      const result = await seedDatabase()
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro na API de configuração do banco de dados:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

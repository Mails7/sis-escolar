import { NextResponse } from "next/server"
import { checkConnection } from "@/lib/postgres"

export async function GET() {
  try {
    const status = await checkConnection()

    // Adicionar mais detalhes sobre a conexão
    const details = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      ...status,
      details,
    })
  } catch (error) {
    console.error("Erro ao verificar conexão:", error)

    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        message: "Falha ao verificar conexão com o banco de dados",
        details: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || "development",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: NextRequest) {
  try {
    const { reportType, studentData, classData, period } = await req.json()

    // Construir o prompt baseado no tipo de relatório
    let prompt = ""

    if (reportType === "student-performance") {
      prompt = `
        Gere um relatório detalhado sobre o desempenho do aluno com os seguintes dados:
        
        Nome do aluno: ${studentData.name}
        Turma: ${classData.name}
        Período: ${period}
        
        Notas:
        ${studentData.grades.map((grade: any) => `${grade.subject}: ${grade.value}/10`).join("\n")}
        
        Frequência: ${studentData.attendance}%
        
        O relatório deve incluir:
        1. Uma análise do desempenho acadêmico
        2. Pontos fortes e áreas para melhoria
        3. Recomendações personalizadas para o aluno
        4. Sugestões para os professores e responsáveis
        
        Formato o relatório em seções claras e use linguagem profissional e educacional.
      `
    } else if (reportType === "class-overview") {
      prompt = `
        Gere um relatório de visão geral da turma com os seguintes dados:
        
        Turma: ${classData.name}
        Período: ${period}
        Número de alunos: ${classData.studentCount}
        
        Desempenho médio por disciplina:
        ${classData.averageGrades.map((grade: any) => `${grade.subject}: ${grade.average}/10`).join("\n")}
        
        Frequência média: ${classData.averageAttendance}%
        
        O relatório deve incluir:
        1. Uma análise geral do desempenho da turma
        2. Identificação de padrões e tendências
        3. Recomendações para melhorar o desempenho geral
        4. Estratégias de ensino sugeridas
        
        Formato o relatório em seções claras e use linguagem profissional e educacional.
      `
    }

    // Gerar o relatório usando o AI SDK com o provedor Grok
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return NextResponse.json({ report: text })
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 })
  }
}

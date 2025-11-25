"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PromptTemplatesProps {
  onSelect: (template: string) => void
  language: "pt" | "en"
}

export function PromptTemplates({ onSelect, language }: PromptTemplatesProps) {
  const templates = {
    pt: [
      {
        title: "Plano de Aula",
        description: "Gerar um plano de aula detalhado",
        prompt:
          "Crie um plano de aula detalhado para uma turma do 7º ano sobre o tema 'Equações de Primeiro Grau'. O plano deve incluir objetivos, materiais necessários, atividades de introdução, desenvolvimento e conclusão, além de sugestões de avaliação. A aula deve durar 50 minutos.",
      },
      {
        title: "Questões de Avaliação",
        description: "Criar questões para avaliação",
        prompt:
          "Elabore 5 questões de múltipla escolha sobre História do Brasil (Período Colonial) para uma avaliação do 8º ano. Inclua 4 alternativas para cada questão e indique a resposta correta.",
      },
      {
        title: "Feedback para Aluno",
        description: "Gerar feedback construtivo",
        prompt:
          "Me ajude a escrever um feedback construtivo para um aluno do 6º ano que está tendo dificuldades em compreensão de texto, mas demonstra interesse e esforço. O feedback deve ser motivador e incluir sugestões práticas para melhorar.",
      },
      {
        title: "Atividade Diferenciada",
        description: "Criar atividade para alunos com necessidades especiais",
        prompt:
          "Preciso de uma atividade adaptada sobre frações para um aluno com dislexia do 5º ano. A atividade deve ser visual, utilizar materiais concretos e considerar as dificuldades específicas relacionadas à dislexia.",
      },
      {
        title: "Projeto Interdisciplinar",
        description: "Desenvolver projeto que integra múltiplas disciplinas",
        prompt:
          "Sugira um projeto interdisciplinar que integre Ciências, Geografia e Matemática para o 9º ano com o tema 'Sustentabilidade e Meio Ambiente'. O projeto deve durar 3 semanas e incluir objetivos, metodologia, recursos necessários e formas de avaliação.",
      },
    ],
    en: [
      {
        title: "Lesson Plan",
        description: "Generate a detailed lesson plan",
        prompt:
          "Create a detailed lesson plan for a 7th grade class on the topic of 'First Degree Equations'. The plan should include objectives, required materials, introduction activities, development and conclusion, as well as assessment suggestions. The class should last 50 minutes.",
      },
      {
        title: "Assessment Questions",
        description: "Create questions for assessment",
        prompt:
          "Develop 5 multiple-choice questions about Brazilian History (Colonial Period) for an 8th grade assessment. Include 4 alternatives for each question and indicate the correct answer.",
      },
      {
        title: "Student Feedback",
        description: "Generate constructive feedback",
        prompt:
          "Help me write constructive feedback for a 6th grade student who is having difficulties with reading comprehension but shows interest and effort. The feedback should be motivating and include practical suggestions for improvement.",
      },
      {
        title: "Differentiated Activity",
        description: "Create activity for students with special needs",
        prompt:
          "I need an adapted activity about fractions for a 5th grade student with dyslexia. The activity should be visual, use concrete materials, and consider the specific difficulties related to dyslexia.",
      },
      {
        title: "Interdisciplinary Project",
        description: "Develop a project that integrates multiple disciplines",
        prompt:
          "Suggest an interdisciplinary project that integrates Science, Geography, and Mathematics for 9th grade with the theme 'Sustainability and Environment'. The project should last 3 weeks and include objectives, methodology, necessary resources, and forms of assessment.",
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates[language].map((template, index) => (
        <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{template.prompt}</p>
            <Button className="w-full mt-4" variant="outline" onClick={() => onSelect(template.prompt)}>
              {language === "pt" ? "Usar este modelo" : "Use this template"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

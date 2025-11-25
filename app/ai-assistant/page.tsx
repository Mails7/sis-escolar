import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { TeacherAssistant } from "@/components/ai-assistant/teacher-assistant"

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <HomeIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/ai-assistant">Assistente de IA</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assistente de IA para Professores</h1>
        <p className="text-muted-foreground">
          Use o poder da inteligência artificial para auxiliar no planejamento de aulas e avaliação de alunos.
        </p>
      </div>

      <TeacherAssistant />
    </div>
  )
}

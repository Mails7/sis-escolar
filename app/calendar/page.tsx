import type { Metadata } from "next"
import { AcademicCalendar } from "@/components/calendar/academic-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Calendário Acadêmico | i-Educar",
  description: "Gerencie o calendário acadêmico, eventos, feriados e períodos letivos",
}

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendário Acadêmico</h1>
        <p className="text-muted-foreground">Gerencie o calendário acadêmico, eventos, feriados e períodos letivos</p>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="holidays">Feriados</TabsTrigger>
          <TabsTrigger value="periods">Períodos Letivos</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <AcademicCalendar />
        </TabsContent>
        <TabsContent value="holidays" className="mt-6">
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">Gerenciamento de Feriados</h3>
              <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="periods" className="mt-6">
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">Gerenciamento de Períodos Letivos</h3>
              <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="events" className="mt-6">
          <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">Gerenciamento de Eventos</h3>
              <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

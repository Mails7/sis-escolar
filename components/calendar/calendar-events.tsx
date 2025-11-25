import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarEventsProps {
  expanded?: boolean
}

export function CalendarEvents({ expanded = false }: CalendarEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Nenhum evento agendado para os próximos dias.</CardContent>
    </Card>
  )
}

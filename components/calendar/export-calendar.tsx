"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ExportCalendar() {
  const [format, setFormat] = useState("ics")
  const [includeHolidays, setIncludeHolidays] = useState(true)
  const [includeEvents, setIncludeEvents] = useState(true)
  const [includePeriods, setIncludePeriods] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    // Simulação de exportação
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Em uma implementação real, aqui seria feita uma chamada à API para gerar o arquivo
    const dummyData =
      "data:text/calendar;charset=utf-8,BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Educar//Calendar//PT\nEND:VCALENDAR"
    const link = document.createElement("a")
    link.href = dummyData
    link.download = `calendario-escolar.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar Calendário</DialogTitle>
          <DialogDescription>Escolha as opções para exportar seu calendário escolar.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Formato
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ics">iCalendar (.ics)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Incluir</Label>
            <div className="space-y-2 col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="holidays"
                  checked={includeHolidays}
                  onCheckedChange={(checked) => setIncludeHolidays(checked as boolean)}
                />
                <Label htmlFor="holidays">Feriados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="events"
                  checked={includeEvents}
                  onCheckedChange={(checked) => setIncludeEvents(checked as boolean)}
                />
                <Label htmlFor="events">Eventos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="periods"
                  checked={includePeriods}
                  onCheckedChange={(checked) => setIncludePeriods(checked as boolean)}
                />
                <Label htmlFor="periods">Períodos Letivos</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>Exportando...</>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Exportar Calendário
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

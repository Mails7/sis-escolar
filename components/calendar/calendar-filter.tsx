"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon, FilterIcon } from "lucide-react"

export function CalendarFilter() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar eventos..." className="w-full pl-8" />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="sm:w-10 h-10">
              <FilterIcon className="h-4 w-4" />
              <span className="sr-only">Filtros</span>
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">Escola</Label>
                <Select>
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Todas as escolas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as escolas</SelectItem>
                    <SelectItem value="escola1">Escola Municipal João Paulo</SelectItem>
                    <SelectItem value="escola2">Escola Municipal Maria Clara</SelectItem>
                    <SelectItem value="escola3">Escola Municipal Pedro Álvares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Select defaultValue="2024">
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Evento</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="holiday" defaultChecked />
                    <label
                      htmlFor="holiday"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Feriados
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="event" defaultChecked />
                    <label
                      htmlFor="event"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Eventos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="exam" defaultChecked />
                    <label
                      htmlFor="exam"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Avaliações
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="break" defaultChecked />
                    <label
                      htmlFor="break"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recessos
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

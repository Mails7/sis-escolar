"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export interface TeacherFilters {
  search: string
  status: string
  department: string
  subjects: string[]
  hireDateFrom: Date | undefined
  hireDateTo: Date | undefined
}

interface TeacherFiltersProps {
  onFilterChange: (filters: TeacherFilters) => void
  availableDepartments?: string[]
  availableSubjects?: string[]
}

export function TeacherFilters({
  onFilterChange,
  availableDepartments = [],
  availableSubjects = [],
}: TeacherFiltersProps) {
  const [filters, setFilters] = useState<TeacherFilters>({
    search: "",
    status: "",
    department: "",
    subjects: [],
    hireDateFrom: undefined,
    hireDateTo: undefined,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Se não houver departamentos disponíveis, use alguns padrão
  const departments =
    availableDepartments.length > 0
      ? availableDepartments
      : ["Matemática", "Ciências", "Linguagens", "Ciências Humanas", "Educação Física", "Artes"]

  // Se não houver disciplinas disponíveis, use algumas padrão
  const subjects =
    availableSubjects.length > 0
      ? availableSubjects
      : [
          "Matemática",
          "Física",
          "Química",
          "Biologia",
          "Português",
          "Literatura",
          "História",
          "Geografia",
          "Educação Física",
          "Artes",
          "Inglês",
          "Espanhol",
        ]

  const handleFilterChange = (key: keyof TeacherFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)

    // Contar filtros ativos
    let count = 0
    if (newFilters.search) count++
    if (newFilters.status) count++
    if (newFilters.department) count++
    if (newFilters.subjects.length > 0) count++
    if (newFilters.hireDateFrom) count++
    if (newFilters.hireDateTo) count++
    setActiveFiltersCount(count)
  }

  const toggleSubject = (subject: string) => {
    const newSubjects = filters.subjects.includes(subject)
      ? filters.subjects.filter((s) => s !== subject)
      : [...filters.subjects, subject]

    handleFilterChange("subjects", newSubjects)
  }

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      status: "",
      department: "",
      subjects: [],
      hireDateFrom: undefined,
      hireDateTo: undefined,
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
    setActiveFiltersCount(0)
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Input
            placeholder="Buscar por nome ou ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filtros</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Limpar filtros
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="Active">Ativo</SelectItem>
                      <SelectItem value="On Leave">Em licença</SelectItem>
                      <SelectItem value="Retired">Aposentado</SelectItem>
                      <SelectItem value="Terminated">Desligado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={filters.department} onValueChange={(value) => handleFilterChange("department", value)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Todos os departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os departamentos</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Disciplinas</Label>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={filters.subjects.includes(subject)}
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <label
                            htmlFor={`subject-${subject}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {subject}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data de Contratação</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.hireDateFrom ? (
                              format(filters.hireDateFrom, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>De</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.hireDateFrom}
                            onSelect={(date) => handleFilterChange("hireDateFrom", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.hireDateTo ? (
                              format(filters.hireDateTo, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Até</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.hireDateTo}
                            onSelect={(date) => handleFilterChange("hireDateTo", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Mostrar filtros ativos */}
      {activeFiltersCount > 0 && (
        <Card className="mt-4">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("status", "")} />
                </Badge>
              )}
              {filters.department && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Departamento: {filters.department}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("department", "")} />
                </Badge>
              )}
              {filters.subjects.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Disciplinas: {filters.subjects.length}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("subjects", [])} />
                </Badge>
              )}
              {filters.hireDateFrom && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  De: {format(filters.hireDateFrom, "dd/MM/yyyy", { locale: ptBR })}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("hireDateFrom", undefined)}
                  />
                </Badge>
              )}
              {filters.hireDateTo && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Até: {format(filters.hireDateTo, "dd/MM/yyyy", { locale: ptBR })}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("hireDateTo", undefined)}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

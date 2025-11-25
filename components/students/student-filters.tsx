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

export interface StudentFilters {
  search: string
  status: string
  grade: string
  enrollmentDateFrom: Date | undefined
  enrollmentDateTo: Date | undefined
}

interface StudentFiltersProps {
  onFilterChange: (filters: StudentFilters) => void
  availableGrades?: string[]
}

export function StudentFilters({ onFilterChange, availableGrades = [] }: StudentFiltersProps) {
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    status: "",
    grade: "",
    enrollmentDateFrom: undefined,
    enrollmentDateTo: undefined,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Se não houver grades disponíveis, use algumas padrão
  const grades =
    availableGrades.length > 0
      ? availableGrades
      : ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano", "7º Ano", "8º Ano", "9º Ano"]

  const handleFilterChange = (key: keyof StudentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)

    // Contar filtros ativos
    let count = 0
    if (newFilters.search) count++
    if (newFilters.status) count++
    if (newFilters.grade) count++
    if (newFilters.enrollmentDateFrom) count++
    if (newFilters.enrollmentDateTo) count++
    setActiveFiltersCount(count)
  }

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      status: "",
      grade: "",
      enrollmentDateFrom: undefined,
      enrollmentDateTo: undefined,
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
                      <SelectItem value="Inactive">Inativo</SelectItem>
                      <SelectItem value="Transferred">Transferido</SelectItem>
                      <SelectItem value="Graduated">Formado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Série</Label>
                  <Select value={filters.grade} onValueChange={(value) => handleFilterChange("grade", value)}>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Todas as séries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as séries</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data de Matrícula</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.enrollmentDateFrom ? (
                              format(filters.enrollmentDateFrom, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>De</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.enrollmentDateFrom}
                            onSelect={(date) => handleFilterChange("enrollmentDateFrom", date)}
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
                            {filters.enrollmentDateTo ? (
                              format(filters.enrollmentDateTo, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Até</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.enrollmentDateTo}
                            onSelect={(date) => handleFilterChange("enrollmentDateTo", date)}
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
              {filters.grade && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Série: {filters.grade}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("grade", "")} />
                </Badge>
              )}
              {filters.enrollmentDateFrom && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  De: {format(filters.enrollmentDateFrom, "dd/MM/yyyy", { locale: ptBR })}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("enrollmentDateFrom", undefined)}
                  />
                </Badge>
              )}
              {filters.enrollmentDateTo && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Até: {format(filters.enrollmentDateTo, "dd/MM/yyyy", { locale: ptBR })}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterChange("enrollmentDateTo", undefined)}
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

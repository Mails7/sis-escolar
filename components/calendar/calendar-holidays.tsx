"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlusIcon, Pencil, Trash2, CalendarIcon, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for holidays
const initialHolidays = [
  {
    id: "1",
    name: "Ano Novo",
    date: new Date(2024, 0, 1),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "2",
    name: "Carnaval",
    date: new Date(2024, 1, 13),
    type: "national",
    repeatsYearly: false,
    description: "Feriado móvel",
    affectsAllSchools: true,
  },
  {
    id: "3",
    name: "Quarta-feira de Cinzas",
    date: new Date(2024, 1, 14),
    type: "optional",
    repeatsYearly: false,
    description: "Ponto facultativo até as 14h",
    affectsAllSchools: true,
  },
  {
    id: "4",
    name: "Sexta-feira Santa",
    date: new Date(2024, 2, 29),
    type: "national",
    repeatsYearly: false,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "5",
    name: "Tiradentes",
    date: new Date(2024, 3, 21),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "6",
    name: "Dia do Trabalho",
    date: new Date(2024, 4, 1),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "7",
    name: "Corpus Christi",
    date: new Date(2024, 4, 30),
    type: "optional",
    repeatsYearly: false,
    description: "Ponto facultativo",
    affectsAllSchools: true,
  },
  {
    id: "8",
    name: "Independência do Brasil",
    date: new Date(2024, 8, 7),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "9",
    name: "Nossa Senhora Aparecida",
    date: new Date(2024, 9, 12),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "10",
    name: "Finados",
    date: new Date(2024, 10, 2),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "11",
    name: "Proclamação da República",
    date: new Date(2024, 10, 15),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "12",
    name: "Dia da Consciência Negra",
    date: new Date(2024, 10, 20),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "13",
    name: "Natal",
    date: new Date(2024, 11, 25),
    type: "national",
    repeatsYearly: true,
    description: "Feriado nacional",
    affectsAllSchools: true,
  },
  {
    id: "14",
    name: "Aniversário da Cidade",
    date: new Date(2024, 7, 15),
    type: "municipal",
    repeatsYearly: true,
    description: "Feriado municipal",
    affectsAllSchools: true,
  },
]

interface CalendarHolidaysProps {
  expanded?: boolean
}

export function CalendarHolidays({ expanded = false }: CalendarHolidaysProps) {
  const [holidays, setHolidays] = useState(initialHolidays)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: new Date(),
    type: "national",
    repeatsYearly: false,
    description: "",
    affectsAllSchools: true,
  })

  const filteredHolidays = holidays
    .filter(
      (holiday) =>
        (filterType === "all" || holiday.type === filterType) &&
        (searchTerm === "" ||
          holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          holiday.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const handleAddHoliday = () => {
    const id = (holidays.length + 1).toString()

    setHolidays([
      ...holidays,
      {
        id,
        name: newHoliday.name,
        date: newHoliday.date,
        type: newHoliday.type,
        repeatsYearly: newHoliday.repeatsYearly,
        description: newHoliday.description,
        affectsAllSchools: newHoliday.affectsAllSchools,
      },
    ])

    setIsAddDialogOpen(false)
    setNewHoliday({
      name: "",
      date: new Date(),
      type: "national",
      repeatsYearly: false,
      description: "",
      affectsAllSchools: true,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Feriados e Recessos</CardTitle>
            <CardDescription>Dias sem atividade escolar</CardDescription>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Adicionar Feriado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Feriado</DialogTitle>
                  <DialogDescription>Defina as informações do novo feriado ou recesso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Data
                    </Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newHoliday.date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newHoliday.date ? (
                              format(newHoliday.date, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newHoliday.date}
                            onSelect={(date) => date && setNewHoliday({ ...newHoliday, date: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select
                      value={newHoliday.type}
                      onValueChange={(value) => setNewHoliday({ ...newHoliday, type: value })}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">Feriado Nacional</SelectItem>
                        <SelectItem value="state">Feriado Estadual</SelectItem>
                        <SelectItem value="municipal">Feriado Municipal</SelectItem>
                        <SelectItem value="optional">Ponto Facultativo</SelectItem>
                        <SelectItem value="school">Recesso Escolar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descrição
                    </Label>
                    <Input
                      id="description"
                      value={newHoliday.description}
                      onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-4 flex items-center space-x-2">
                      <Checkbox
                        id="repeatsYearly"
                        checked={newHoliday.repeatsYearly}
                        onCheckedChange={(checked) =>
                          setNewHoliday({ ...newHoliday, repeatsYearly: checked as boolean })
                        }
                      />
                      <Label htmlFor="repeatsYearly">Repete anualmente</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-4 flex items-center space-x-2">
                      <Checkbox
                        id="affectsAllSchools"
                        checked={newHoliday.affectsAllSchools}
                        onCheckedChange={(checked) =>
                          setNewHoliday({ ...newHoliday, affectsAllSchools: checked as boolean })
                        }
                      />
                      <Label htmlFor="affectsAllSchools">Aplica-se a todas as escolas</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddHoliday}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar feriados..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="national">Feriados Nacionais</SelectItem>
                <SelectItem value="state">Feriados Estaduais</SelectItem>
                <SelectItem value="municipal">Feriados Municipais</SelectItem>
                <SelectItem value="optional">Pontos Facultativos</SelectItem>
                <SelectItem value="school">Recessos Escolares</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHolidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{format(holiday.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          holiday.type === "national" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                          holiday.type === "state" &&
                            "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
                          holiday.type === "municipal" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
                          holiday.type === "optional" &&
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
                          holiday.type === "school" &&
                            "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
                        )}
                      >
                        {holiday.type === "national" && "Nacional"}
                        {holiday.type === "state" && "Estadual"}
                        {holiday.type === "municipal" && "Municipal"}
                        {holiday.type === "optional" && "Facultativo"}
                        {holiday.type === "school" && "Recesso"}
                      </Badge>
                    </TableCell>
                    <TableCell>{holiday.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHolidays.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum feriado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

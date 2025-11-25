"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export function ImportCalendar() {
  const [file, setFile] = useState<File | null>(null)
  const [importOption, setImportOption] = useState("merge")
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    // Simulação de importação
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Em uma implementação real, aqui seria feita uma chamada à API para processar o arquivo
    toast({
      title: "Importação concluída",
      description: `Arquivo ${file.name} importado com sucesso.`,
      variant: "default",
    })

    setIsImporting(false)
    setFile(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar Calendário</DialogTitle>
          <DialogDescription>Importe eventos de calendário de arquivos .ics, .csv ou .xlsx.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calendar-file" className="text-right">
              Arquivo
            </Label>
            <div className="col-span-3">
              <Input id="calendar-file" type="file" accept=".ics,.csv,.xlsx" onChange={handleFileChange} />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Opções</Label>
            <RadioGroup value={importOption} onValueChange={setImportOption} className="col-span-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="merge" id="merge" />
                <Label htmlFor="merge">Mesclar com eventos existentes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replace" id="replace" />
                <Label htmlFor="replace">Substituir eventos existentes</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleImport} disabled={isImporting || !file}>
            {isImporting ? "Importando..." : "Importar Calendário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

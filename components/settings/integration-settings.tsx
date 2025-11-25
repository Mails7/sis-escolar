"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export function IntegrationSettings() {
  const [supabaseEnabled, setSupabaseEnabled] = useState(true)
  const [xaiEnabled, setXaiEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [reportEnabled, setReportEnabled] = useState(false)

  const handleSaveSupabase = () => {
    toast({
      title: "Configurações do Supabase salvas",
      description: "As configurações do Supabase foram salvas com sucesso.",
    })
  }

  const handleSaveXai = () => {
    toast({
      title: "Configurações do Xai salvas",
      description: "As configurações do Xai foram salvas com sucesso.",
    })
  }

  const handleSaveEmail = () => {
    toast({
      title: "Configurações de E-mail salvas",
      description: "As configurações de e-mail foram salvas com sucesso.",
    })
  }

  const handleSaveReport = () => {
    toast({
      title: "Configurações de Relatórios salvas",
      description: "As configurações de relatórios foram salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Supabase</CardTitle>
            <CardDescription>Banco de dados e autenticação</CardDescription>
          </div>
          <Badge variant={supabaseEnabled ? "default" : "outline"} className={supabaseEnabled ? "bg-green-500" : ""}>
            {supabaseEnabled ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> Conectado
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" /> Desconectado
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Supabase</Label>
              <p className="text-sm text-muted-foreground">Conectar ao banco de dados Supabase</p>
            </div>
            <Switch checked={supabaseEnabled} onCheckedChange={setSupabaseEnabled} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="supabase-url">URL do Supabase</Label>
            <Input id="supabase-url" value={process.env.NEXT_PUBLIC_SUPABASE_URL || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Chave Anônima do Supabase</Label>
            <Input id="supabase-key" type="password" value="••••••••••••••••••••••••••••••" readOnly />
          </div>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Acessar Dashboard do Supabase
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSupabase} disabled={!supabaseEnabled}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Xai (Grok)</CardTitle>
            <CardDescription>Inteligência artificial para assistência</CardDescription>
          </div>
          <Badge variant={xaiEnabled ? "default" : "outline"} className={xaiEnabled ? "bg-green-500" : ""}>
            {xaiEnabled ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> Conectado
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" /> Desconectado
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Xai</Label>
              <p className="text-sm text-muted-foreground">Usar IA para assistência e geração de conteúdo</p>
            </div>
            <Switch checked={xaiEnabled} onCheckedChange={setXaiEnabled} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="xai-key">Chave de API do Xai</Label>
            <Input id="xai-key" type="password" value="••••••••••••••••••••••••••••••" readOnly />
          </div>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Gerenciar Chaves de API
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveXai} disabled={!xaiEnabled}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Servidor de E-mail</CardTitle>
            <CardDescription>Configuração para envio de e-mails</CardDescription>
          </div>
          <Badge variant={emailEnabled ? "default" : "outline"} className={emailEnabled ? "bg-green-500" : ""}>
            {emailEnabled ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> Conectado
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" /> Desconectado
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Servidor de E-mail</Label>
              <p className="text-sm text-muted-foreground">Configurar servidor para envio de e-mails</p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="smtp-host">Servidor SMTP</Label>
            <Input id="smtp-host" placeholder="smtp.exemplo.com" disabled={!emailEnabled} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Porta</Label>
              <Input id="smtp-port" placeholder="587" disabled={!emailEnabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-security">Segurança</Label>
              <Select disabled={!emailEnabled}>
                <SelectTrigger id="smtp-security">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">Nenhuma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-user">Usuário</Label>
            <Input id="smtp-user" placeholder="usuario@exemplo.com" disabled={!emailEnabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-password">Senha</Label>
            <Input id="smtp-password" type="password" placeholder="••••••••••••" disabled={!emailEnabled} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveEmail} disabled={!emailEnabled}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Sistema de Relatórios</CardTitle>
            <CardDescription>Configuração para geração de relatórios</CardDescription>
          </div>
          <Badge variant={reportEnabled ? "default" : "outline"} className={reportEnabled ? "bg-green-500" : ""}>
            {reportEnabled ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> Ativado
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" /> Desativado
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Sistema de Relatórios</Label>
              <p className="text-sm text-muted-foreground">Configurar sistema para geração de relatórios</p>
            </div>
            <Switch checked={reportEnabled} onCheckedChange={setReportEnabled} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="report-path">Caminho para Relatórios</Label>
            <Input id="report-path" placeholder="/reports" disabled={!reportEnabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-format">Formato Padrão</Label>
            <Select disabled={!reportEnabled}>
              <SelectTrigger id="report-format">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveReport} disabled={!reportEnabled}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

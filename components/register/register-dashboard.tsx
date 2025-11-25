"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  School,
  User,
  UserCog,
  Building2,
  BookOpen,
  Users,
  Calendar,
  Bus,
  Utensils,
  FileText,
  PlusCircle,
  ListChecks,
} from "lucide-react"

export function RegisterDashboard() {
  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="people">Pessoas</TabsTrigger>
        <TabsTrigger value="institutions">Instituições</TabsTrigger>
        <TabsTrigger value="academic">Acadêmico</TabsTrigger>
        <TabsTrigger value="services">Serviços</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RegisterCard
            title="Escolas"
            description="Cadastre e gerencie instituições de ensino"
            icon={<School className="h-6 w-6" />}
            href="/schools/register"
            count={32}
          />
          <RegisterCard
            title="Alunos"
            description="Cadastre e gerencie alunos"
            icon={<User className="h-6 w-6" />}
            href="/students/register"
            count={1458}
          />
          <RegisterCard
            title="Professores"
            description="Cadastre e gerencie professores"
            icon={<UserCog className="h-6 w-6" />}
            href="/teachers/register"
            count={87}
          />
          <RegisterCard
            title="Servidores"
            description="Cadastre e gerencie servidores administrativos"
            icon={<Users className="h-6 w-6" />}
            href="/servers/register"
            count={124}
          />
          <RegisterCard
            title="Turmas"
            description="Cadastre e gerencie turmas"
            icon={<BookOpen className="h-6 w-6" />}
            href="/classes/register"
            count={76}
          />
          <RegisterCard
            title="Calendário Escolar"
            description="Gerencie eventos e períodos letivos"
            icon={<Calendar className="h-6 w-6" />}
            href="/calendar"
            count={3}
          />
          <RegisterCard
            title="Transporte Escolar"
            description="Cadastre e gerencie rotas e veículos"
            icon={<Bus className="h-6 w-6" />}
            href="/transport/register"
            count={18}
          />
          <RegisterCard
            title="Merenda Escolar"
            description="Cadastre e gerencie cardápios e estoque"
            icon={<Utensils className="h-6 w-6" />}
            href="/meals/register"
            count={42}
          />
          <RegisterCard
            title="Documentos"
            description="Cadastre e gerencie documentos institucionais"
            icon={<FileText className="h-6 w-6" />}
            href="/documents/register"
            count={215}
          />
        </div>
      </TabsContent>

      <TabsContent value="people" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RegisterCard
            title="Alunos"
            description="Cadastre e gerencie alunos"
            icon={<User className="h-6 w-6" />}
            href="/students/register"
            count={1458}
          />
          <RegisterCard
            title="Professores"
            description="Cadastre e gerencie professores"
            icon={<UserCog className="h-6 w-6" />}
            href="/teachers/register"
            count={87}
          />
          <RegisterCard
            title="Servidores"
            description="Cadastre e gerencie servidores administrativos"
            icon={<Users className="h-6 w-6" />}
            href="/servers/register"
            count={124}
          />
        </div>
      </TabsContent>

      <TabsContent value="institutions" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RegisterCard
            title="Escolas"
            description="Cadastre e gerencie instituições de ensino"
            icon={<School className="h-6 w-6" />}
            href="/schools/register"
            count={32}
          />
          <RegisterCard
            title="Secretarias"
            description="Cadastre e gerencie secretarias de educação"
            icon={<Building2 className="h-6 w-6" />}
            href="/secretary/register"
            count={1}
          />
        </div>
      </TabsContent>

      <TabsContent value="academic" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RegisterCard
            title="Turmas"
            description="Cadastre e gerencie turmas"
            icon={<BookOpen className="h-6 w-6" />}
            href="/classes/register"
            count={76}
          />
          <RegisterCard
            title="Disciplinas"
            description="Cadastre e gerencie disciplinas"
            icon={<ListChecks className="h-6 w-6" />}
            href="/subjects/register"
            count={24}
          />
          <RegisterCard
            title="Calendário Escolar"
            description="Gerencie eventos e períodos letivos"
            icon={<Calendar className="h-6 w-6" />}
            href="/calendar"
            count={3}
          />
        </div>
      </TabsContent>

      <TabsContent value="services" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RegisterCard
            title="Transporte Escolar"
            description="Cadastre e gerencie rotas e veículos"
            icon={<Bus className="h-6 w-6" />}
            href="/transport/register"
            count={18}
          />
          <RegisterCard
            title="Merenda Escolar"
            description="Cadastre e gerencie cardápios e estoque"
            icon={<Utensils className="h-6 w-6" />}
            href="/meals/register"
            count={42}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

interface RegisterCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  count: number
}

function RegisterCard({ title, description, icon, href, count }: RegisterCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-md">{icon}</div>
          <div className="bg-muted px-2 py-1 rounded-md text-sm font-medium">{count}</div>
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 pb-4">
        <Button asChild className="w-full">
          <Link href={href}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cadastro
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChevronDown,
  CircleUser,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  Menu,
  School,
  Server,
  Settings,
  Users,
  X,
  BrainCircuit,
  ClipboardCheck,
  Clock,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  defaultCollapsed?: boolean
}

export default function Sidebar({ defaultCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const mainNav = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Alunos",
      href: "/students",
      icon: <Users className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Professores",
      href: "/teachers",
      icon: <GraduationCap className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Escolas",
      href: "/schools",
      icon: <School className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Secretaria",
      href: "/secretary",
      icon: <ClipboardList className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Servidores",
      href: "/servers",
      icon: <Server className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Calendário",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Matrículas",
      href: "/enrollments",
      icon: <ClipboardCheck className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Horários",
      href: "/schedule",
      icon: <Clock className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Diário de Classe",
      href: "/classes",
      icon: <BookOpen className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Assistente IA",
      href: "/ai-assistant",
      icon: <BrainCircuit className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: <FileText className="h-5 w-5" />,
      variant: "ghost" as const,
    },
  ]

  const secondaryNav = [
    {
      title: "Configurações",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      variant: "ghost" as const,
    },
    {
      title: "Ajuda",
      href: "/help",
      icon: <FileText className="h-5 w-5" />,
      variant: "ghost" as const,
    },
  ]

  return (
    <>
      <div
        className={cn(
          "hidden border-r bg-background lg:flex flex-col transition-all duration-300",
          collapsed ? "lg:w-16" : "lg:w-56",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <School className="h-6 w-6" />
            {!collapsed && <span className="font-bold">CEMEC</span>}
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDown className="h-4 w-4 rotate-180" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {mainNav.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent",
                  collapsed && "justify-center px-0",
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            {!collapsed && <div className="px-4 py-2 text-xs font-semibold">Administração</div>}
            <nav className="grid gap-1 px-2">
              {secondaryNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <CircleUser className="h-8 w-8" />
            {!collapsed && (
              <div className="grid gap-0.5">
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">admin@educar.gov.br</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex items-center justify-between border-b p-4">
            <Link href="/" className="flex items-center gap-2">
              <School className="h-6 w-6" />
              <span className="font-bold">Educar</span>
            </Link>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {mainNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <div className="px-4 py-2 text-xs font-semibold">Administração</div>
              <nav className="grid gap-1 px-2">
                {secondaryNav.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <CircleUser className="h-8 w-8" />
              <div className="grid gap-0.5">
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">admin@educar.gov.br</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

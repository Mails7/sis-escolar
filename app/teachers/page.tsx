import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { TeacherTable } from "@/components/teachers/teacher-table"

export default async function TeachersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
        <Button asChild>
          <Link href="/teachers/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Professor
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <TeacherTable />
      </Suspense>
    </div>
  )
}

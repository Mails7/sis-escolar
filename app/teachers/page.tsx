import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { TeacherTable } from "@/components/teachers/teacher-table"
import { TableNotFoundAlert } from "@/components/teachers/table-not-found-alert"
import { tableExists } from "@/lib/postgres"

async function checkTeachersTable() {
  const exists = await tableExists("teachers")
  return { exists }
}

export default async function TeachersPage() {
  const { exists } = await checkTeachersTable()

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

      {!exists && <TableNotFoundAlert />}

      <Suspense fallback={<div>Carregando...</div>}>
        <TeacherTable />
      </Suspense>
    </div>
  )
}

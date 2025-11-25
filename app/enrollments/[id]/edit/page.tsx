import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { EnrollmentForm } from "@/components/enrollments/enrollment-form"

async function getEnrollment(id: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      student_id,
      class_id,
      school_year,
      enrollment_date,
      status
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("Error fetching enrollment:", error)
    return null
  }

  return data
}

export default async function EditEnrollmentPage({ params }: { params: { id: string } }) {
  const enrollment = await getEnrollment(params.id)

  if (!enrollment) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Editar Matrícula</h1>
      <EnrollmentForm enrollment={enrollment} />
    </div>
  )
}

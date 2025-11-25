import type { Metadata } from "next"
import { DbInitializer } from "@/components/db-initializer"

export const metadata: Metadata = {
  title: "Database Setup - Educar",
  description: "Initialize the database for the Educar school management system",
}

export default function SetupPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Educar Database Setup</h1>
      <DbInitializer />
    </div>
  )
}

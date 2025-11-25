"use server"

import { setupDatabase } from "@/lib/db-schema"

export async function initializeDatabase() {
  try {
    await setupDatabase()
    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, message: "Failed to initialize database" }
  }
}

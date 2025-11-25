import { supabase } from "./supabase"

export async function checkDatabaseConnection() {
  try {
    // Try a simple query to check if the database is accessible
    const { data, error } = await supabase.from("students").select("count").limit(1)

    if (error) {
      console.error("Database connection check failed:", error)
      return {
        connected: false,
        error: error.message,
      }
    }

    return {
      connected: true,
      error: null,
    }
  } catch (err) {
    console.error("Database connection check failed with exception:", err)
    return {
      connected: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

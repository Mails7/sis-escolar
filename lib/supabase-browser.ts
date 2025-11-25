"use client"

import { createClient } from "@supabase/supabase-js"

// Valores padrão para desenvolvimento local (não use em produção)
const DEFAULT_SUPABASE_URL = "https://tbtlheaptncptysbxvvh.supabase.co"
const DEFAULT_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidGxoZWFwdG5jcHR5c2J4dnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NzA5NTAsImV4cCI6MjA2MjA0Njk1MH0.Wc8ee8aQUWOBVgsS3vx65MD9Bqde25ZTRJL-1zflT6M"

// Obtenha as variáveis de ambiente ou use valores padrão
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY

// Crie o cliente Supabase
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "X-Client-Info": "educar-app",
    },
  },
})

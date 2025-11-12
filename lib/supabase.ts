import { createClient as createSupabaseClient } from "@supabase/supabase-js"

console.log("[v0] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "NOT SET")
console.log("[v0] Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "NOT SET")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables!")
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

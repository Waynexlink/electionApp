import { NextResponse } from "next/server"
import { supabaseOperations } from "@/lib/supabase"

export async function GET() {
  try {
    const elections = await supabaseOperations.getElections()
    return NextResponse.json(elections)
  } catch (error) {
    console.error("Error fetching elections:", error)
    return NextResponse.json({ error: "Failed to fetch elections" }, { status: 500 })
  }
}

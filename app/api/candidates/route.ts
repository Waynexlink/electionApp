import { type NextRequest, NextResponse } from "next/server"
import { supabaseOperations } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postIds = searchParams.get("postIds")?.split(",")

    const candidates = await supabaseOperations.getCandidates(postIds)
    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const candidateData = await request.json()
    const candidate = await supabaseOperations.addCandidate(candidateData)
    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Error adding candidate:", error)
    return NextResponse.json({ error: "Failed to add candidate" }, { status: 500 })
  }
}

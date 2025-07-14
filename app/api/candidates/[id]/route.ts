import { type NextRequest, NextResponse } from "next/server"
import { supabaseOperations } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const candidateData = await request.json()
    const candidate = await supabaseOperations.updateCandidate(params.id, candidateData)
    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Error updating candidate:", error)
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await supabaseOperations.deleteCandidate(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting candidate:", error)
    return NextResponse.json({ error: "Failed to delete candidate" }, { status: 500 })
  }
}

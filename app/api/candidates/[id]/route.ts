import { type NextRequest, NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const candidateData = await request.json()
    const candidate = await databaseOperations.updateCandidate(params.id, candidateData)
    return NextResponse.json(candidate)
  } catch (error) {
    console.error("Error updating candidate:", error)
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await databaseOperations.deleteCandidate(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting candidate:", error)
    return NextResponse.json({ error: "Failed to delete candidate" }, { status: 500 })
  }
}
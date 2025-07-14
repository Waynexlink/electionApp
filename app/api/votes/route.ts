import { type NextRequest, NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const voteData = await request.json()
    const vote = await databaseOperations.submitVote(voteData)
    return NextResponse.json(vote)
  } catch (error: any) {
    console.error("Error submitting vote:", error)
    
    if (error.message === "User has already voted for this position") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 })
  }
}
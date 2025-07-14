import { type NextRequest, NextResponse } from "next/server"
import { supabaseOperations } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const voteData = await request.json()

    // Check if user has already voted for this post
    const existingVotes = await supabaseOperations.getUserVotes(voteData.user_id)
    const hasVoted = existingVotes.some((vote) => vote.post_id === voteData.post_id)

    if (hasVoted) {
      return NextResponse.json({ error: "User has already voted for this position" }, { status: 400 })
    }

    const vote = await supabaseOperations.submitVote(voteData)
    return NextResponse.json(vote)
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 })
  }
}

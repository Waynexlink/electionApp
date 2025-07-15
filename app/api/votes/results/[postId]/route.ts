import { NextRequest, NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const results = await databaseOperations.getPostResults(params.postId)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching post results:", error)
    return NextResponse.json({ error: "Failed to fetch post results" }, { status: 500 })
  }
}
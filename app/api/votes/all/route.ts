import { NextRequest, NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"
import { authService } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const { user, error } = await authService.verifyToken(token)
    if (error || !user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const votes = await databaseOperations.getAllVotes()
    return NextResponse.json(votes)
  } catch (error) {
    console.error("Error fetching all votes:", error)
    return NextResponse.json({ error: "Failed to fetch all votes" }, { status: 500 })
  }
}
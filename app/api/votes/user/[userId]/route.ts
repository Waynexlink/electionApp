import { NextRequest, NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"
import { authService } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const { user, error } = await authService.verifyToken(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Only allow users to fetch their own votes or admins to fetch any votes
    if (user.id !== params.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const votes = await databaseOperations.getUserVotes(params.userId)
    return NextResponse.json(votes)
  } catch (error) {
    console.error("Error fetching user votes:", error)
    return NextResponse.json({ error: "Failed to fetch user votes" }, { status: 500 })
  }
}
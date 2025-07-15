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

    const voters = await databaseOperations.getEligibleVoters()
    return NextResponse.json(voters)
  } catch (error) {
    console.error("Error fetching eligible voters:", error)
    return NextResponse.json({ error: "Failed to fetch eligible voters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const voterData = await request.json()
    const voter = await databaseOperations.addEligibleVoter(voterData)
    return NextResponse.json(voter)
  } catch (error) {
    console.error("Error adding eligible voter:", error)
    return NextResponse.json({ error: "Failed to add eligible voter" }, { status: 500 })
  }
}
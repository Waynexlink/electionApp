import { NextResponse } from "next/server"
import { databaseOperations } from "@/lib/database"

export async function GET() {
  try {
    const elections = await databaseOperations.getElections()
    return NextResponse.json(elections)
  } catch (error) {
    console.error("Error fetching elections:", error)
    return NextResponse.json({ error: "Failed to fetch elections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const electionData = await request.json()
    const election = await databaseOperations.createElection(electionData)
    return NextResponse.json(election)
  } catch (error) {
    console.error("Error creating election:", error)
    return NextResponse.json({ error: "Failed to create election" }, { status: 500 })
  }
}
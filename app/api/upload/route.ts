import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`candidates/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

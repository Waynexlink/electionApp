import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ success: result.result === "ok" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

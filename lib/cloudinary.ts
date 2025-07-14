// Cloudinary configuration and utilities
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export interface UploadResult {
  url: string
  publicId: string
  error?: string
}

// Check if Cloudinary is properly configured
export const isCloudinaryConfigured = (): boolean => {
  return !!(CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset)
}

// Upload image to Cloudinary with retry logic
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  // If Cloudinary isn't configured, use local fallback
  if (!isCloudinaryConfigured()) {
    return uploadLocalFallback(file)
  }

  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset)
      formData.append("folder", "voting-platform/candidates")

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result: CloudinaryUploadResult = await response.json()

      return {
        url: result.secure_url,
        publicId: result.public_id,
      }
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error)

      if (attempt === maxRetries) {
        // After all retries fail, use local fallback
        return uploadLocalFallback(file)
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  return uploadLocalFallback(file)
}

// Local fallback for when Cloudinary isn't available
export async function uploadLocalFallback(file: File): Promise<UploadResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Generate a pseudo-unique ID for the file
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 10)
      const pseudoId = `local_${timestamp}_${randomId}`

      // Use the data URL as the image URL
      resolve({
        url: e.target?.result as string,
        publicId: pseudoId,
      })
    }
    reader.onerror = () => {
      resolve({
        url: "/placeholder.svg",
        publicId: "placeholder",
        error: "Failed to read file",
      })
    }
    reader.readAsDataURL(file)
  })
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  // Skip deletion for local images
  if (publicId.startsWith("local_") || !isCloudinaryConfigured()) {
    return true
  }

  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    return response.ok
  } catch (error) {
    console.error("Delete failed:", error)
    return false
  }
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: "auto" | number
    format?: "auto" | "webp" | "jpg" | "png"
  } = {},
): string {
  // For local images (data URLs), return as is
  if (publicId.startsWith("local_") || publicId.startsWith("data:") || !isCloudinaryConfigured()) {
    return publicId
  }

  const { width = 400, height = 400, quality = "auto", format = "auto" } = options

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/${publicId}`
}

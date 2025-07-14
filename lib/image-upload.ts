// Utility functions for image upload
export interface UploadResult {
  url: string
  error?: string
}

// Mock upload function for demo
export async function uploadCandidateImage(file: File): Promise<UploadResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, this would upload to Vercel Blob, Cloudinary, etc.
      const mockUrl = `/images/candidates/${Date.now()}-${file.name}`
      resolve({ url: mockUrl })
    }, 1500)
  })
}

// Production-ready upload function using Vercel Blob
export async function uploadToVercelBlob(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const { url } = await response.json()
    return { url }
  } catch (error) {
    return {
      url: "",
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

// Utility to validate image files
export function validateImageFile(file: File, maxSizeMB = 5): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file"
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image size must be less than ${maxSizeMB}MB`
  }

  return null
}

// Utility to create image preview
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

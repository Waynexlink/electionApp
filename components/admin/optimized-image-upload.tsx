"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"
import { uploadToCloudinary, isCloudinaryConfigured, type UploadResult } from "@/lib/cloudinary"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OptimizedImageUploadProps {
  value?: string
  publicId?: string
  onChange: (result: UploadResult) => void
  label?: string
  maxSize?: number // in MB
  className?: string
}

export function OptimizedImageUpload({
  value,
  publicId,
  onChange,
  label = "Upload Image",
  maxSize = 5,
  className = "",
}: OptimizedImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const cloudinaryConfigured = isCloudinaryConfigured()

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/")) {
        return "Please select an image file"
      }

      if (file.size > maxSize * 1024 * 1024) {
        return `Image size must be less than ${maxSize}MB`
      }

      return null
    },
    [maxSize],
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setUploading(true)
      setError("")
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      try {
        // Create local preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to Cloudinary or use local fallback
        const result = await uploadToCloudinary(file)

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (result.error) {
          setError(result.error)
          setPreview("")
        } else {
          // Use the URL from the result
          setPreview(result.url)
          onChange(result)
        }
      } catch (err) {
        clearInterval(progressInterval)
        const errorMessage = err instanceof Error ? err.message : "Upload failed"
        setError(errorMessage)
        setPreview("")
      } finally {
        setUploading(false)
        setTimeout(() => setUploadProgress(0), 1000)
      }
    },
    [validateFile, onChange],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = () => {
    setPreview("")
    setError("")
    onChange({ url: "", publicId: "" })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {!cloudinaryConfigured && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Cloudinary is not configured. Images will be stored locally and won't persist after page refresh.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {preview && !uploading ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative inline-block">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
                loading="lazy"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeImage}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
              {uploadProgress === 100 && (
                <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : !uploading ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Drop an image here, or click to select</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to {maxSize}MB</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <Label
                htmlFor="image-upload"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? "Uploading..." : "Select Image"}
              </Label>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

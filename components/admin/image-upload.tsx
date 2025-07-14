"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (file: File | null, previewUrl: string) => void
  label?: string
  maxSize?: number // in MB
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  maxSize = 5,
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview("")
      onChange(null, "")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image size must be less than ${maxSize}MB`)
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string
      setPreview(previewUrl)
      onChange(file, previewUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileChange(files[0])
    }
  }

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
    onChange(null, "")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative inline-block">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

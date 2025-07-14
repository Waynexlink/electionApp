"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  )
}

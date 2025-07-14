"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { prefetchCandidates, prefetchElectionData } from "@/lib/data-cache"
import { supabaseOperations } from "@/lib/supabase"

// Lazy load components
import { ElectionCountdown, PostsListPersistent as PostsList } from "@/components/posts-list-persistent"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [election, setElection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check if user is logged in
      const currentUser = localStorage.getItem("currentUser")
      if (!currentUser) {
        router.push("/")
        return
      }

      const userData = JSON.parse(currentUser)
      if (userData.role === "admin") {
        router.push("/admin")
        return
      }

      setUser(userData)

      // Prefetch critical data
      try {
        const activeElections = await supabaseOperations.getElections()
        const electionData = activeElections.length > 0 ? activeElections[0] : null
        setElection(electionData)

        // Prefetch in background
        if (electionData) {
          // These prefetch functions are still using mockData internally.
          // We will update them in a later step if needed, or remove them if not used.
          // For now, they won't fetch from Supabase directly.
          prefetchElectionData(electionData.id)
          prefetchCandidates(electionData.id)
        }
      } catch (error) {
        console.error("Failed to initialize dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [router])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="glass-card rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 text-lg">Ready to make your voice heard? Cast your votes below.</p>
            </div>
          </div>
        </div>

        {election && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Suspense fallback={<CountdownSkeleton />}>
              <ElectionCountdown endTime={election.end_time} title={election.title} />
            </Suspense>
          </div>
        )}

        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Positions</h2>
          <p className="text-gray-600">Click on any position to view candidates and cast your vote</p>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Suspense fallback={<PostsListSkeleton />}>
            <PostsList userId={user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

// Loading skeletons
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </main>
    </div>
  )
}

function CountdownSkeleton() {
  return <Skeleton className="h-48 w-full rounded-2xl" />
}

function PostsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-48 rounded-2xl" />
      ))}
    </div>
  )
}

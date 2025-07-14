"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ResultsView } from "@/components/results-view"

interface ResultsPageProps {
  params: {
    postId: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const [user, setUser] = useState<any>(null)
  const [userVote, setUserVote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Verify user has voted for this post
    const userVotes = JSON.parse(localStorage.getItem("userVotes") || "{}")
    const vote = userVotes[params.postId]

    if (!vote) {
      router.push(`/vote/${params.postId}`)
      return
    }

    setUserVote(vote)
    setLoading(false)
  }, [params.postId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userVote || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResultsView postId={params.postId} userVoteId={userVote.candidate_id} />
    </div>
  )
}

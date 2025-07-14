"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VotingInterface } from "@/components/voting-interface"
import { supabaseOperations } from "@/lib/supabase"

interface VotePageProps {
  params: {
    postId: string
  }
}

export default function VotePage({ params }: VotePageProps) {
  const [user, setUser] = useState<any>(null)
  const [post, setPost] = useState<any>(null)
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

    // Check if user has already voted for this post
    const userVotes = JSON.parse(localStorage.getItem("userVotes") || "{}")
    if (userVotes[params.postId]) {
      router.push(`/results/${params.postId}`)
      return
    }

    const fetchData = async () => {
      try {
        const postsData = await supabaseOperations.getPosts(params.postId)
        const postData = postsData.find((p) => p.id === params.postId) // Filter by postId

        if (!postData) {
          router.push("/dashboard")
          return
        }

        const candidatesData = await supabaseOperations.getCandidates([params.postId])
        const electionData = (await supabaseOperations.getElections()).find((e) => e.id === postData.election_id)

        if (!electionData) {
          router.push("/dashboard")
          return
        }

        // Check if election is still active
        const now = new Date()
        const endTime = new Date(electionData.end_time)

        if (now > endTime) {
          router.push("/dashboard")
          return
        }

        setPost({
          ...postData,
          candidates: candidatesData,
          elections: electionData,
        })
      } catch (error) {
        console.error("Error fetching voting data:", error)
        router.push("/dashboard") // Redirect on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.postId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!post || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VotingInterface post={post} userId={user.id} />
    </div>
  )
}

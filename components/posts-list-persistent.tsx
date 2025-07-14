"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, Clock, Vote, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Post {
  id: string
  title: string
  description: string
  candidates: Array<{
    id: string
    name: string
  }>
  user_voted: boolean
}

interface PostsListPersistentProps {
  electionId?: string
  userId: string
}

export function PostsListPersistent({ userId }: PostsListPersistentProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: elections, error: electionsError } = await supabase
          .from("elections")
          .select("id")
          .eq("is_active", true)
          .limit(1)

        if (electionsError) throw electionsError
        if (!elections || elections.length === 0) {
          setLoading(false)
          return
        }

        const electionId = elections[0].id

        const { data: electionPosts, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("election_id", electionId)
          .order("title")

        if (postsError) throw postsError

        const { data: allCandidates, error: candidatesError } = await supabase
          .from("candidates")
          .select("id, name, post_id")

        if (candidatesError) throw candidatesError

        const { data: userVotes, error: votesError } = await supabase
          .from("votes")
          .select("post_id")
          .eq("user_id", userId)

        if (votesError) throw votesError

        const votedPostIds = new Set(userVotes?.map((v) => v.post_id) || [])

        const postsWithCandidates =
          electionPosts?.map((post) => {
            const candidates = allCandidates?.filter((c) => c.post_id === post.id) || []
            const userVoted = votedPostIds.has(post.id)

            return {
              ...post,
              candidates: candidates.map((c) => ({ id: c.id, name: c.name })),
              user_voted: userVoted,
            }
          }) || []

        setPosts(postsWithCandidates)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="glass-card border-0 shadow-lg rounded-2xl animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="glass-card border-0 shadow-lg rounded-2xl">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Elections</h3>
          <p className="text-gray-600">There are currently no active positions to vote for.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Card
          key={post.id}
          className={`glass-card border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group ${
            post.user_voted
              ? "ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50"
              : "hover:ring-2 hover:ring-emerald-200"
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1 line-clamp-2">{post.description}</CardDescription>
              </div>
              {post.user_voted && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-2 flex-shrink-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Voted
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">{post.candidates.length} candidates</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-emerald-600">
                <Vote className="h-4 w-4" />
                <span className="font-medium">Active</span>
              </div>
            </div>

            {post.user_voted ? (
              <Link href={`/results/${post.id}`}>
                <Button
                  variant="outline"
                  className="w-full h-12 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl font-semibold transition-all duration-200 group bg-transparent"
                >
                  View Results
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link href={`/vote/${post.id}`}>
                <Button className="w-full h-12 bg-green-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] group">
                  Vote Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ElectionCountdown({ endTime, title }: { endTime: string; title: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft("Election has ended")
        clearInterval(interval)
        return
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="glass-card p-6 rounded-2xl shadow-md bg-gradient-to-r from-emerald-50 to-green-50">
      <h2 className="text-xl font-bold text-emerald-700 mb-2">{title}</h2>
      <p className="text-gray-800">Election ends in: <span className="font-semibold">{timeLeft}</span></p>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Users, Vote, CheckCircle } from "lucide-react"
import Link from "next/link"
import { supabaseOperations } from "@/lib/supabase"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
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

    const fetchData = async () => {
      try {
        const allElections = await supabaseOperations.getElections()
        const activeElection = allElections.length > 0 ? allElections[0] : null

        if (!activeElection) {
          router.push("/dashboard") // No active election, redirect
          return
        }

        const allPosts = await supabaseOperations.getPosts(activeElection.id)
        const userVotes = await supabaseOperations.getUserVotes(userData.id)
        const votedPostIds = new Set(userVotes.map((v) => v.post_id))

        // Check if user has completed voting for all positions
        const totalPositions = allPosts.length
        const votedPositionsCount = votedPostIds.size

        if (votedPositionsCount < totalPositions) {
          // User hasn't completed voting for all positions, redirect to dashboard
          router.push("/dashboard")
          return
        }

        const positionResultsPromises = allPosts.map(async (post) => {
          const { candidates: candidateResults, total_votes: totalVotes } = await supabaseOperations.getPostResults(
            post.id,
          )
          const userVoteForPost = userVotes.find((v) => v.post_id === post.id)

          return {
            ...post,
            candidates: candidateResults,
            total_votes: totalVotes,
            user_vote: userVoteForPost,
          }
        })

        const positionResults = await Promise.all(positionResultsPromises)
        setResults(positionResults)
      } catch (error) {
        console.error("Error fetching home page data:", error)
        router.push("/dashboard") // Redirect on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalVotes = results.reduce((sum, result) => sum + result.total_votes, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Election Results Overview</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Voting Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Voting!</h2>
          <p className="text-gray-600">
            You have successfully cast your votes for all positions. Here's a live overview of the election results.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results.reduce((sum, result) => sum + result.candidates.length, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Votes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
              <p className="text-xs text-muted-foreground">All positions voted</p>
            </CardContent>
          </Card>
        </div>

        {/* Results by Position */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Live Results by Position</h3>

          <div className="grid gap-6">
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{result.title}</CardTitle>
                      <CardDescription>{result.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Vote className="h-3 w-3 mr-1" />
                      {result.total_votes} votes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.candidates.map((candidate: any, index: number) => (
                      <div key={candidate.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                      ? "bg-orange-600"
                                      : "bg-gray-300"
                              }`}
                            >
                              {index === 0 ? <Trophy className="h-4 w-4" /> : index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.image_url || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{candidate.name}</p>
                                {result.user_vote?.candidate_id === candidate.id && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                    Your Vote
                                  </Badge>
                                )}
                              </div>
                              {candidate.department && <p className="text-sm text-gray-600">{candidate.department}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{candidate.vote_count}</p>
                            <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                          </div>
                        </div>
                        <Progress value={candidate.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Election Transparency</h3>
              <p className="text-blue-700">
                All votes are recorded securely and anonymously. Results are updated in real-time as votes are cast.
                Your participation helps ensure a democratic and transparent election process.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

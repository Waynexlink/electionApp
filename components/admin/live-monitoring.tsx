"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, Users } from "lucide-react"
import { supabaseOperations } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Election {
  id: string
  title: string
  start_time: string
  end_time: string
  is_active: boolean
}

interface Post {
  id: string
  title: string
  election_id: string
}

interface Candidate {
  id: string
  name: string
  post_id: string
}

interface Vote {
  id: string
  user_id: string
  post_id: string
  candidate_id: string
  created_at: string
}

export function LiveMonitoring() {
  const [elections, setElections] = useState<Election[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const electionsData = await supabaseOperations.getElections()
      const electionId = electionsData?.[0]?.id

      const [postsData, candidatesData, votesData] = await Promise.all([
        electionId ? supabaseOperations.getPosts(electionId) : Promise.resolve([]),
        supabaseOperations.getCandidates(),
        supabaseOperations.getAllVotes(),
      ])

      setElections(Array.isArray(electionsData) ? electionsData : [])
      setPosts(postsData || [])
      setCandidates(candidatesData || [])
      setVotes(votesData || [])
    } catch (error) {
      console.error("Error fetching live monitoring data:", error)
      toast({
        title: "Error",
        description: "Failed to load live monitoring data from database.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const totalElections = elections.length
  const totalPosts = posts.length
  const totalCandidates = candidates.length
  const totalVotes = votes.length

  const votesPerPost = posts.map((post) => {
    const count = votes.filter((vote) => vote.post_id === post.id).length
    return { postTitle: post.title, count }
  })

  const votesPerCandidate = candidates.map((candidate) => {
    const count = votes.filter((vote) => vote.candidate_id === candidate.id).length
    return { candidateName: candidate.name, count }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Live Monitoring</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Live Monitoring</h2>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Votes per Post</CardTitle>
          </CardHeader>
          <CardContent>
            {votesPerPost.length > 0 ? (
              <ul className="space-y-2">
                {votesPerPost.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.postTitle}</span>
                    <span className="font-bold">{item.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No posts or votes recorded yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Votes per Candidate (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            {votesPerCandidate.length > 0 ? (
              <ul className="space-y-2">
                {votesPerCandidate
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{item.candidateName}</span>
                      <span className="font-bold">{item.count}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No candidates or votes recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

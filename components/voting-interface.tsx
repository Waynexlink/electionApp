"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface Candidate {
  _id: string
  name: string
  department: string
  image_url?: string
  post_id: string
}

interface Post {
  _id: string
  title: string
  description: string
  election_id: string
}

interface VotingInterfaceProps {
  post: Post & { candidates: Candidate[] }
  userId: string
}

export function VotingInterface({ post, userId }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`/api/votes/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const userVotes = await response.json()
          const votedForThisPost = userVotes.some((vote: any) => vote.post_id === post._id)
          setHasVoted(votedForThisPost)
        }
      } catch (error) {
        console.error("Error checking voting status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkVotingStatus()
  }, [post._id, userId])

  const handleSubmitVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "Error",
        description: "Please select a candidate.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: post._id,
          candidate_id: selectedCandidate,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit vote')
      }

      setHasVoted(true)
      toast({
        title: "Vote Cast!",
        description: "Your vote has been successfully recorded.",
        variant: "default",
      })

      // Redirect to results page
      setTimeout(() => {
        router.push(`/results/${post._id}`)
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting vote:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }

  if (hasVoted) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold mb-2">Vote Already Cast</CardTitle>
        <CardDescription className="text-gray-600 mb-4">
          You have already cast your vote for the "{post.title}" position.
        </CardDescription>
        <Button onClick={() => router.push(`/results/${post._id}`)}>View Results</Button>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-gray-800">{post.title}</CardTitle>
        <CardDescription className="text-gray-600">{post.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        <RadioGroup
          onValueChange={setSelectedCandidate}
          value={selectedCandidate || ""}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {post.candidates.map((candidate) => (
            <Label
              key={candidate._id}
              htmlFor={candidate._id}
              className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 text-card-foreground hover:bg-gray-50 cursor-pointer transition-all duration-200 has-[[data-state=checked]]:border-emerald-500 has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-emerald-500"
            >
              <RadioGroupItem id={candidate._id} value={candidate._id} className="sr-only" />
              {candidate.image_url && (
                <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={candidate.image_url || "/placeholder.svg"}
                    alt={candidate.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.department}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-center px-8 pb-8">
        <Button
          onClick={handleSubmitVote}
          disabled={!selectedCandidate || submitting || hasVoted}
          className="w-full md:w-auto px-8 h-12 bg-green-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {submitting ? "Submitting Vote..." : "Cast My Vote"}
        </Button>
      </CardFooter>
    </Card>
  )
}
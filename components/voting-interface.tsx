"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import Image from "next/image"
import { supabaseOperations } from "@/lib/supabase"
import { authService, type User } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface Candidate {
  id: string
  name: string
  department: string
  image_url?: string
  post_id: string
}

interface Post {
  id: string
  title: string
  description: string
  election_id: string
}

interface VotingInterfaceProps {
  postId: string
}

export function VotingInterface({ postId }: VotingInterfaceProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [voteStatus, setVoteStatus] = useState<"idle" | "success" | "error">("idle")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch the specific post
        const allPosts = await supabaseOperations.getPosts("") // Fetch all posts to find the specific one
        const currentPost = allPosts.find((p: Post) => p.id === postId)
        setPost(currentPost || null)

        // Fetch candidates for this post
        const candidatesData = await supabaseOperations.getCandidates([postId])
        setCandidates(candidatesData || [])

        // Check if user has already voted for this post
        if (user) {
          const userVotes = await supabaseOperations.getUserVotes(user.id)
          const votedForThisPost = userVotes.some((vote: any) => vote.post_id === postId)
          setHasVoted(votedForThisPost)
        }
      } catch (error) {
        console.error("Error fetching voting data:", error)
        toast({
          title: "Error",
          description: "Failed to load voting information.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [postId, currentUser?.id])

  const handleSubmitVote = async () => {
    if (!selectedCandidate || !currentUser || !post) {
      toast({
        title: "Error",
        description: "Please select a candidate and ensure you are logged in.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      await supabaseOperations.submitVote({
        user_id: currentUser.id,
        post_id: post.id,
        candidate_id: selectedCandidate,
      })
      setVoteStatus("success")
      setHasVoted(true) // Update state to reflect that the user has voted
      toast({
        title: "Vote Cast!",
        description: "Your vote has been successfully recorded.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error submitting vote:", error)
      setVoteStatus("error")
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
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
          <Skeleton className="h-48 w-full" />
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

  if (!currentUser) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
        <CardDescription className="text-gray-600 mb-4">
          You must be logged in to cast your vote. Please sign in to continue.
        </CardDescription>
        <Button onClick={() => router.push("/")}>Go to Login</Button>
      </Card>
    )
  }

  if (hasVoted) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold mb-2">Vote Already Cast</CardTitle>
        <CardDescription className="text-gray-600 mb-4">
          You have already cast your vote for the &quot;{post?.title}&quot; position.
        </CardDescription>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </Card>
    )
  }

  if (!post) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold mb-2">Post Not Found</CardTitle>
        <CardDescription className="text-gray-600 mb-4">
          The voting post you are looking for does not exist or is no longer active.
        </CardDescription>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
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
          {candidates.map((candidate) => (
            <Label
              key={candidate.id}
              htmlFor={candidate.id}
              className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 text-card-foreground hover:bg-gray-50 cursor-pointer transition-all duration-200 has-[[data-state=checked]]:border-emerald-500 has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-emerald-500"
            >
              <RadioGroupItem id={candidate.id} value={candidate.id} className="sr-only" />
              {candidate.image_url && (
                <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={candidate.image_url || "/placeholder.svg"}
                    alt={candidate.name}
                    fill
                    objectFit="cover"
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

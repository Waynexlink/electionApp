import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createServerSideClient } from "@supabase/supabase-js" // Import for server-side client

// Create Supabase client for client-side operations
export const createClient = () => {
  return createClientComponentClient()
}

// Server-side client for API routes or Server Components (using service role key for elevated privileges)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Role Key environment variables.")
  }

  // Use createClient from @supabase/supabase-js for server-side with service role key
  return createServerSideClient(supabaseUrl, supabaseServiceKey)
}

// Database functions for persistent storage
export const supabaseOperations = {
  // Get all elections
  async getElections() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .eq("is_active", true)
      .order("start_time", { ascending: false })

    if (error) throw error
    return data
  },

  // Get posts for an election
  async getPosts(electionId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("posts").select("*").eq("election_id", electionId).order("title")

    if (error) throw error
    return data
  },

  // Get candidates for posts
  async getCandidates(postIds?: string[]) {
    const supabase = createClient()
    let query = supabase.from("candidates").select("*").order("name")

    if (postIds && postIds.length > 0) {
      query = query.in("post_id", postIds)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Add candidate
  async addCandidate(candidateData: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from("candidates").insert([candidateData]).select()

    if (error) throw error
    return data[0]
  },

  // Update candidate
  async updateCandidate(id: string, candidateData: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from("candidates").update(candidateData).eq("id", id).select()

    if (error) throw error
    return data[0]
  },

  // Delete candidate
  async deleteCandidate(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("candidates").delete().eq("id", id)

    if (error) throw error
  },

  // Submit vote
  async submitVote(voteData: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from("votes").insert([voteData]).select().single()

    if (error) throw error
    return data
  },

  // Get user votes
  async getUserVotes(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("votes").select("post_id, candidate_id").eq("user_id", userId)

    if (error) throw error
    return data
  },

  // Get vote results for a post
  async getPostResults(postId: string) {
    const supabase = createClient()
    const { data: votes, error: votesError } = await supabase.from("votes").select("candidate_id").eq("post_id", postId)

    if (votesError) throw votesError

    const { data: candidates, error: candidatesError } = await supabase
      .from("candidates")
      .select("id, name, department, image_url, image_public_id")
      .eq("post_id", postId)

    if (candidatesError) throw candidatesError

    const resultsMap = new Map<string, { count: number; candidate: any }>()
    candidates?.forEach((c) => {
      resultsMap.set(c.id, { count: 0, candidate: c })
    })

    votes?.forEach((vote) => {
      if (resultsMap.has(vote.candidate_id)) {
        resultsMap.get(vote.candidate_id)!.count++
      }
    })

    const totalVotes = votes?.length || 0
    const finalResults = Array.from(resultsMap.values())
      .map((item) => ({
        ...item.candidate,
        vote_count: item.count,
        percentage: totalVotes > 0 ? (item.count / totalVotes) * 100 : 0,
      }))
      .sort((a, b) => b.vote_count - a.vote_count)

    return { candidates: finalResults, total_votes: totalVotes }
  },

  // Get eligible voters
  async getEligibleVoters() {
    const supabase = createClient()
    const { data, error } = await supabase.from("eligible_voters").select("*").order("name")

    if (error) throw error
    return data
  },

  // Register user (this function is now primarily for inserting into 'profiles' table after Supabase Auth signUp)
  async registerUser(userData: { email: string; name: string; matric_no: string; role: string }) {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").insert([userData]).select().single()

    if (error) throw error
    return data
  },

  // Get user by email (from profiles table)
  async getUserByEmail(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

    if (error && error.code === "PGRST116") {
      // No rows found
      return null
    }
    if (error) throw error
    return data
  },

  // Get all users (profiles) - for admin view
  async getAllUsers() {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").order("name")

    if (error) throw error
    return data
  },

  // Get all votes (for admin monitoring)
  async getAllVotes() {
    const supabase = createClient()
    const { data, error } = await supabase.from("votes").select("*")

    if (error) throw error
    return data
  },
}

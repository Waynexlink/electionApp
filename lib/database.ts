import connectDB from './mongodb'
import User from '@/models/User'
import EligibleVoter from '@/models/EligibleVoter'
import Election from '@/models/Election'
import Post from '@/models/Post'
import Candidate from '@/models/Candidate'
import Vote from '@/models/Vote'
import mongoose from 'mongoose'

export const databaseOperations = {
  // Elections
  async getElections() {
    await connectDB()
    return await Election.find({ is_active: true }).sort({ start_time: -1 }).lean()
  },

  async createElection(electionData: any) {
    await connectDB()
    const election = new Election(electionData)
    return await election.save()
  },

  // Posts
  async getPosts(electionId?: string) {
    await connectDB()
    const query = electionId ? { election_id: new mongoose.Types.ObjectId(electionId) } : {}
    return await Post.find(query).sort({ title: 1 }).lean()
  },

  async createPost(postData: any) {
    await connectDB()
    const post = new Post(postData)
    return await post.save()
  },

  // Candidates
  async getCandidates(postIds?: string[]) {
    await connectDB()
    const query = postIds && postIds.length > 0 
      ? { post_id: { $in: postIds.map(id => new mongoose.Types.ObjectId(id)) } }
      : {}
    return await Candidate.find(query).sort({ name: 1 }).lean()
  },

  async addCandidate(candidateData: any) {
    await connectDB()
    const candidate = new Candidate(candidateData)
    return await candidate.save()
  },

  async updateCandidate(id: string, candidateData: any) {
    await connectDB()
    return await Candidate.findByIdAndUpdate(id, candidateData, { new: true }).lean()
  },

  async deleteCandidate(id: string) {
    await connectDB()
    return await Candidate.findByIdAndDelete(id)
  },

  // Votes
  async submitVote(voteData: any) {
    await connectDB()
    
    // Check if user has already voted for this post
    const existingVote = await Vote.findOne({
      post_id: new mongoose.Types.ObjectId(voteData.post_id),
      user_id: new mongoose.Types.ObjectId(voteData.user_id)
    })

    if (existingVote) {
      throw new Error("User has already voted for this position")
    }

    const vote = new Vote({
      post_id: new mongoose.Types.ObjectId(voteData.post_id),
      candidate_id: new mongoose.Types.ObjectId(voteData.candidate_id),
      user_id: new mongoose.Types.ObjectId(voteData.user_id)
    })

    return await vote.save()
  },

  async getUserVotes(userId: string) {
    await connectDB()
    return await Vote.find({ user_id: new mongoose.Types.ObjectId(userId) })
      .select('post_id candidate_id')
      .lean()
  },

  async getPostResults(postId: string) {
    await connectDB()
    
    // Get all votes for this post
    const votes = await Vote.find({ post_id: new mongoose.Types.ObjectId(postId) }).lean()
    
    // Get all candidates for this post
    const candidates = await Candidate.find({ post_id: new mongoose.Types.ObjectId(postId) }).lean()
    
    // Count votes for each candidate
    const voteCount = votes.reduce((acc: any, vote) => {
      const candidateId = vote.candidate_id.toString()
      acc[candidateId] = (acc[candidateId] || 0) + 1
      return acc
    }, {})

    const totalVotes = votes.length

    // Format results
    const results = candidates.map(candidate => ({
      ...candidate,
      id: candidate._id.toString(),
      vote_count: voteCount[candidate._id.toString()] || 0,
      percentage: totalVotes > 0 ? ((voteCount[candidate._id.toString()] || 0) / totalVotes) * 100 : 0
    })).sort((a, b) => b.vote_count - a.vote_count)

    return {
      candidates: results,
      total_votes: totalVotes
    }
  },

  async getAllVotes() {
    await connectDB()
    return await Vote.find().lean()
  },

  // Eligible Voters
  async getEligibleVoters() {
    await connectDB()
    return await EligibleVoter.find().sort({ name: 1 }).lean()
  },

  async addEligibleVoter(voterData: any) {
    await connectDB()
    const voter = new EligibleVoter(voterData)
    return await voter.save()
  },

  // Users
  async getAllUsers() {
    await connectDB()
    return await User.find().select('-password').sort({ name: 1 }).lean()
  },

  async getUserByEmail(email: string) {
    await connectDB()
    return await User.findOne({ email: email.toLowerCase() }).select('-password').lean()
  },

  async getUserById(id: string) {
    await connectDB()
    return await User.findById(id).select('-password').lean()
  }
}
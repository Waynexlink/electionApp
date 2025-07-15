// MongoDB operations for the voting platform
import { databaseOperations } from './database'

// Replace all Supabase operations with MongoDB operations
export const supabaseOperations = {
  // Elections
  async getElections() {
    const response = await fetch('/api/elections')
    if (!response.ok) throw new Error('Failed to fetch elections')
    return response.json()
  },

  async createElection(electionData: any) {
    const response = await fetch('/api/elections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(electionData)
    })
    if (!response.ok) throw new Error('Failed to create election')
    return response.json()
  },

  // Posts
  async getPosts(electionId?: string) {
    const url = electionId ? `/api/posts?electionId=${electionId}` : '/api/posts'
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch posts')
    return response.json()
  },

  async createPost(postData: any) {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    if (!response.ok) throw new Error('Failed to create post')
    return response.json()
  },

  // Candidates
  async getCandidates(postIds?: string[]) {
    const url = postIds ? `/api/candidates?postIds=${postIds.join(',')}` : '/api/candidates'
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch candidates')
    return response.json()
  },

  async addCandidate(candidateData: any) {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    })
    if (!response.ok) throw new Error('Failed to add candidate')
    return response.json()
  },

  async updateCandidate(id: string, candidateData: any) {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    })
    if (!response.ok) throw new Error('Failed to update candidate')
    return response.json()
  },

  async deleteCandidate(id: string) {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete candidate')
    return response.json()
  },

  // Votes
  async submitVote(voteData: any) {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(voteData)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit vote')
    }
    return response.json()
  },

  async getUserVotes(userId: string) {
    const token = localStorage.getItem('authToken')
    const response = await fetch(`/api/votes/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch user votes')
    return response.json()
  },

  async getPostResults(postId: string) {
    const response = await fetch(`/api/votes/results/${postId}`)
    if (!response.ok) throw new Error('Failed to fetch post results')
    return response.json()
  },

  async getAllVotes() {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/votes/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch all votes')
    return response.json()
  },

  // Users
  async getAllUsers() {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async getEligibleVoters() {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/eligible-voters', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch eligible voters')
    return response.json()
  },

  async addEligibleVoter(voterData: any) {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/eligible-voters', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(voterData)
    })
    if (!response.ok) throw new Error('Failed to add eligible voter')
    return response.json()
  }
}

// Mock data removed - all operations now use MongoDB via API routes
export const mockData = {
  elections: [],
  posts: [],
  candidates: [],
  votes: []
}
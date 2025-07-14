// Data caching and prefetching utilities
import { supabaseOperations } from "./supabase"

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlMinutes = 60): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const dataCache = new DataCache()

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      const delay = baseDelay * attempt
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error("Max retries exceeded")
}

// Prefetch functions
export async function prefetchCandidates(electionId: string): Promise<void> {
  const cacheKey = `candidates-${electionId}`

  if (dataCache.get(cacheKey)) {
    return // Already cached
  }

  try {
    const candidates = await retryWithBackoff(async () => {
      const posts = await supabaseOperations.getPosts(electionId)
      const postIds = posts.map((p) => p.id)
      return await supabaseOperations.getCandidates(postIds)
    })

    dataCache.set(cacheKey, candidates, 60) // Cache for 1 hour
  } catch (error) {
    console.error("Failed to prefetch candidates:", error)
  }
}

export async function prefetchElectionData(electionId: string): Promise<void> {
  const cacheKey = `election-${electionId}`

  if (dataCache.get(cacheKey)) {
    return
  }

  try {
    const election = await retryWithBackoff(async () => {
      const elections = await supabaseOperations.getElections()
      return elections.find((e) => e.id === electionId)
    })

    dataCache.set(cacheKey, election, 30) // Cache for 30 minutes
  } catch (error) {
    console.error("Failed to prefetch election data:", error)
  }
}

// Vote submission with retry
export async function submitVote(voteData: any): Promise<any> {
  return retryWithBackoff(
    async () => {
      return await supabaseOperations.submitVote(voteData)
    },
    3,
    1000,
  )
}

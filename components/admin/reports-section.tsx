"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw } from "lucide-react"
import { supabaseOperations } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
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
  vote_count: number
  percentage: number
  department: string
}

export function ReportsSection() {
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [results, setResults] = useState<{ [postId: string]: { candidates: Candidate[]; total_votes: number } }>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchElections = async () => {
    setLoading(true)
    try {
      const data = await supabaseOperations.getElections()
      setElections(data || [])
      if (data && data.length > 0) {
        setSelectedElectionId(data[0].id) // Select the first election by default
      }
    } catch (error) {
      console.error("Error fetching elections:", error)
      toast({
        title: "Error",
        description: "Failed to load elections for reports.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async (electionId: string) => {
    setLoading(true)
    try {
      const postsData = await supabaseOperations.getPosts(electionId)
      setPosts(postsData || [])

      const newResults: { [postId: string]: { candidates: Candidate[]; total_votes: number } } = {}
      for (const post of postsData) {
        const postResults = await supabaseOperations.getPostResults(post.id)
        newResults[post.id] = postResults
      }
      setResults(newResults)
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast({
        title: "Error",
        description: "Failed to load election reports.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchElections()
  }, [])

  useEffect(() => {
    if (selectedElectionId) {
      fetchReports(selectedElectionId)
    }
  }, [selectedElectionId])

  const handleExport = () => {
    // Logic to export data, e.g., as CSV or PDF
    console.log("Exporting report data...")
    toast({
      title: "Feature Not Implemented",
      description: "Report export is a demo feature. Implement backend logic for real functionality.",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Election Reports</h2>
          <p className="text-gray-600">View detailed results for past and ongoing elections</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => selectedElectionId && fetchReports(selectedElectionId)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="election-select" className="font-medium text-gray-700">
          Select Election:
        </label>
        <select
          id="election-select"
          className="p-2 border rounded-md"
          value={selectedElectionId || ""}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {selectedElectionId && posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title} Results</CardTitle>
              <CardDescription>Total Votes: {results[post.id]?.total_votes || 0}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Votes</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results[post.id]?.candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.department}</TableCell>
                      <TableCell className="text-right">{candidate.vote_count}</TableCell>
                      <TableCell className="text-right">{candidate.percentage.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No elections or posts found for reporting.</p>
      )}
    </div>
  )
}

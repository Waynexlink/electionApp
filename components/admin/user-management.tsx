"use client"

import { Skeleton } from "@/components/ui/skeleton"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, Users, UserCheck, UserX, RefreshCw } from "lucide-react"
import { supabaseOperations } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface EligibleVoter {
  matric_no: string
  name: string
  department: string
}

interface UserProfile {
  id: string
  email: string
  name: string
  matric_no: string
  role: string
}

interface Vote {
  user_id: string
  post_id: string
  candidate_id: string
  created_at: string
}

export function UserManagement() {
  const [eligibleVoters, setEligibleVoters] = useState<EligibleVoter[]>([])
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([])
  const [allVotes, setAllVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [votersData, usersData, votesData] = await Promise.all([
        supabaseOperations.getEligibleVoters(),
        supabaseOperations.getAllUsers(), // Fetch all profiles
        supabaseOperations.getAllVotes(), // Fetch all votes
      ])

      setEligibleVoters(votersData || [])
      setRegisteredUsers(usersData.filter((u: any) => u.role !== "admin") || [])
      setAllVotes(votesData || [])
    } catch (error) {
      console.error("Error fetching user management data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data from database.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would parse the CSV and update the database
      console.log("CSV file uploaded:", file.name)
      toast({
        title: "Feature Not Implemented",
        description: "CSV upload is a demo feature. Implement backend logic for real functionality.",
        variant: "default",
      })
    }
  }

  const exportData = () => {
    // In a real app, this would generate and download a CSV file
    console.log("Exporting user data...")
    toast({
      title: "Feature Not Implemented",
      description: "Data export is a demo feature. Implement backend logic for real functionality.",
      variant: "default",
    })
  }

  const getRegistrationStatus = (matricNo: string) => {
    return registeredUsers.some((u) => u.matric_no === matricNo)
  }

  const getVotingStatus = (matricNo: string) => {
    const userProfile = registeredUsers.find((u) => u.matric_no === matricNo)
    if (!userProfile) return false
    return allVotes.some((vote) => vote.user_id === userProfile.id)
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage eligible voters and track registration status</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            <label htmlFor="csv-upload" className="cursor-pointer">
              Upload CSV
            </label>
            <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eligible</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleVoters.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {eligibleVoters.length > 0
                ? `${Math.round((registeredUsers.length / eligibleVoters.length) * 100)}% of eligible`
                : "0% of eligible"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Registered</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleVoters.length - registeredUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voted</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eligibleVoters.filter((voter) => getVotingStatus(voter.matric_no)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Eligible Voters</CardTitle>
          <CardDescription>List of all eligible voters and their registration/voting status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Registration Status</TableHead>
                <TableHead>Voting Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleVoters.map((voter) => {
                const isRegistered = getRegistrationStatus(voter.matric_no)
                const hasVoted = getVotingStatus(voter.matric_no)

                return (
                  <TableRow key={voter.matric_no}>
                    <TableCell className="font-medium">{voter.matric_no}</TableCell>
                    <TableCell>{voter.name}</TableCell>
                    <TableCell>{voter.department}</TableCell>
                    <TableCell>
                      <Badge variant={isRegistered ? "default" : "secondary"}>
                        {isRegistered ? "Registered" : "Not Registered"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={hasVoted ? "default" : "outline"}>{hasVoted ? "Voted" : "Not Voted"}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

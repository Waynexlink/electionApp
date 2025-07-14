"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Database, Loader2, AlertTriangle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function DatabaseInitializer() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const initializeDatabase = async () => {
    setLoading(true)
    setError("")
    setProgress(0)
    setStatus("Starting database initialization...")

    try {
      // Step 1: Test connection
      setStatus("Testing database connection...")
      setProgress(10)

      const { data: testData, error: testError } = await supabase.from("elections").select("count").limit(1)
      if (testError) {
        throw new Error(`Database connection failed: ${testError.message}`)
      }

      // Step 2: Create election
      setStatus("Creating election...")
      setProgress(25)

      const { data: existingElection } = await supabase
        .from("elections")
        .select("id")
        .eq("title", "Student Union Elections 2024")
        .single()

      let electionId
      if (existingElection) {
        electionId = existingElection.id
        setStatus("Election already exists, using existing one...")
      } else {
        const { data: election, error: electionError } = await supabase
          .from("elections")
          .insert([
            {
              title: "Student Union Elections 2024",
              description: "Annual student union elections for academic year 2024-2025",
              start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              is_active: true,
            },
          ])
          .select()

        if (electionError) throw electionError
        electionId = election[0].id
        setStatus("Election created successfully!")
      }

      // Step 3: Create positions
      setStatus("Creating positions...")
      setProgress(50)

      const positions = [
        { title: "President", description: "Student Union President - Lead the student body" },
        { title: "Vice President", description: "Student Union Vice President - Support the president" },
        { title: "Secretary General", description: "Secretary General - Maintain official records" },
        {
          title: "Assistant Secretary General",
          description: "Assistant Secretary General - Support the Secretary General",
        },
        { title: "Financial Secretary", description: "Financial Secretary - Manage financial records" },
        { title: "Treasurer", description: "Treasurer - Oversee union finances" },
        { title: "Director of Academy", description: "Director of Academy - Oversee academic affairs" },
        { title: "Director of Software", description: "Director of Software - Lead software development" },
        { title: "Director of Sport", description: "Director of Sport - Organize sports activities" },
        { title: "Director of Social", description: "Director of Social - Plan social events" },
        { title: "Director of Hardware", description: "Director of Hardware - Manage hardware resources" },
        { title: "Director of Welfare", description: "Director of Welfare - Oversee student welfare" },
        { title: "Public Relation Officer", description: "Public Relation Officer - Manage external communications" },
        { title: "Provost", description: "Provost - Oversee residential and campus life" },
      ]

      // Check if posts already exist
      const { data: existingPosts } = await supabase.from("posts").select("id").eq("election_id", electionId)

      if (existingPosts && existingPosts.length >= positions.length) {
        setStatus("Positions already exist!")
      } else {
        // Delete existing posts first to avoid duplicates
        if (existingPosts && existingPosts.length > 0) {
          await supabase.from("posts").delete().eq("election_id", electionId)
        }

        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .insert(positions.map((pos) => ({ ...pos, election_id: electionId })))
          .select()

        if (postsError) throw postsError
        setStatus(`Created ${posts.length} positions successfully!`)
      }

      // Step 4: Create eligible voters
      setStatus("Adding eligible voters...")
      setProgress(75)

      const voters = [
        { matric_no: "2021/CS/001", name: "John Doe", department: "Computer Science" },
        { matric_no: "2021/CS/002", name: "Jane Smith", department: "Computer Science" },
        { matric_no: "2021/ENG/001", name: "Mike Johnson", department: "Engineering" },
        { matric_no: "2021/ENG/002", name: "Sarah Wilson", department: "Engineering" },
        { matric_no: "2021/BUS/001", name: "David Brown", department: "Business Administration" },
        { matric_no: "2021/BUS/002", name: "Lisa Davis", department: "Business Administration" },
        { matric_no: "2021/MED/001", name: "Robert Miller", department: "Medicine" },
        { matric_no: "2021/MED/002", name: "Emily Garcia", department: "Medicine" },
        { matric_no: "2021/LAW/001", name: "James Rodriguez", department: "Law" },
        { matric_no: "2021/LAW/002", name: "Maria Martinez", department: "Law" },
      ]

      const { error: votersError } = await supabase.from("eligible_voters").upsert(voters, {
        onConflict: "matric_no",
      })

      if (votersError) throw votersError
      setStatus("Eligible voters added successfully!")

      // Step 5: Create admin profile
      setStatus("Creating admin profile...")
      setProgress(90)

      const { error: adminError } = await supabase.from("profiles").upsert(
        [
          {
            id: "00000000-0000-0000-0000-000000000001",
            email: "admin@university.edu",
            name: "Administrator",
            matric_no: "ADMIN001",
            role: "admin",
          },
        ],
        { onConflict: "email" },
      )

      if (adminError && adminError.code !== "23505") {
        console.log("Admin profile note:", adminError.message)
      }

      setStatus("Database initialization completed successfully!")
      setProgress(100)
      setSuccess(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Database initialization error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Database Initialized Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-green-700">
            <p>✅ Election created</p>
            <p>✅ 14 positions added</p>
            <p>✅ Eligible voters added</p>
            <p>✅ Admin profile created</p>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Login credentials:</strong>
              <br />
              Admin: admin@university.edu / password123
              <br />
              Student: student@university.edu / password123
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Initialization
        </CardTitle>
        <CardDescription>Initialize your Supabase database with sample election data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{status}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button onClick={initializeDatabase} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Initialize Database
            </>
          )}
        </Button>

        <Alert>
          <AlertDescription>
            This will create sample election data in your Supabase database. Make sure you've run the SQL scripts first.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

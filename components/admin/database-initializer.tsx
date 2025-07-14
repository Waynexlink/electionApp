"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Database, Loader2, AlertTriangle } from "lucide-react"

export function DatabaseInitializer() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)

  const initializeDatabase = async () => {
    setLoading(true)
    setError("")
    setProgress(0)
    setStatus("Starting database initialization...")

    try {
      setStatus("Connecting to MongoDB...")
      setProgress(25)

      const response = await fetch('/api/initialize-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setProgress(75)
      setStatus("Creating database records...")

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Database initialization failed')
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
            <p>✅ MongoDB connection established</p>
            <p>✅ Election created</p>
            <p>✅ 14 positions added</p>
            <p>✅ Eligible voters added</p>
            <p>✅ Admin and student profiles created</p>
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
          MongoDB Database Initialization
        </CardTitle>
        <CardDescription>Initialize your MongoDB database with sample election data</CardDescription>
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
              Initialize MongoDB Database
            </>
          )}
        </Button>

        <Alert>
          <AlertDescription>
            This will create sample election data in your MongoDB database. Make sure MongoDB is running locally or provide a connection string.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
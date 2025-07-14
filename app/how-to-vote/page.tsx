"use client"

import { CardFooter } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lightbulb, UserCheck, Vote } from "lucide-react"
import Link from "next/link"

export default function HowToVotePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">How to Vote</CardTitle>
          <CardDescription className="text-gray-600">
            Follow these simple steps to cast your vote securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <Lightbulb className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Register Your Account</h3>
              <p className="text-gray-600">
                Ensure your matriculation number is on the eligible voters list. If not, contact the election committee.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <UserCheck className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Verify Your Eligibility</h3>
              <p className="text-gray-600">Your registration will be verified against the official student database.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <Vote className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Cast Your Vote</h3>
              <p className="text-gray-600">
                Navigate to the voting dashboard, select your preferred candidates for each position, and submit.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Confirmation</h3>
              <p className="text-gray-600">
                You will receive an instant confirmation that your vote has been successfully recorded.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center px-8 pb-8">
          <Link href="/dashboard">
            <Button className="w-full md:w-auto px-8 h-12 bg-green-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
              Go to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

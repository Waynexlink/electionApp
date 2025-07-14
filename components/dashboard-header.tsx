"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User, HelpCircle, Vote, Bell } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  user: {
    name: string
    email: string
    matric_no: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-gradient rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SecureVote</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/how-to-vote">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                How to Vote
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 hover:bg-emerald-50 rounded-xl transition-all duration-200 px-3 py-2"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-emerald-500">
                    <AvatarFallback className="bg-green-gradient text-white font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.matric_no}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-0 shadow-lg">
                <DropdownMenuItem disabled className="rounded-lg">
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.matric_no}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loading}
                  className="text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, User, Mail, Lock, Eye, EyeOff, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth" // Import authService

export function RegisterForm() {
  const [formData, setFormData] = useState({
    matricNo: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    Object.values(checks).forEach((check) => check && strength++)
    return { strength: (strength / 5) * 100, checks }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return "Password must be at least 8 characters long"
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Password must contain both uppercase and lowercase letters"
    }
    if (!hasNumbers) {
      return "Password must contain at least one number"
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password complexity
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    try {
      const { user, error: authError } = await authService.signUp({
        matric_no: formData.matricNo,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError)
        return
      }

      if (user) {
        setSuccess(true)
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Registration Successful!</CardTitle>
          <CardDescription className="text-gray-600">Your account has been created successfully</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <p className="text-gray-600 mb-6 text-center">
            You can now sign in with your credentials and start participating in elections.
          </p>
          <Link href="/">
            <Button className="w-full h-12 bg-green-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
              Return to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
        <CardDescription className="text-gray-600">Fill in your details to get started</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 px-8">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-emerald-200 bg-emerald-50">
            <Info className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700">
              <strong>Demo:</strong> Use matric numbers: 2021/CS/001, 2021/CS/002, or 2021/ENG/001
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricNo" className="text-gray-700 font-medium">
                Matric Number
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="matricNo"
                  value={formData.matricNo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, matricNo: e.target.value }))}
                  required
                  disabled={loading}
                  placeholder="e.g., 2021/CS/001"
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                  className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={loading}
                placeholder="Enter your email"
                className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                disabled={loading}
                placeholder="Create a strong password"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Password strength</span>
                  <span
                    className={`font-medium ${
                      passwordStrength.strength < 40
                        ? "text-red-500"
                        : passwordStrength.strength < 80
                          ? "text-yellow-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {passwordStrength.strength < 40 ? "Weak" : passwordStrength.strength < 80 ? "Medium" : "Strong"}
                  </span>
                </div>
                <Progress value={passwordStrength.strength} className="h-2" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                disabled={loading}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
          <Button
            type="submit"
            className="w-full h-12 bg-green-gradient hover:shadow-lg hover:shadow-emerald-500/25 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 hover:underline text-center"
          >
            Already have an account? Sign in here
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}

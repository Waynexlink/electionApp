import jwt from 'jsonwebtoken'
import User, { IUser } from '@/models/User'
import EligibleVoter from '@/models/EligibleVoter'
import connectDB from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  name: string
  matric_no: string
  role: "admin" | "user"
}

export class AuthService {
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null; token?: string }> {
    try {
      await connectDB()

      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return { user: null, error: "Invalid email or password" }
      }

      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return { user: null, error: "Invalid email or password" }
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const authUser: AuthUser = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        matric_no: user.matric_no,
        role: user.role,
      }

      return { user: authUser, error: null, token }
    } catch (error) {
      console.error("Sign in error:", error)
      return { user: null, error: "An unexpected error occurred during sign-in." }
    }
  }

  async signUp(userData: {
    email: string
    name: string
    matric_no: string
    password: string
  }): Promise<{ user: AuthUser | null; error: string | null; token?: string }> {
    try {
      await connectDB()

      // Normalize matric number input
      const normalizedMatricNo = userData.matric_no.trim().toUpperCase()

      // Check if matric number is in eligible voters list
      const eligibleVoter = await EligibleVoter.findOne({ matric_no: normalizedMatricNo })
      if (!eligibleVoter) {
        return { user: null, error: "Matric number not found in eligible voters list" }
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email.toLowerCase() },
          { matric_no: normalizedMatricNo }
        ]
      })

      if (existingUser) {
        return { user: null, error: "User with this email or matric number already exists" }
      }

      // Create new user
      const newUser = new User({
        email: userData.email.toLowerCase(),
        name: userData.name,
        matric_no: normalizedMatricNo,
        password: userData.password,
        role: 'user'
      })

      await newUser.save()

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const authUser: AuthUser = {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        matric_no: newUser.matric_no,
        role: newUser.role,
      }

      return { user: authUser, error: null, token }
    } catch (error: any) {
      console.error("Sign up error:", error)
      if (error.code === 11000) {
        return { user: null, error: "User with this email or matric number already exists" }
      }
      return { user: null, error: "An unexpected error occurred during registration." }
    }
  }

  async verifyToken(token: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      await connectDB()
      const user = await User.findById(decoded.userId)
      
      if (!user) {
        return { user: null, error: "User not found" }
      }

      const authUser: AuthUser = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        matric_no: user.matric_no,
        role: user.role,
      }

      return { user: authUser, error: null }
    } catch (error) {
      return { user: null, error: "Invalid token" }
    }
  }

  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }

  setCurrentUser(user: AuthUser, token: string) {
    if (typeof window === 'undefined') return
    
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("authToken", token)
  }

  signOut() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem("authToken")
  }
}

export const authService = new AuthService()
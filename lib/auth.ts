import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabaseOperations } from "./supabase"

export interface User {
  id: string
  email: string
  name: string
  matric_no: string
  role: "admin" | "user"
}

export class AuthService {
  private supabase = createClientComponentClient()

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Supabase signIn error:", authError)
        return { user: null, error: authError.message }
      }

      if (!data.user) {
        return { user: null, error: "Authentication failed: No user data returned." }
      }

      // Fetch profile by ID
      let { data: profile, error: profileError } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      // Fallback: Try fetching by email
      if (profileError || !profile) {
        const alt = await this.supabase
          .from("profiles")
          .select("*")
          .eq("email", data.user.email)
          .single()

        profile = alt.data
        profileError = alt.error
      }

      if (profileError || !profile) {
        console.error("Supabase profile fetch error:", profileError)
        return { user: null, error: "Failed to retrieve user profile." }
      }

      const currentUser: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        matric_no: profile.matric_no,
        role: profile.role,
      }

      return { user: currentUser, error: null }
    } catch (error) {
      console.error("Unexpected signIn error:", error)
      return { user: null, error: "An unexpected error occurred during sign-in." }
    }
  }

  async signUp(userData: {
    email: string
    name: string
    matric_no: string
    password: string
  }): Promise<{ user: User | null; error: string | null }> {
    try {
      // Normalize matric number input
      const normalizedInput = userData.matric_no.trim().toUpperCase()

      // Fetch eligible voters and check
      const eligibleVoters = await supabaseOperations.getEligibleVoters()
      const isEligible = eligibleVoters.some(
        (v) => v.matric_no.trim().toUpperCase() === normalizedInput
      )

      if (!isEligible) {
        return { user: null, error: "Matric number not found in eligible voters list" }
      }

      // Sign up user with Supabase Auth
      const { data, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      })

      if (authError) {
        console.error("Supabase signUp error:", authError)
        return { user: null, error: authError.message }
      }

      if (!data.user) {
        return { user: null, error: "Registration failed: No user data returned." }
      }

      // Insert into 'profiles' table
      const { data: profile, error: profileError } = await this.supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            matric_no: normalizedInput,
            role: "user",
          },
        ])
        .select("*")
        .single()

      if (profileError || !profile) {
        console.error("Supabase profile insert error:", profileError)
        console.warn("Profile creation failed. Manual cleanup may be needed.") // ✅ Safe fallback
        return { user: null, error: "Failed to create user profile after registration." }
      }

      const newUser: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        matric_no: profile.matric_no,
        role: profile.role,
      }

      return { user: newUser, error: null }
    } catch (error) {
      console.error("Unexpected signUp error:", error)
      return { user: null, error: "An unexpected error occurred during registration." }
    }
  }

  async signOut() {
    await this.supabase.auth.signOut()
    localStorage.removeItem("currentUser")
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }

  setCurrentUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  async getSupabaseUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    return user
  }
}

export const authService = new AuthService()

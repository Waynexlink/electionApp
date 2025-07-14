import { LoginForm } from "@/components/login-form"
import { Leaf, Shield, Vote } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-green-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Diagonal overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-900/40"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with logo and title */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-pulse-green">
              <Vote className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SecureVote</h1>
            <p className="text-emerald-100 text-lg font-medium">Democratic • Transparent • Secure</p>
          </div>

          {/* Login Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <LoginForm />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium">Anonymous</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium">Transparent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

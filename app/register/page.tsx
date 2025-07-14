import { RegisterForm } from "@/components/register-form"
import { UserPlus, Shield, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-green-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-16 w-28 h-28 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute top-20 right-24 w-36 h-36 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-32 h-32 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-24 right-16 w-24 h-24 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "0.8s" }}
        ></div>
      </div>

      {/* Diagonal overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-900/40"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-pulse-green">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Join SecureVote</h1>
            <p className="text-emerald-100 text-lg font-medium">Create your account to participate</p>
          </div>

          {/* Registration Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <RegisterForm />
          </div>

          {/* Security Features */}
          <div className="mt-6 grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium">Secure Registration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-emerald-100 text-sm font-medium">Verified Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

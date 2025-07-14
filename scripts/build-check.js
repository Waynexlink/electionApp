const { execSync } = require("child_process")

console.log("🔍 Running pre-deployment checks...")

try {
  // Check TypeScript
  console.log("📝 Checking TypeScript...")
  execSync("npx tsc --noEmit", { stdio: "inherit" })
  console.log("✅ TypeScript check passed")

  // Check build
  console.log("🏗️ Testing build...")
  execSync("npm run build", { stdio: "inherit" })
  console.log("✅ Build successful")

  // Check environment variables
  console.log("🔧 Checking environment variables...")
  const requiredEnvs = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  const missing = requiredEnvs.filter((env) => !process.env[env])
  if (missing.length > 0) {
    console.log("⚠️ Missing environment variables:", missing.join(", "))
  } else {
    console.log("✅ All required environment variables present")
  }

  console.log("\n🎉 Ready for deployment!")
} catch (error) {
  console.error("❌ Pre-deployment check failed:", error.message)
  process.exit(1)
}

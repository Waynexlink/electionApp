const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Checking environment variables...")
console.log("Supabase URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
console.log("Service Key:", supabaseServiceKey ? "✅ Set" : "❌ Missing")

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables")
  console.log("\n📝 Please create a .env.local file with:")
  console.log("NEXT_PUBLIC_SUPABASE_URL=your-supabase-url")
  console.log("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    // Test connection first
    const { data: testData, error: testError } = await supabase.from("elections").select("count").limit(1)
    if (testError) {
      console.error("❌ Database connection failed:", testError.message)
      return
    }
    console.log("✅ Database connection successful")

    // 1. Insert sample election
    const { data: existingElection } = await supabase
      .from("elections")
      .select("id")
      .eq("title", "Student Union Elections 2024")
      .single()

    let electionId
    if (existingElection) {
      console.log("✅ Election already exists")
      electionId = existingElection.id
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
      console.log("✅ Election created:", election[0].title)
    }

    // 2. Insert positions
    const positions = [
      { title: "President", description: "Student Union President - Lead the student body" },
      { title: "Vice President", description: "Student Union Vice President - Support the president" },
      { title: "Secretary General", description: "Secretary General - Maintain official records" },
      { title: "Financial Secretary", description: "Financial Secretary - Manage financial records" },
      { title: "Treasurer", description: "Treasurer - Oversee union finances" },
      { title: "Director of Academy", description: "Director of Academy - Oversee academic affairs" },
    ]

    // Check if posts already exist
    const { data: existingPosts } = await supabase.from("posts").select("id").eq("election_id", electionId)

    if (existingPosts && existingPosts.length > 0) {
      console.log("✅ Positions already exist")
    } else {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .insert(positions.map((pos) => ({ ...pos, election_id: electionId })))
        .select()

      if (postsError) throw postsError
      console.log("✅ Positions created:", posts.length)
    }

    // 3. Insert sample eligible voters
    const voters = [
      { matric_no: "2021/CS/001", name: "John Doe", department: "Computer Science" },
      { matric_no: "2021/CS/002", name: "Jane Smith", department: "Computer Science" },
      { matric_no: "2021/ENG/001", name: "Mike Johnson", department: "Engineering" },
      { matric_no: "2021/ENG/002", name: "Sarah Wilson", department: "Engineering" },
      { matric_no: "2021/BUS/001", name: "David Brown", department: "Business Administration" },
    ]

    const { error: votersError } = await supabase.from("eligible_voters").upsert(voters, {
      onConflict: "matric_no",
    })

    if (votersError) throw votersError
    console.log("✅ Eligible voters added/updated:", voters.length)

    // 4. Create admin user profile
    const { error: adminError } = await supabase.from("profiles").upsert(
      [
        {
          id: "00000000-0000-0000-0000-000000000001", // Fixed UUID for admin
          email: "admin@university.edu",
          name: "Administrator",
          matric_no: "ADMIN001",
          role: "admin",
        },
      ],
      { onConflict: "email" },
    )

    if (adminError) console.log("ℹ️ Admin user:", adminError.message)
    else console.log("✅ Admin user created/updated")

    console.log("\n🎉 Database initialization complete!")
    console.log("\n📋 Next steps:")
    console.log("1. Try logging in with: admin@university.edu / password123")
    console.log("2. Add candidates through the admin panel")
    console.log("3. Test voting with student accounts")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
  }
}

initializeDatabase()

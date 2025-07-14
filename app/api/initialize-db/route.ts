import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import EligibleVoter from '@/models/EligibleVoter'
import Election from '@/models/Election'
import Post from '@/models/Post'

export async function POST() {
  try {
    await connectDB()

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@university.edu' })
    if (!adminExists) {
      const admin = new User({
        email: 'admin@university.edu',
        name: 'Administrator',
        matric_no: 'ADMIN001',
        password: 'password123',
        role: 'admin'
      })
      await admin.save()
    }

    // Create sample student user
    const studentExists = await User.findOne({ email: 'student@university.edu' })
    if (!studentExists) {
      const student = new User({
        email: 'student@university.edu',
        name: 'John Doe',
        matric_no: '2021/CS/001',
        password: 'password123',
        role: 'user'
      })
      await student.save()
    }

    // Create eligible voters
    const voters = [
      { matric_no: '2021/CS/001', name: 'John Doe', department: 'Computer Science' },
      { matric_no: '2021/CS/002', name: 'Jane Smith', department: 'Computer Science' },
      { matric_no: '2021/ENG/001', name: 'Mike Johnson', department: 'Engineering' },
      { matric_no: '2021/ENG/002', name: 'Sarah Wilson', department: 'Engineering' },
      { matric_no: '2021/BUS/001', name: 'David Brown', department: 'Business Administration' },
      { matric_no: '2021/BUS/002', name: 'Lisa Davis', department: 'Business Administration' },
      { matric_no: '2021/MED/001', name: 'Robert Miller', department: 'Medicine' },
      { matric_no: '2021/MED/002', name: 'Emily Garcia', department: 'Medicine' },
      { matric_no: '2021/LAW/001', name: 'James Rodriguez', department: 'Law' },
      { matric_no: '2021/LAW/002', name: 'Maria Martinez', department: 'Law' },
    ]

    for (const voter of voters) {
      await EligibleVoter.findOneAndUpdate(
        { matric_no: voter.matric_no },
        voter,
        { upsert: true }
      )
    }

    // Create election
    const electionExists = await Election.findOne({ title: 'Student Union Elections 2024' })
    let election
    if (!electionExists) {
      election = new Election({
        title: 'Student Union Elections 2024',
        description: 'Annual student union elections for academic year 2024-2025',
        start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: true
      })
      await election.save()
    } else {
      election = electionExists
    }

    // Create positions
    const positions = [
      { title: 'President', description: 'Student Union President - Lead the student body' },
      { title: 'Vice President', description: 'Student Union Vice President - Support the president' },
      { title: 'Secretary General', description: 'Secretary General - Maintain official records' },
      { title: 'Assistant Secretary General', description: 'Assistant Secretary General - Support the Secretary General' },
      { title: 'Financial Secretary', description: 'Financial Secretary - Manage financial records' },
      { title: 'Treasurer', description: 'Treasurer - Oversee union finances' },
      { title: 'Director of Academy', description: 'Director of Academy - Oversee academic affairs' },
      { title: 'Director of Software', description: 'Director of Software - Lead software development' },
      { title: 'Director of Sport', description: 'Director of Sport - Organize sports activities' },
      { title: 'Director of Social', description: 'Director of Social - Plan social events' },
      { title: 'Director of Hardware', description: 'Director of Hardware - Manage hardware resources' },
      { title: 'Director of Welfare', description: 'Director of Welfare - Oversee student welfare' },
      { title: 'Public Relation Officer', description: 'Public Relation Officer - Manage external communications' },
      { title: 'Provost', description: 'Provost - Oversee residential and campus life' },
    ]

    for (const position of positions) {
      await Post.findOneAndUpdate(
        { title: position.title, election_id: election._id },
        { ...position, election_id: election._id },
        { upsert: true }
      )
    }

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      details: {
        admin: 'admin@university.edu / password123',
        student: 'student@university.edu / password123',
        votersCount: voters.length,
        positionsCount: positions.length
      }
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}
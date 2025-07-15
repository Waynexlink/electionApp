import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function middleware(request: NextRequest) {
  // Only protect API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/votes') || 
      request.nextUrl.pathname.startsWith('/api/users') ||
      request.nextUrl.pathname.startsWith('/api/eligible-voters')) {
    
    // Skip authentication for public routes
    if (request.nextUrl.pathname.includes('/results/') && request.method === 'GET') {
      return NextResponse.next()
    }
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/votes/:path*', '/api/users/:path*', '/api/eligible-voters/:path*']
}
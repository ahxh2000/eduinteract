import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }
    
    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.role === 'admin') {
      return NextResponse.json({ 
        valid: true, 
        username: decoded.username 
      })
    } else {
      return NextResponse.json({ valid: false }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
} 
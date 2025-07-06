import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (username === adminUsername && password === adminPassword) {
      // 生成JWT令牌
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      )
      
      return NextResponse.json({ 
        success: true, 
        token,
        username 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: '用户名或密码错误' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
} 
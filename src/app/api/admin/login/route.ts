import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

// 添加 edge runtime 导出
export const runtime = 'edge'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 将密钥转换为 Uint8Array
const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (username === adminUsername && password === adminPassword) {
      // 生成JWT令牌
      const token = await new SignJWT({ username, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secretKey)

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
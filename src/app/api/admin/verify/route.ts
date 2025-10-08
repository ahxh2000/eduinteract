import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// 添加 edge runtime 导出
export const runtime = 'edge'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 将密钥转换为 Uint8Array
const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    // 验证JWT令牌
    const { payload } = await jwtVerify(token, secretKey)

    if (payload.role === 'admin') {
      return NextResponse.json({
        valid: true,
        username: payload.username
      })
    } else {
      return NextResponse.json({ valid: false }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
} 
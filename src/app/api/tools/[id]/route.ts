import { NextRequest, NextResponse } from 'next/server'
import { toolService } from '@/lib/database'

// 添加 edge runtime 导出
export const runtime = 'edge'

//更新后的GET-lmn
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 获取工具信息
    let tool = await toolService.getToolByIdAll(id)
    if (!tool) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 })
    }

    // 增加浏览量 - 只有在非管理后台访问时才增加
    const isAdminRequest = request.headers.get('x-request-source') === 'admin'
    
    if (!isAdminRequest) {
      await toolService.incrementViewsSimple(id)
      // 重新获取更新后的工具信息
      tool = await toolService.getToolByIdAll(id)
    }

    return NextResponse.json({ tool })
  } catch (error) {
    console.error('获取工具详情失败:', error)
    return NextResponse.json({ error: '获取工具详情失败' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, subject, is_active } = body
    const updatedTool = await toolService.updateTool(id, {
      title,
      description,
      subject,
      is_active
    })
    if (!updatedTool) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 })
    }
    return NextResponse.json({ tool: updatedTool })
  } catch (error) {
    console.error('更新工具失败:', error)
    return NextResponse.json({ error: '更新工具失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await toolService.deleteTool(id)
    if (!success) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 })
    }
    return NextResponse.json({ message: '工具删除成功' })
  } catch (error) {
    console.error('删除工具失败:', error)
    return NextResponse.json({ error: '删除工具失败' }, { status: 500 })
  }
} 
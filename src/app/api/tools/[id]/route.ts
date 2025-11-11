import { NextRequest, NextResponse } from 'next/server'
import { toolService } from '@/lib/database'

// 添加 edge runtime 导出
export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 首先增加浏览量
    await toolService.incrementViews(id)

    // 然后获取工具信息
    const tool = await toolService.getToolByIdAll(id)
    if (!tool) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 })
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
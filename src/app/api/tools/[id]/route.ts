import { NextRequest, NextResponse } from 'next/server'
import { toolService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await toolService.getToolByIdAll(params.id)
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, subject, is_active } = body
    const updatedTool = await toolService.updateTool(params.id, {
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
  { params }: { params: { id: string } }
) {
  try {
    const success = await toolService.deleteTool(params.id)
    if (!success) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 })
    }
    return NextResponse.json({ message: '工具删除成功' })
  } catch (error) {
    console.error('删除工具失败:', error)
    return NextResponse.json({ error: '删除工具失败' }, { status: 500 })
  }
} 
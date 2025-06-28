import { NextRequest, NextResponse } from 'next/server';
import { toolService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');

    let tools;
    if (subject && subject !== 'all') {
      tools = await toolService.getToolsBySubject(subject);
    } else {
      tools = await toolService.getAllTools();
    }

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    return NextResponse.json({ error: '获取工具列表失败' }, { status: 500 });
  }
} 
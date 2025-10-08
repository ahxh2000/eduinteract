import { NextRequest, NextResponse } from 'next/server';
import { toolService } from '@/lib/database';

// 添加 edge runtime 导出
export const runtime = 'edge';

// 缓存存储
interface CacheEntry {
  data: any;
  timestamp: number;
}

// 内存缓存对象 - 使用全局存储在 edge runtime 中
const cache: { [key: string]: CacheEntry } = {};

// 缓存配置 - 缩短缓存时间以适应 edge runtime
const CACHE_DURATION = 2 * 60 * 1000; // 2分钟

// 检查缓存是否有效
function isCacheValid(cacheKey: string): boolean {
  const cached = cache[cacheKey];
  if (!cached) return false;

  const now = Date.now();
  return (now - cached.timestamp) < CACHE_DURATION;
}

// 清理过期缓存 - 简化版本，适合 edge runtime
function cleanupExpiredCache() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  Object.keys(cache).forEach(key => {
    if ((now - cache[key].timestamp) >= CACHE_DURATION) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => delete cache[key]);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const requestSource = request.headers.get('x-request-source');

    // 判断是否为管理后台请求
    const isAdminRequest = requestSource === 'admin';

    // 生成缓存键
    const cacheKey = subject || 'all';

    // 定期清理过期缓存
    cleanupExpiredCache();

    // 只有非管理后台请求才检查缓存
    if (!isAdminRequest) {
      if (isCacheValid(cacheKey)) {
        console.log(`缓存命中: ${cacheKey}`);
        return NextResponse.json({
          tools: cache[cacheKey].data,
          fromCache: true
        });
      }
    }

    // 管理后台请求或缓存未命中，从数据库获取数据
    console.log(`缓存未命中，从数据库获取: ${cacheKey}`);
    let tools;
    if (subject && subject !== 'all') {
      tools = isAdminRequest
        ? await toolService.getToolsBySubjectForAdmin(subject)
        : await toolService.getToolsBySubject(subject);
    } else {
      tools = isAdminRequest
        ? await toolService.getAllToolsForAdmin()
        : await toolService.getAllTools();
    }

    // 只对非管理后台请求进行缓存
    if (!isAdminRequest) {
      cache[cacheKey] = {
        data: tools,
        timestamp: Date.now()
      };
    }

    return NextResponse.json({
      tools,
      fromCache: false
    });

  } catch (error) {
    console.error('获取工具列表失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';

    // 如果是环境变量未配置的错误，返回更详细的错误信息
    if (errorMessage.includes('SUPABASE_URL') || errorMessage.includes('SUPABASE_ANON_KEY')) {
      return NextResponse.json({
        error: '数据库配置错误',
        details: '请联系管理员配置 Supabase 连接'
      }, { status: 500 });
    }

    return NextResponse.json({
      error: '获取工具列表失败',
      details: errorMessage
    }, { status: 500 });
  }
}

// 可选：添加清除缓存的API端点
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    if (subject) {
      // 清除特定学科的缓存
      delete cache[subject];
      console.log(`已清除缓存: ${subject}`);
    } else {
      // 清除所有缓存
      Object.keys(cache).forEach(key => delete cache[key]);
      console.log('已清除所有缓存');
    }
    
    return NextResponse.json({ message: '缓存已清除' });
  } catch (error) {
    console.error('清除缓存失败:', error);
    return NextResponse.json({ error: '清除缓存失败' }, { status: 500 });
  }
} 
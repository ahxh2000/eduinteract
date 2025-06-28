'use client'

import AdminAuth from '@/components/AdminAuth'
import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tool } from '@/types/database'
import Link from 'next/link'

export default function ToolDetail() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchToolDetail(params.id as string)
    }
  }, [params.id])

  const fetchToolDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/tools/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTool(data.tool)
      }
    } catch (error) {
      console.error('获取工具详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!tool) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/tools/${tool.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !tool.is_active })
      })

      if (response.ok) {
        setTool(prev => prev ? { ...prev, is_active: !prev.is_active } : null)
      }
    } catch (error) {
      console.error('更新状态失败:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getSubjectLabel = (subject: string) => {
    const map: Record<string, string> = {
      math: '数学', physics: '物理', chemistry: '化学', biology: '生物', 
      geography: '地理', history: '历史', chinese: '语文', english: '英语', other: '其他'
    }
    return map[subject] || subject
  }

  if (loading) {
    return (
      <AdminAuth>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">加载中...</div>
          </div>
        </AdminLayout>
      </AdminAuth>
    )
  }

  if (!tool) {
    return (
      <AdminAuth>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-500">工具不存在</div>
          </div>
        </AdminLayout>
      </AdminAuth>
    )
  }

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/admin/tools/${tool.id}`} className="text-indigo-600 hover:underline text-sm">
                ← 返回列表
              </Link>
              <h1 className="text-2xl font-bold">{tool.title}</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/admin/tools/${tool.id}/edit`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                编辑
              </button>
              <button
                onClick={handleStatusToggle}
                disabled={updating}
                className={`px-4 py-2 rounded ${
                  tool.is_active 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {updating ? '更新中...' : (tool.is_active ? '停用' : '激活')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">工具信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">标题</label>
                  <p className="mt-1 text-sm text-gray-900">{tool.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">学科</label>
                  <p className="mt-1 text-sm text-gray-900">{getSubjectLabel(tool.subject)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">描述</label>
                  <p className="mt-1 text-sm text-gray-900">{tool.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    tool.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tool.is_active ? '活跃' : '停用'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">浏览量</label>
                  <p className="mt-1 text-sm text-gray-900">{tool.views}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">创建时间</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(tool.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">工具预览</h2>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={tool.file_url}
                  className="w-full h-96"
                  title={tool.title}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  )
} 
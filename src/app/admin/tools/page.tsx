'use client'

import AdminAuth from '@/components/AdminAuth'
import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'
import { Tool } from '@/types/database'
import { useRouter } from 'next/navigation'

const PAGE_SIZE = 10

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filtered, setFiltered] = useState<Tool[]>([])
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    let result = tools
    if (subject) result = result.filter(t => t.subject === subject)
    if (status) result = result.filter(t => (status === 'active' ? t.is_active : !t.is_active))
    setFiltered(result)
    setPage(1)
  }, [tools, subject, status])

  const fetchTools = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tools')
      const data = await res.json()
      setTools(data.tools)
    } catch (e) {
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  const getSubjectLabel = (subject: string) => {
    const map: Record<string, string> = {
      math: '数学', physics: '物理', chemistry: '化学', biology: '生物', geography: '地理', history: '历史', chinese: '语文', english: '英语', other: '其他'
    }
    return map[subject] || subject
  }

  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const handleDetailClick = (toolId: string) => {
    router.push(`/admin/tools/${toolId}`)
  }

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">工具管理</h1>
            <div className="flex space-x-2">
              <select value={subject} onChange={e=>setSubject(e.target.value)} className="border rounded px-2 py-1">
                <option value="">全部学科</option>
                <option value="math">数学</option>
                <option value="physics">物理</option>
                <option value="chemistry">化学</option>
                <option value="biology">生物</option>
                <option value="geography">地理</option>
                <option value="history">历史</option>
                <option value="chinese">语文</option>
                <option value="english">英语</option>
                <option value="other">其他</option>
              </select>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1">
                <option value="">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
              </select>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学科</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">上传时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paged.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{tool.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSubjectLabel(tool.subject)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tool.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tool.is_active ? '活跃' : '停用'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(tool.created_at).toLocaleDateString('zh-CN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDetailClick(tool.id.toString())}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">暂无数据</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* 分页 */}
          <div className="flex justify-end space-x-2">
            <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded disabled:opacity-50">上一页</button>
            <span className="px-2 py-1">{page} / {totalPages || 1}</span>
            <button disabled={page===totalPages||totalPages===0} onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded disabled:opacity-50">下一页</button>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  )
} 
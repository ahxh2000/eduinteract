'use client'

import AdminAuth from '@/components/AdminAuth'
import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tool } from '@/types/database'

export default function EditTool() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    is_active: true
  })

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
        const toolData = data.tool
        setTool(toolData)
        setFormData({
          title: toolData.title,
          description: toolData.description,
          subject: toolData.subject,
          is_active: toolData.is_active
        })
      } else {
        console.error('获取工具详情失败')
      }
    } catch (error) {
      console.error('获取工具详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    }

    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空'
    }

    if (!formData.subject) {
      newErrors.subject = '请选择学科'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/tools/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push(`/admin/tools/${params.id}`)
      } else {
        console.error('更新失败')
      }
    } catch (error) {
      console.error('更新失败:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
          <div>
            <button 
              onClick={() => router.back()} 
              className="text-indigo-600 hover:text-indigo-800 mb-2"
            >
              ← 返回详情
            </button>
            <h1 className="text-2xl font-bold">编辑工具</h1>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工具标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入工具标题"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学科 *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择学科</option>
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
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工具描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入工具描述"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">工具状态：激活</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  )
} 
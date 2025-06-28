'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    const adminUsername = localStorage.getItem('adminUsername')

    if (adminLoggedIn === 'true' && adminUsername === 'adm123@@') {
      setIsAuthenticated(true)
    } else {
      // 清除可能存在的无效登录状态
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminUsername')
      router.push('/admin/login')
    }
    
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                工具管理后台
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                管理员: {localStorage.getItem('adminUsername')}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {children}
    </div>
  )
} 
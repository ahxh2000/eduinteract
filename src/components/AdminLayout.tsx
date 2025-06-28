'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
    { name: '工具管理', href: '/admin/tools', icon: '🛠️' },
    { name: '文件管理', href: '/admin/files', icon: '📁' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white shadow-lg`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">管理后台</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <nav className="mt-4">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 移动端菜单按钮 */}
        <div className="md:hidden bg-white border-b px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            ☰
          </button>
        </div>

        {/* 内容 */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
} 
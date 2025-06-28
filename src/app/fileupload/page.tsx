"use client";

import { useState } from 'react';
import ToolUpload from '@/components/ToolUpload';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

export default function FileUploadPage() {
  const [uploadedToolId, setUploadedToolId] = useState<string | null>(null);
  const [uploadedToolTitle, setUploadedToolTitle] = useState<string>('');

  const handleUploadSuccess = (toolId: string, toolTitle: string) => {
    setUploadedToolId(toolId);
    setUploadedToolTitle(toolTitle);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                <FaArrowLeft className="text-sm" />
                <span>返回首页</span>
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="text-sm">🎓</span>
              </div>
              <span className="text-lg font-bold text-gray-700">EduInteract</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                <FaHome className="text-sm" />
                <span>首页</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">上传教学工具</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为教育工作者和学生上传高质量的互动教学工具，让学习变得更加生动有趣。
            支持HTML格式的交互式教学工具，文件大小限制100KB。
          </p>
        </div>

        {/* 工具上传组件 */}
        <ToolUpload onUploadSuccess={handleUploadSuccess} />

        {/* 上传成功提示 */}
        {uploadedToolId && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    工具 "{uploadedToolTitle}" 上传成功！
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>您的工具已保存到数据库中，现在可以在首页查看。</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <a
                        href="/"
                        className="bg-blue-50 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
                      >
                        查看所有工具
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">使用说明</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">支持的格式</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• HTML文件格式</li>
                  <li>• 文件大小不超过100KB</li>
                  <li>• 支持交互式教学工具</li>
                  <li>• 支持JavaScript和CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">上传要求</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 填写完整的工具信息</li>
                  <li>• 选择合适的学科分类</li>
                  <li>• 提供详细的工具描述</li>
                  <li>• 确保工具功能正常</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 EduInteract. 保留所有权利。</p>
            <p className="mt-1">技术栈：Next.js · Tailwind CSS · Cloudflare R2 · Supabase</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

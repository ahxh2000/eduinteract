"use client";

import { useState } from 'react';
import ToolUpload from '@/components/ToolUpload';
import AdminAuth from '@/components/AdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';

export default function AdminToolUploadPage() {
  const [uploadedToolId, setUploadedToolId] = useState<string | null>(null);
  const [uploadedToolTitle, setUploadedToolTitle] = useState<string>('');
  const router = useRouter();

  const handleUploadSuccess = (toolId: string, toolTitle: string) => {
    setUploadedToolId(toolId);
    setUploadedToolTitle(toolTitle);
    // 上传成功后2秒跳转到工具列表
    setTimeout(() => {
      router.push('/admin/tools');
    }, 2000);
  };

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="max-w-2xl mx-auto py-10">
          <h1 className="text-2xl font-bold mb-4">上传教学工具</h1>
          <p className="text-gray-600 mb-8">
            仅支持HTML格式的交互式教学工具，文件大小限制100KB。
          </p>
          <ToolUpload onUploadSuccess={handleUploadSuccess} />
          {uploadedToolId && (
            <div className="mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      工具 &quot;{uploadedToolTitle}&quot; 上传成功！
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>您的工具已保存到数据库中，2秒后自动跳转到工具管理页面。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-12">
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
        </div>
      </AdminLayout>
    </AdminAuth>
  );
} 
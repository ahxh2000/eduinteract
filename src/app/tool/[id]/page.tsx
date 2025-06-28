"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { toolService } from '@/lib/database';
import { Tool } from '@/types/database';
import { subjectConfig } from '@/lib/subjectConfig';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.id as string;
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true);
        const toolData = await toolService.getToolById(toolId);
        setTool(toolData);
        if (!toolData) {
          setError('工具不存在');
        }
      } catch (err) {
        console.error('获取工具失败:', err);
        setError('获取工具信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (toolId) {
      fetchTool();
    }
  }, [toolId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">工具不存在</h1>
          <p className="text-gray-600 mb-6">抱歉，您访问的工具不存在或已被删除。</p>
          <Link href="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  // 获取学科配置信息
  const subjectInfo = subjectConfig[tool.subject as keyof typeof subjectConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                <FaArrowLeft className="text-sm" />
                <span>返回首页</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="text-sm">🎓</span>
              </div>
              <span className="text-lg font-bold text-gray-700">EduInteract</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                <FaHome className="text-sm" />
                <span>首页</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 工具信息 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{tool.title}</h1>
                {subjectInfo && (
                  <span className={`px-3 py-1 ${subjectInfo.color} text-white text-sm font-medium rounded-full`}>
                    {subjectInfo.label}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-lg mb-6">{tool.description}</p>
            <div className="text-sm text-gray-500">
              工具ID: {tool.id}
            </div>
          </div>

          {/* 工具内容 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">工具预览</h2>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">工具内容将在这里显示</p>
                <p className="text-sm text-gray-500">文件URL: {tool.file_url}</p>
                <div className="mt-4">
                  <a
                    href={tool.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors inline-block"
                  >
                    在新窗口打开
                  </a>
                </div>
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
          </div>
        </div>
      </footer>
    </div>
  );
} 
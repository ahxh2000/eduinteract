"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toolService } from '@/lib/database';
import { Tool } from '@/types/database';
import { subjectConfig } from '@/lib/subjectConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.id as string;
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

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
          <a href="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
            返回首页
          </a>
        </div>
      </div>
    );
  }

  // 获取学科配置信息
  const subjectInfo = subjectConfig[tool.subject as keyof typeof subjectConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Header />

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
              {tool.file_url ? (
                <div className="w-full relative">
                  {iframeLoading && (
                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">正在加载工具...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={tool.file_url}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title={tool.title}
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    onLoad={() => setIframeLoading(false)}
                    onError={() => setIframeLoading(false)}
                  />
                  <div className="mt-4 text-center">
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
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">工具内容将在这里显示</p>
                  <p className="text-sm text-gray-500">暂无文件URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
} 
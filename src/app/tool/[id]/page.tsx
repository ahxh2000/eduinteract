import { toolService } from '@/lib/database';
import { subjectConfig } from '@/lib/subjectConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tool = await toolService.getToolById(id);

  if (!tool) {
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

  const subjectInfo = subjectConfig[tool.subject as keyof typeof subjectConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
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

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">工具预览</h2>
            </div>
            <div className="p-4">
              {tool.file_url ? (
                <div className="w-full relative">
                  <iframe
                    src={tool.file_url}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title={tool.title}
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
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
      <Footer />
    </div>
  );
} 
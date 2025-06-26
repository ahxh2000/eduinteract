"use client";

import { useEffect, useState } from 'react';

interface FileItem {
  key: string;
  lastModified: Date;
  size: number;
  url: string;
}

const ITEMS_PER_PAGE = 9;

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFiles();
  }, [currentPage]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data.files);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mt-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mt-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mt-8 px-4">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">已上传文件</h2>
          <p className="text-sm text-gray-500 mt-1">查看所有上传过的 HTML 文件</p>
        </div>

        {/* 响应式网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {files.map((file) => (
            <div 
              key={file.key} 
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {file.key}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(file.lastModified).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-white rounded-md p-3">
                  <div className="prose prose-sm max-w-none">
                    <iframe
                      src={file.url}
                      title={`Preview of ${file.key}`}
                      className="w-full h-[200px] border-none"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  上一页
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm border rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
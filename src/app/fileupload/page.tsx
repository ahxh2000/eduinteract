"use client";

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FilePreview from '@/components/FilePreview';
import FileList from '@/components/FileList';

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* 顶部标题区 */}
      <header className="w-full py-8 bg-white shadow text-center">
        <h1 className="text-3xl font-bold">HTML File Viewer</h1>
        <p className="text-gray-500 mt-2">上传 HTML 文件并在线预览</p>
      </header>

      {/* 文件上传区 */}
      <section className="w-full max-w-xl mt-10 px-4">
        <FileUpload onUploadSuccess={setFileUrl} />
      </section>

      {/* 文件预览区 */}
      <section className="w-full max-w-2xl mt-8 px-4">
        <FilePreview fileUrl={fileUrl} />
      </section>

      {/* 文件列表区 */}
      <FileList />

      {/* 底部说明区 */}
      <footer className="w-full py-6 mt-16 text-center text-gray-400 text-sm border-t">
        技术栈：Next.js · Tailwind CSS · Cloudflare R2<br />
        &copy; {new Date().getFullYear()} HTML File Viewer
      </footer>
    </main>
  );
}

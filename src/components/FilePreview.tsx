import React, { useState } from 'react';

interface FilePreviewProps {
  fileUrl?: string | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl }) => {
  const [iframeError, setIframeError] = useState<string | null>(null);

  const handleIframeError = () => {
    console.error('iframe 加载失败，URL:', fileUrl);
    setIframeError('预览加载失败，请检查文件 URL 或 CORS 配置');
  };

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center border rounded bg-white shadow">
      {fileUrl ? (
        <>
          <iframe
            src={fileUrl}
            title="HTML 预览"
            className="w-full min-h-[400px] border-none"
            sandbox="allow-scripts allow-same-origin"
            onError={handleIframeError}
          />
          {iframeError && <p className="text-red-500 mt-2">{iframeError}</p>}
        </>
      ) : (
        <span className="text-gray-400">请先上传 HTML 文件，预览内容将在此处显示</span>
      )}
    </div>
  );
};

export default FilePreview; 
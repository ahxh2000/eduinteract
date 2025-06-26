"use client";
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUploadSuccess?: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState<string>("");
  const [codeUploading, setCodeUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    console.log('开始校验文件:', selectedFile.name);
    if (selectedFile.type !== 'text/html') {
      console.log('文件类型校验失败:', selectedFile.type);
      setError('只支持上传 HTML 文件');
      return;
    }
    if (selectedFile.size > 100 * 1024) {
      console.log('文件大小校验失败:', selectedFile.size);
      setError('文件大小不能超过 100KB');
      return;
    }
    console.log('文件校验通过，准备上传');
    setError(null);
    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile: File) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      console.log('开始上传文件:', selectedFile.name);
      const formData = new FormData();
      formData.append('file', selectedFile);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log('上传进度:', progress + '%');
          setUploadProgress(progress);
        }
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          console.log('上传成功，返回 URL:', res.url);
          if (onUploadSuccess) onUploadSuccess(res.url);
        } else {
          console.error('上传失败，状态码:', xhr.status, '响应:', xhr.responseText);
          setError('上传失败: ' + xhr.responseText);
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        console.error('上传请求出错');
        setError('上传失败');
      };
      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      console.error('上传过程异常:', err);
      setError('上传失败');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCodeUpload = () => {
    setError(null);
    if (!code.trim()) {
      setError("请输入 HTML 代码");
      return;
    }
    const blob = new Blob([code], { type: "text/html" });
    const codeFile = new File([blob], "pasted.html", { type: "text/html" });
    validateAndSetFile(codeFile);
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".html"
        className="hidden"
      />
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <p>拖拽文件到此处或点击选择文件</p>
        <p className="text-sm text-gray-500">仅支持 HTML 文件，大小限制 100KB</p>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {file && (
        <div className="mt-4">
          <p>已选择文件: {file.name}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">上传进度: {uploadProgress}%</p>
        </div>
      )}
      {uploading && <p className="text-blue-500 mt-2">正在上传...</p>}
      <div className="mt-6 text-left">
        <label className="block mb-2 font-medium">或直接粘贴 HTML 代码：</label>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring"
          placeholder="在此粘贴 HTML 代码..."
          value={code}
          onChange={e => setCode(e.target.value)}
          disabled={uploading || codeUploading}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleCodeUpload}
          disabled={uploading || codeUploading}
          type="button"
        >
          上传代码
        </button>
      </div>
    </div>
  );
};

export default FileUpload; 
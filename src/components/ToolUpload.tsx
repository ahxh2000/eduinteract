"use client";

import React, { useState, useRef } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaCode, FaFile } from 'react-icons/fa';
import { subjectConfig } from '@/lib/subjectConfig';

interface ToolUploadProps {
  onUploadSuccess?: (toolId: string, toolTitle: string) => void;
}

type UploadMode = 'file' | 'code';

const ToolUpload: React.FC<ToolUploadProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/html') {
      setError('只支持上传 HTML 文件');
      return;
    }
    if (selectedFile.size > 100 * 1024) {
      setError('文件大小不能超过 100KB');
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请输入工具标题');
      return;
    }
    if (!subject) {
      setError('请选择学科');
      return;
    }
    if (!description.trim()) {
      setError('请输入工具描述');
      return;
    }

    // 根据上传模式验证内容
    if (uploadMode === 'file' && !file) {
      setError('请选择HTML文件');
      return;
    }
    if (uploadMode === 'code' && !htmlCode.trim()) {
      setError('请输入HTML代码');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('description', description);

      // 根据上传模式处理内容
      if (uploadMode === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMode === 'code' && htmlCode.trim()) {
        // 将HTML代码转换为文件
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const codeFile = new File([blob], 'pasted.html', { type: 'text/html' });
        formData.append('file', codeFile);
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setSuccess(true);
          if (onUploadSuccess) {
            onUploadSuccess(res.toolId, title);
          }
          // 重置表单
          setTitle('');
          setSubject('');
          setDescription('');
          setFile(null);
          setHtmlCode('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          const errorData = JSON.parse(xhr.responseText);
          setError(errorData.error || '上传失败');
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setError('上传失败，请稍后重试');
      };

      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      setError('上传失败，请稍后重试');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setUploadMode('file');
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const switchUploadMode = (mode: UploadMode) => {
    setUploadMode(mode);
    setFile(null);
    setHtmlCode('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaCheck className="text-2xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">工具上传成功！</h2>
          <p className="text-gray-600 mb-6">您的教学工具已成功上传并保存到数据库中。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setUploadProgress(0);
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              继续上传
            </button>
            <a
              href="/"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">上传教学工具</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 工具标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            工具标题 *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="请输入工具标题"
            required
          />
        </div>

        {/* 学科选择 */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            学科分类 *
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          >
            <option value="">请选择学科</option>
            {Object.entries(subjectConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* 工具描述 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            工具描述 *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="请描述工具的功能和用途"
            required
          />
        </div>

        {/* 上传模式选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            上传方式 *
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => switchUploadMode('file')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                uploadMode === 'file'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              <FaFile className="text-sm" />
              <span>上传文件</span>
            </button>
            <button
              type="button"
              onClick={() => switchUploadMode('code')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                uploadMode === 'code'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              <FaCode className="text-sm" />
              <span>粘贴代码</span>
            </button>
          </div>
        </div>

        {/* 文件上传区域 */}
        {uploadMode === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML文件 *
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html"
                onChange={handleFileChange}
                className="hidden"
              />
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600">
                {file ? file.name : '点击选择HTML文件或拖拽到此处'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                支持HTML文件，最大100KB
              </p>
            </div>
          </div>
        )}

        {/* HTML代码输入区域 */}
        {uploadMode === 'code' && (
          <div>
            <label htmlFor="htmlCode" className="block text-sm font-medium text-gray-700 mb-2">
              HTML代码 *
            </label>
            <div className="border border-gray-300 rounded-lg">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                <div className="flex items-center space-x-2">
                  <FaCode className="text-sm text-gray-500" />
                  <span className="text-sm text-gray-600">HTML代码编辑器</span>
                </div>
              </div>
              <textarea
                id="htmlCode"
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm"
                placeholder="在此粘贴您的HTML代码..."
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              支持完整的HTML代码，包括CSS和JavaScript
            </p>
          </div>
        )}

        {/* 上传进度 */}
        {((file && uploading) || (htmlCode && uploading)) && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">上传进度</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 错误消息 */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              上传中...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" />
              上传工具
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ToolUpload; 
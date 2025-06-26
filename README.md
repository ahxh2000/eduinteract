# HTML File Viewer

一个允许用户上传HTML文件并在网页中预览的应用程序。

## 功能描述

1. 文件上传
   - 支持拖拽上传和点击选择文件
   - 仅支持HTML文件（.html）
   - 文件大小限制：100KB
   - 实时显示上传进度

2. 文件存储
   - 使用Cloudflare R2进行文件存储
   - 所有文件公开可访问
   - 自动生成文件访问URL

3. 文件预览
   - 使用iframe展示HTML文件内容
   - 实时预览上传的文件
   - 处理加载状态和错误情况

## 技术栈

- 前端框架：Next.js
- 文件存储：Cloudflare R2
- 样式：Tailwind CSS
- 文件处理：使用浏览器原生File API

## 实现步骤

### 1. 项目初始化
- 创建Next.js项目
- 安装必要依赖
- 配置项目结构

### 2. 文件上传组件开发
- 创建拖拽上传区域
- 实现文件选择功能
- 添加文件类型验证
- 添加文件大小验证
- 显示上传进度

### 3. Cloudflare R2配置
- 创建R2存储桶
- 配置访问权限
- 设置环境变量
- 实现R2客户端配置

### 4. 后端API开发
- 创建文件上传API
- 实现文件验证逻辑
- 实现R2文件上传
- 返回文件访问URL

### 5. 文件预览组件开发
- 创建iframe预览组件
- 实现加载状态显示
- 添加错误处理
- 配置iframe安全属性

### 6. 安全措施
- 文件类型验证（前端和后端）
- 文件大小限制
- iframe sandbox配置
- 错误处理和用户提示

### 7. 测试和优化
- 测试文件上传功能
- 测试文件预览功能
- 优化用户体验
- 性能优化

## 项目结构
```
├── components/
│   ├── FileUpload.tsx    # 文件上传组件
│   └── FilePreview.tsx   # 文件预览组件
├── pages/
│   ├── api/
│   │   └── upload.ts     # 文件上传API
│   └── index.tsx         # 主页面
├── lib/
│   └── r2.ts            # R2客户端配置
├── styles/
│   └── globals.css      # 全局样式
└── public/              # 静态资源
```

## 环境变量
```
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_ACCOUNT_ID=your_account_id
```

## 注意事项
1. 确保R2存储桶配置为公开访问
2. 文件大小限制为100KB
3. 仅支持HTML文件上传
4. 需要正确配置CORS策略 
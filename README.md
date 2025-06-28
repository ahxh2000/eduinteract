# EduInteract - 互动教学工具平台

一个为教育工作者和学生提供高质量互动教学工具的在线平台。

## 功能特性

### 🎯 核心功能
- **工具上传**: 支持上传HTML格式的互动教学工具
- **学科分类**: 按数学、物理、化学、生物、地理、历史等学科分类
- **工具展示**: 美观的工具卡片展示，支持学科筛选
- **工具预览**: 查看工具详情和预览功能

### 📁 文件管理
- **Cloudflare R2存储**: HTML文件存储在Cloudflare R2
- **文件验证**: 支持HTML文件，大小限制100KB
- **拖拽上传**: 支持拖拽文件上传

### 🎨 用户界面
- **响应式设计**: 适配桌面和移动设备
- **现代化UI**: 使用Tailwind CSS构建
- **流畅交互**: 平滑的动画和过渡效果

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **存储**: Cloudflare R2
- **数据库**: Supabase (待集成)
- **图标**: React Icons

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # 文件上传API
│   │   └── fileupload/
│   │       └── page.tsx              # 工具上传页面
│   │   └── tool/
│   │       └── [id]/
│   │           └── page.tsx          # 工具详情页面
│   │   └── globals.css
│   │   └── layout.tsx
│   │   └── page.tsx                  # 首页
│   ├── components/
│   │   ├── FileUpload.tsx            # 原始文件上传组件
│   │   └── ToolUpload.tsx            # 工具上传组件
│   │   └── FilePreview.tsx   # 文件预览组件
│   └── lib/
│       ├── r2.ts                     # Cloudflare R2配置
│       └── subjectConfig.ts          # 学科配置
```

## 安装和运行

1. **安装依赖**
   ```bash
   npm install
   ```

2. **环境变量配置**
   创建 `.env.local` 文件：
   ```env
   # Cloudflare R2配置
   R2_BUCKET_NAME=your_r2_bucket_name
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   
   # Supabase配置 (待集成)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 上传工具
1. 访问 `/fileupload` 页面
2. 填写工具标题、选择学科、输入描述
3. 上传HTML文件（支持拖拽）
4. 点击"上传工具"按钮

### 浏览工具
1. 在首页查看所有工具
2. 使用学科筛选功能
3. 点击工具卡片查看详情

## 待完成功能

- [ ] Supabase数据库集成
- [ ] 工具搜索功能
- [ ] 用户认证系统
- [ ] 工具评分和评论
- [ ] 工具收藏功能
- [ ] 管理员后台

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License 
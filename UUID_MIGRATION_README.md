# UUID 迁移指南

本文档说明如何将 EduInteract 项目中的工具 ID 从 integer 类型迁移到 UUID 类型。

## 更改概述

### 1. 类型定义更改
- `src/types/database.ts` 中的 `Tool` 接口的 `id` 字段已从 `number` 改为 `string`

### 2. 代码更改
- `src/lib/database.ts`: 添加了 `getToolById` 方法，支持 string 类型的 ID
- `src/components/ToolUpload.tsx`: 更新了 `onUploadSuccess` 回调函数的类型定义
- `src/app/fileupload/page.tsx`: 更新了状态类型定义
- `src/app/tool/[id]/page.tsx`: 完全重写，现在从数据库获取真实数据而不是使用模拟数据

### 3. 数据库更改
- Supabase 表的 `id` 字段需要从 `integer` 改为 `uuid`

## 迁移步骤

### 步骤 1: 更新 Supabase 表结构

1. 登录到 Supabase 控制台
2. 进入 SQL Editor
3. 运行 `supabase_migration.sql` 文件中的 SQL 脚本

**注意**: 这个脚本会删除现有的 `tools` 表并重新创建。如果有重要数据，请先备份。

### 步骤 2: 验证代码更改

确保以下文件已正确更新：

1. **类型定义** (`src/types/database.ts`)
   ```typescript
   export interface Tool {
     id: string  // 已从 number 改为 string
     // ... 其他字段
   }
   ```

2. **数据库服务** (`src/lib/database.ts`)
   - 添加了 `getToolById(id: string)` 方法
   - 所有方法现在都正确处理 string 类型的 ID

3. **工具详情页面** (`src/app/tool/[id]/page.tsx`)
   - 移除了模拟数据
   - 现在从数据库获取真实数据
   - 添加了加载状态和错误处理
   - 支持 string 类型的 ID

4. **上传组件** (`src/components/ToolUpload.tsx`)
   - 更新了 `onUploadSuccess` 回调函数的类型定义

### 步骤 3: 测试功能

1. **上传工具测试**
   - 访问 `/fileupload` 页面
   - 上传一个工具
   - 验证返回的 toolId 是 string 类型

2. **工具详情页面测试**
   - 上传工具后，点击查看详情
   - 验证页面能正确显示工具信息
   - 验证 URL 中的 ID 是 UUID 格式

3. **数据库查询测试**
   - 验证工具能正确保存到数据库
   - 验证能通过 UUID 正确查询工具

## 数据库表结构

新的 `tools` 表结构：

```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  file_url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## 安全策略

迁移脚本包含了以下安全策略：

- **读取**: 允许所有人读取活跃的工具
- **创建**: 只允许认证用户创建工具
- **更新**: 只允许认证用户更新工具
- **删除**: 只允许认证用户删除工具

## 注意事项

1. **数据备份**: 在运行迁移脚本前，请确保备份重要数据
2. **URL 兼容性**: 现有的工具链接将失效，需要重新生成
3. **测试**: 在生产环境部署前，请在测试环境中充分测试
4. **监控**: 部署后监控应用性能，确保 UUID 查询性能满足要求

## 回滚计划

如果需要回滚到 integer ID：

1. 恢复 `src/types/database.ts` 中的类型定义
2. 更新所有相关组件的类型定义
3. 在 Supabase 中重新创建使用 integer ID 的表结构
4. 恢复数据（如果有备份）

## 性能考虑

- UUID 比 integer 占用更多存储空间
- UUID 查询性能可能略低于 integer
- 已添加适当的索引来优化查询性能
- 对于小到中等规模的应用，性能差异通常可以忽略 
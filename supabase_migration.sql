-- Supabase 表结构迁移脚本
-- 将 tools 表的 id 字段从 integer 改为 uuid

-- 1. 首先删除现有的表（如果存在）
DROP TABLE IF EXISTS tools;

-- 2. 创建新的 tools 表，使用 uuid 作为主键
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

-- 3. 创建索引以提高查询性能
CREATE INDEX idx_tools_subject ON tools(subject);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_tools_views ON tools(views);
CREATE INDEX idx_tools_is_active ON tools(is_active);

-- 4. 启用 Row Level Security (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 5. 创建策略（允许所有用户读取，但只有认证用户才能创建/更新）
-- 读取策略：允许所有人读取活跃的工具
CREATE POLICY "Allow public read access to active tools" ON tools
  FOR SELECT USING (is_active = true);

-- 插入策略：允许认证用户创建工具
CREATE POLICY "Allow authenticated users to create tools" ON tools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 更新策略：允许认证用户更新工具
CREATE POLICY "Allow authenticated users to update tools" ON tools
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 删除策略：允许认证用户删除工具
CREATE POLICY "Allow authenticated users to delete tools" ON tools
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. 创建触发器来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tools_updated_at 
  BEFORE UPDATE ON tools 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. 插入一些示例数据（可选）
INSERT INTO tools (title, subject, description, file_url, views) VALUES
('函数图像绘制器', 'math', '直观绘制各种函数图像，支持参数调整，帮助学生理解函数性质与图像变化规律。', 'https://example.com/tool1.html', 0),
('电路模拟器', 'physics', '虚拟搭建电路，模拟电流电压变化，直观理解欧姆定律和电路原理。', 'https://example.com/tool2.html', 0),
('化学元素周期表', 'chemistry', '交互式元素周期表，显示元素详细信息，支持搜索和筛选功能。', 'https://example.com/tool3.html', 0); 
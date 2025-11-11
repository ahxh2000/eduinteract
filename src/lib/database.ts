import { supabase } from './supabase'
import { Tool } from '@/types/database'
import { deleteR2File } from './r2'

export const toolService = {
  // 保存工具记录
  async saveTool(toolData: Omit<Tool, 'id' | 'created_at' | 'updated_at'>): Promise<Tool> {
    const { data, error } = await supabase
      .from('tools')
      .insert([toolData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 根据ID获取单个工具
  async getToolById(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // 记录不存在
        return null
      }
      throw error
    }
    return data
  },

  // 获取所有工具
  async getAllTools(): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 管理后台：获取所有工具（包括停用的）
  async getAllToolsForAdmin(): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 按学科筛选工具
  async getToolsBySubject(subject: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('subject', subject)
      .eq('is_active', true)
      .order('views', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 管理后台：按学科筛选工具（包括停用的）
  async getToolsBySubjectForAdmin(subject: string): Promise<Tool[]> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('subject', subject)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // 管理后台：根据ID获取单个工具（不限制 is_active）
  async getToolByIdAll(id: string): Promise<Tool | null> {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data
  },

  // 更新工具
  async updateTool(id: string, update: Partial<Omit<Tool, 'id' | 'created_at' | 'updated_at'>>): Promise<Tool | null> {
    const { data, error } = await supabase
      .from('tools')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // 增加浏览量
  async incrementViews(id: string): Promise<void> {
    // 先获取当前浏览量
    const { data: currentTool, error: fetchError } = await supabase
      .from('tools')
      .select('views')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 更新浏览量
    const currentViews = currentTool?.views || 0;
    const { error: updateError } = await supabase
      .from('tools')
      .update({
        views: currentViews + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) throw updateError;
  },

  // 彻底删除工具（删除R2文件和数据库记录）
  async deleteTool(id: string): Promise<boolean> {
    // 获取工具信息
    const tool = await this.getToolByIdAll(id);
    if (!tool) return false;
    
    // 删除R2文件
    if (tool.file_url) {
      try {
        // 从URL中提取key，bucket使用环境变量
        const url = new URL(tool.file_url);
        const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
        const bucket = process.env.R2_BUCKET_NAME;
        
        console.log('删除R2文件:', { bucket, key, fileUrl: tool.file_url });
        await deleteR2File(bucket!, key);
        console.log('R2文件删除成功');
      } catch (e) {
        // 文件删除失败不影响主流程
        console.error('删除R2文件失败', e);
      }
    }
    
    // 删除数据库记录
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
} 
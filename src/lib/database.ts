import { supabase } from './supabase'
import { Tool } from '@/types/database'

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

  // 软删除工具（设置 is_active=false）
  async deleteTool(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tools')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    return true
  },
} 
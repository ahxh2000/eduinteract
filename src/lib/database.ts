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
  }
} 
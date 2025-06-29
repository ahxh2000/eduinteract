export interface Tool {
  id: string
  title: string
  subject: string  // 只保存学科key
  description: string
  file_url: string
  views: number
  created_at: string
  updated_at: string
  is_active: boolean
  // 删除 subject_label 和 subject_color
} 
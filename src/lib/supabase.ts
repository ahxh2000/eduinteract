import { createClient } from '@supabase/supabase-js'

// 添加环境变量检查和错误处理
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    SUPABASE_URL: !!supabaseUrl,
    SUPABASE_ANON_KEY: !!supabaseAnonKey
  });
  throw new Error('Supabase configuration is missing. Please check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // 添加一些默认配置以提高稳定性
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
}) 
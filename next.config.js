/** @type {import('next').NextConfig} */
const nextConfig = {
  // 服务器外部包配置 (移到根级别)
  serverExternalPackages: ['@supabase/supabase-js'],

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 图片优化 - Cloudflare 需要禁用
  images: {
    unoptimized: true,
    domains: [
      // 添加你的 R2 存储桶域名
      'your-r2-bucket.r2.cloudflarestorage.com',
      // 如果有自定义域名，也添加到这里
    ],
  },

  // 重定向和重写规则
  async redirects() {
    return [
      // 可以在这里添加重定向规则
    ]
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

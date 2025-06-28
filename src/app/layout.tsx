import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduInteract - 互动式教学工具平台 | 让学习更生动有效',
  description: '为教师和学生提供120+互动教学工具，覆盖数学、物理、化学、生物、地理、历史等学科。通过直观的模拟器、绘制器和探索工具，让抽象概念变得具体可感，提升教学效果和学习体验。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

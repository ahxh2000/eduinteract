"use client";

import React from "react";
import { FaArrowRight, FaSearch, FaSlidersH, FaWeixin, FaWeibo, FaQq, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

// 学科筛选组件
const subjects = [
  { key: "all", label: "全部学科", color: "bg-primary text-white" },
  { key: "math", label: "数学", color: "bg-neutral-100 text-neutral-600" },
  { key: "physics", label: "物理", color: "bg-neutral-100 text-neutral-600" },
  { key: "chemistry", label: "化学", color: "bg-neutral-100 text-neutral-600" },
  { key: "biology", label: "生物", color: "bg-neutral-100 text-neutral-600" },
  { key: "geography", label: "地理", color: "bg-neutral-100 text-neutral-600" },
  { key: "history", label: "历史", color: "bg-neutral-100 text-neutral-600" },
];

function SubjectFilter({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {subjects.map((s) => (
        <button
          key={s.key}
          className={`subject-filter px-5 py-2 rounded-full font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-primary-200 ${selected === s.key ? "bg-primary text-white border-primary shadow-md" : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-primary-50 hover:text-primary hover:border-primary"}`}
          onClick={() => onSelect(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// 工具卡片静态数据
const tools = [
  { title: "函数图像绘制器", subject: "math", subjectLabel: "数学", subjectColor: "bg-primary/90", views: "2.4k", desc: "直观绘制各种函数图像，支持参数调整，帮助学生理解函数性质与图像变化规律。" },
  { title: "几何图形构造器", subject: "math", subjectLabel: "数学", subjectColor: "bg-primary/90", views: "1.8k", desc: "交互式构造几何图形，测量角度与距离，探索几何定理，培养空间想象能力。" },
  { title: "电路模拟器", subject: "physics", subjectLabel: "物理", subjectColor: "bg-secondary/90", views: "3.1k", desc: "虚拟搭建电路，模拟电流电压变化，直观理解欧姆定律和电路原理。" },
  { title: "力学模拟器", subject: "physics", subjectLabel: "物理", subjectColor: "bg-secondary/90", views: "2.7k", desc: "模拟物体受力运动，分析速度、加速度与力的关系，理解牛顿运动定律。" },
  { title: "元素周期表互动工具", subject: "chemistry", subjectLabel: "化学", subjectColor: "bg-tertiary/90", views: "2.2k", desc: "交互式元素周期表，查看元素特性、电子排布、化学性质及相关化合物信息。" },
  { title: "化学反应模拟器", subject: "chemistry", subjectLabel: "化学", subjectColor: "bg-tertiary/90", views: "2.9k", desc: "虚拟模拟化学反应过程，观察物质变化与能量转换，安全演示危险化学反应。" },
  { title: "细胞结构探索工具", subject: "biology", subjectLabel: "生物", subjectColor: "bg-purple-500/90", views: "1.9k", desc: "3D交互式细胞结构模型，探索动植物细胞组成，了解细胞器功能与细胞生命活动。" },
  { title: "遗传规律模拟器", subject: "biology", subjectLabel: "生物", subjectColor: "bg-purple-500/90", views: "1.7k", desc: "模拟孟德尔遗传实验，可视化基因分离与自由组合规律，理解遗传概率计算。" },
  { title: "3D地球模型", subject: "geography", subjectLabel: "地理", subjectColor: "bg-cyan-500/90", views: "1.5k", desc: "交互式3D地球模型，查看地形地貌、气候分布、板块构造，探索地球奥秘。" },
  { title: "历史时间轴", subject: "history", subjectLabel: "历史", subjectColor: "bg-amber-500/90", views: "1.3k", desc: "交互式历史时间轴，探索各文明发展历程，关联重要历史事件与人物。" },
];

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  return (
    <div className="tool-card group bg-white rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-2 p-6" data-subject={tool.subject} data-title={tool.title}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-neutral-700 group-hover:text-primary transition-colors">{tool.title}</h3>
        <span className={`px-2 py-1 ${tool.subjectColor} text-white text-xs font-medium rounded`}>{tool.subjectLabel}</span>
      </div>
      <p className="text-neutral-500 text-sm mb-6">{tool.desc}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-neutral-400">
          <span className="fa fa-eye mr-1" /> {tool.views}
        </div>
        <a href="#" className="view-tool px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors flex items-center">
          查看工具 <span className="fa fa-arrow-right ml-2 text-xs" />
        </a>
      </div>
    </div>
  );
}

// 统计区块
const stats = [
  { value: "120+", label: "教学工具" },
  { value: "10+", label: "学科分类" },
  { value: "50k+", label: "月活跃用户" },
  { value: "98%", label: "用户满意度" },
];

// 订阅区块
function SubscribeSection() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-4">获取最新教学工具更新</h2>
          <p className="text-neutral-500 mb-8">订阅我们的通讯，第一时间获取新工具发布、教学案例和教育资源</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" placeholder="输入您的邮箱地址" className="flex-grow px-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
              立即订阅
            </button>
          </form>
          <p className="text-xs text-neutral-400 mt-4">我们尊重您的隐私，不会向第三方分享您的信息</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedSubject, setSelectedSubject] = React.useState("all");
  const filteredTools = selectedSubject === "all" ? tools : tools.filter(t => t.subject === selectedSubject);
  return (
    <div className="font-inter bg-neutral-100 text-neutral-700 min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* 网站Logo */}
            <a href="#" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="text-xl">🎓</span>
              </div>
              <span className="text-xl font-bold text-neutral-700">EduInteract</span>
            </a>
            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-primary font-medium border-b-2 border-primary pb-1">首页</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">关于我们</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">资源中心</a>
              <a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">联系我们</a>
            </nav>
            {/* 搜索和移动端菜单按钮 */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input type="text" placeholder="搜索教学工具..." className="pl-10 pr-4 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-48 md:w-64 transition-all duration-200" />
                <span className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
              <button className="md:hidden text-neutral-600">
                <span className="fa fa-bars text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* 英雄区域 */}
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-neutral-700 leading-tight mb-6">
                探索互动式<br />教学工具的无限可能
              </h1>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-neutral-600 mb-8 text-balance">
                为各学科教师和学生提供直观、有趣的互动教学工具，让学习变得更加生动有效
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#tools"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg hover:bg-primary-600 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  浏览教学工具
                </a>
                <a
                  href="#"
                  className="px-8 py-3 bg-white text-primary border border-primary rounded-lg font-semibold hover:bg-primary-50 hover:text-primary-700 hover:border-primary-600 transition-all duration-300 text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  了解更多 <FaArrowRight className="ml-2 text-primary text-base" />
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* 学科筛选和搜索 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-4">按学科浏览教学工具</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">我们提供覆盖多个学科的互动教学工具，帮助教师打造更具吸引力的课堂，激发学生的学习兴趣</p>
            </div>
            <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
            {/* 搜索栏（静态，后续可加交互） */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <input type="text" placeholder="搜索教学工具，如'函数图像绘制'、'电路模拟'..." className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200 text-base" />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <FaSlidersH className="text-lg" />
              </div>
            </div>
          </div>
        </section>
        {/* 工具展示区 */}
        <section id="tools" className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid-masonry" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gridGap:'1.5rem',gridAutoFlow:'dense'}}>
              {filteredTools.map(tool => <ToolCard key={tool.title} tool={tool} />)}
            </div>
          </div>
        </section>
        {/* 统计区块 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(stat => (
                <div className="p-6" key={stat.label}>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* 订阅区块 */}
        <SubscribeSection />
        
      </main>

      {/* 页脚 */}
      <footer className="bg-neutral-800 text-white pt-16 pb-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* 简介区块 */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary">
                  <span className="text-xl">🎓</span>
                </div>
                <span className="text-xl font-bold">EduInteract</span>
              </div>
              <p className="text-neutral-400 mb-6">为教育工作者和学生提供高质量的互动教学工具，助力打造更高效、更有趣的学习体验。</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <FaWeixin className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <FaWeibo className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <FaQq className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <FaYoutube className="text-xl" />
                </a>
              </div>
            </div>
            {/* 快速链接区块 */}
            <div>
              <h3 className="text-lg font-bold mb-6">快速链接</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">首页</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">所有工具</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">学科分类</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">教学案例</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">关于我们</a></li>
              </ul>
            </div>
            {/* 学科分类区块 */}
            <div>
              <h3 className="text-lg font-bold mb-6">学科分类</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">数学</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">物理</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">化学</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">生物</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">地理</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">历史</a></li>
              </ul>
            </div>
            {/* 联系我们区块 */}
            <div>
              <h3 className="text-lg font-bold mb-6">联系我们</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="mt-1 text-neutral-400" />
                  <span className="text-neutral-400">北京市海淀区中关村大街1号</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaPhone className="text-neutral-400" />
                  <span className="text-neutral-400">+86 10 8888 7777</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FaEnvelope className="text-neutral-400" />
                  <span className="text-neutral-400">contact@eduinteract.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-500 text-sm mb-4 md:mb-0">© 2025 EduInteract. 保留所有权利。</p>
              <div className="flex space-x-6">
                <a href="#" className="text-neutral-500 text-sm hover:text-primary transition-colors duration-200">隐私政策</a>
                <a href="#" className="text-neutral-500 text-sm hover:text-primary transition-colors duration-200">使用条款</a>
                <a href="#" className="text-neutral-500 text-sm hover:text-primary transition-colors duration-200">Cookie政策</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

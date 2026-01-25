"use client";

import React from "react";
import { FaArrowRight, FaSearch, FaSlidersH, FaUpload } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";//--------lmn增加的
import { useSearchParams, useRouter } from "next/navigation";//--------lmn增加的
import { Tool } from "@/types/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { subjectConfig } from "@/lib/subjectConfig";

// 学科筛选组件
const subjects = [
  { key: "all", label: "全部学科", color: "bg-primary text-white" },
  ...Object.entries(subjectConfig).map(([key, config]) => ({
    key,
    label: config.label,
    color: "bg-neutral-100 text-neutral-600"
  }))
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

function ToolCard({ tool }: { tool: Tool }) {
  // 从本地配置获取样式信息，如果找不到则使用默认配置
  const subjectInfo = subjectConfig[tool.subject as keyof typeof subjectConfig] || {
    label: tool.subject || "其他",
    color: "bg-gray-500/90"
  };

  return (
    <div className="tool-card group bg-white rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-2 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-neutral-700 group-hover:text-primary transition-colors">
          {tool.title}
        </h3>
        <span className={`px-2 py-1 ${subjectInfo.color} text-white text-xs font-medium rounded`}>
          {subjectInfo.label}
        </span>
      </div>
      <p className="text-neutral-500 text-sm mb-2">{tool.description}</p>
      <div className="text-xs text-gray-400 mb-4">
        浏览量：{tool.views || 0} 次
      </div>
      <div className="flex justify-end">
        <Link
          href={`/tool/${tool.id}`}
          className="view-tool px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors flex items-center"
        >
          查看工具 <FaArrowRight className="ml-2 text-xs" />
        </Link>
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
  const [searchKeyword, setSearchKeyword] = React.useState(""); // 新增：搜索关键词-----lmn
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  //----------lmn增加的（头部搜索框）
  const searchParams = useSearchParams();
  const router = useRouter();
  // 从 URL 参数中读取搜索关键词
  useEffect(() => {
    const urlSearchKeyword = searchParams.get('search');
    if (urlSearchKeyword) {
      setSearchKeyword(decodeURIComponent(urlSearchKeyword));
    }
  }, [searchParams]);//-----结束

  // 修改过滤逻辑，同时考虑学科和搜索词---lmn
  const filteredTools = tools.filter(tool => {
    // 学科过滤---lmn
    const subjectMatch = selectedSubject === "all" || tool.subject === selectedSubject;

    /*const filteredTools = selectedSubject === "all" ? tools : tools.filter(t => t.subject === selectedSubject);*/

    // 搜索词过滤----lmn
    const keywordMatch = searchKeyword === "" ||
      tool.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return subjectMatch && keywordMatch;
  });

  // 加载工具数据
  const loadTools = async (subject?: string, keyword?: string) => {//, keyword?: string是增加的---lmn
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (subject && subject !== 'all') params.append('subject', subject);
      if (keyword && keyword.trim() !== '') params.append('search', keyword.trim());//lmn------增加整行

      const response = await fetch(`/api/tools?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setTools(data.tools);
      }
    } catch (error) {
      console.error('加载工具失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 在useEffect中调用-----lmn增加的
  React.useEffect(() => {
    loadTools(selectedSubject, searchKeyword);
  }, [selectedSubject, searchKeyword]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleClearSearch = () => {
    setSearchKeyword("");
    // 清除 URL 中的搜索参数
    router.push("/");
  };//----------结束

  return (
    <div className="font-inter bg-neutral-100 text-neutral-700 min-h-screen flex flex-col">
      {/* 导航栏 */}
      <Header />

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
                <Link
                  href="/fileupload"
                  className="px-8 py-3 bg-white text-primary border border-primary rounded-lg font-semibold hover:bg-primary-50 hover:text-primary-700 hover:border-primary-600 transition-all duration-300 text-center flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <FaUpload className="mr-2 text-primary text-base" />
                  上传工具
                </Link>
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
            {/* 修改搜索栏部分------lmn*/}
            <div className="relative max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="搜索教学工具，如'函数图像绘制'、'电路模拟'..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200 text-base"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    <FaSearch className="text-sm" />

                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 工具展示区 */}
        <section id="tools" className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">正在加载工具...</p>
              </div>
            ) : filteredTools.length > 0 ? (
              <div className="grid-masonry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gridGap: '1.5rem', gridAutoFlow: 'dense' }}>
                {filteredTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无工具数据</p>
              </div>
            )}
          </div>
        </section>

        {/* 统计区块
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
         */}
        {/* 订阅区块 */}
        <SubscribeSection />
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}

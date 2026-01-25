"use client";//--------lmn增加的

//import React from "react";
import React, { useState } from "react";//------lmn增加的
import type { FormEvent } from "react";//------lmn增加的
import { FaSearch, FaUpload } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";//-------lmn增加的

interface HeaderProps {
  showSearch?: boolean;
  showUpload?: boolean;
}

export default function Header({ showSearch = true, showUpload = false }: HeaderProps) {
//------------lmn增加的
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      // 导航到首页并传递搜索参数
      router.push(`/?search=${encodeURIComponent(searchKeyword.trim())}`);
      // 清空搜索框
      setSearchKeyword("");
    }
  };
//---------结束
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* 网站Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="text-xl">🎓</span>
            </div>
            <span className="text-xl font-bold text-neutral-700">EduInteract</span>
          </Link>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-primary font-medium border-b-2 border-primary pb-1">首页</Link>
            {showUpload && (
              <Link href="/fileupload" className="text-neutral-600 hover:text-primary transition-colors duration-200 flex items-center">
                <FaUpload className="mr-1" />
                上传工具
              </Link>
            )}
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">关于我们</a>
            <a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">联系我们</a>
          </nav>
          
          {/* 搜索和移动端菜单按钮 
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="搜索教学工具..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-48 md:w-64 transition-all duration-200" 
                />
                <span className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            )}
            <button className="md:hidden text-neutral-600">
              <span className="fa fa-bars text-xl" />
            </button>
          </div>*/}

          {/* 搜索和移动端菜单按钮-----------------lmn增加的 */}
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch}>
                  <input 
                    type="text" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="搜索教学工具..." 
                    className="pl-10 pr-4 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-48 md:w-64 transition-all duration-200" 
                  />
                  <button 
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>
            )}
            <button className="md:hidden text-neutral-600">
              <span className="fa fa-bars text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
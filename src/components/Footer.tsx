"use client";

import React from "react";
import { FaWeixin, FaWeibo, FaQq, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

// 学科配置
const subjectConfig = {
  math: { label: "数学", color: "bg-primary/90" },
  physics: { label: "物理", color: "bg-secondary/90" },
  chemistry: { label: "化学", color: "bg-tertiary/90" },
  biology: { label: "生物", color: "bg-purple-500/90" },
  geography: { label: "地理", color: "bg-cyan-500/90" },
  history: { label: "历史", color: "bg-amber-500/90" },
};

export default function Footer() {
  return (
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
            <p className="text-neutral-400 mb-6">
              为教育工作者和学生提供高质量的互动教学工具，助力打造更高效、更有趣的学习体验。
            </p>
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
              <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors duration-200">首页</Link></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">所有工具</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">教学案例</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">关于我们</a></li>
            </ul>
          </div>
          
          {/* 学科分类区块 */}
          <div>
            <h3 className="text-lg font-bold mb-6">学科分类</h3>
            <ul className="space-y-3">
              {Object.entries(subjectConfig).map(([key, config]) => (
                <li key={key}>
                  <a href="#" className="text-neutral-400 hover:text-primary transition-colors duration-200">
                    {config.label}
                  </a>
                </li>
              ))}
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
  );
} 
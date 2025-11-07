'use client'

import { useEffect, useRef } from 'react'

interface ViewCounterProps {
  toolId: string
}

export default function ViewCounter({ toolId }: ViewCounterProps) {
  const lastCallTime = useRef(0)

  useEffect(() => {
    const now = Date.now()
    
    // 如果1秒内已经调用过，就跳过（防止开发模式重复调用）
    if (now - lastCallTime.current < 1000) {
      return
    }
    
    lastCallTime.current = now
    
    const increaseViewCount = async () => {
      try {
        const response = await fetch(`/api/tools/${toolId}`);
        const data = await response.json();
        
        // 更新页面上的浏览量显示
        if (data.tool) {
          const viewCountElement = document.getElementById('view-count');
          if (viewCountElement) {
            viewCountElement.textContent = data.tool.views.toString();
          }
        }
      } catch (error) {
        console.error('增加浏览量失败:', error);
      }
    };

    increaseViewCount();
  }, [toolId]);
  
  return null;
}
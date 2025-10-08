// 学科配置
export const subjectConfig = {
  math: { label: "数学", color: "bg-primary/90" },
  physics: { label: "物理", color: "bg-secondary/90" },
  chemistry: { label: "化学", color: "bg-tertiary/90" },
  biology: { label: "生物", color: "bg-purple-500/90" },
  geography: { label: "地理", color: "bg-cyan-500/90" },
  history: { label: "历史", color: "bg-amber-500/90" },
  chinese: { label: "语文", color: "bg-green-500/90" },
  english: { label: "英语", color: "bg-blue-500/90" },
};

export type SubjectKey = keyof typeof subjectConfig; 
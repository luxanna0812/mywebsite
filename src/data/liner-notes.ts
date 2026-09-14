interface LinerNote {
  label: string;
  intro: string;
  thought: string;
  accent: string;
  paper: string;
  keywords: [string, string, string];
}

export const linerNotes: Record<string, LinerNote> = {
  profile: {
    label: 'A PORTRAIT IN PROGRESS',
    intro: '从研究到表达，从一个人的观察到一群人的协作。这些经历，慢慢勾勒出我的工作方式。',
    thought: '理解一个人，也许可以从她愿意为什么停下来开始。',
    accent: '#755d48', paper: '#e9e1d2', keywords: ['观察', '转译', '连接'],
  },
  education: {
    label: 'WAYS OF LEARNING',
    intro: '课堂、编辑部、社区与项目现场，共同构成了我的学习路径。沿着时间回看，也能看见问题如何生长。',
    thought: '经历会过去，学会提问的方式会留下来。',
    accent: '#667052', paper: '#e3e5d9', keywords: ['学习', '迁移', '实践'],
  },
  research: {
    label: 'THE PRACTICE OF ATTENTION',
    intro: '在传播、内容与服务的具体现场，把散落的信息整理好，把需要抵达的事情交付出去。',
    thought: '留意细节，是我参与世界的一种方式。',
    accent: '#4d6a70', paper: '#dfe6e3', keywords: ['内容', '协作', '交付'],
  },
  strategy: {
    label: 'FROM QUESTIONS TO POSSIBILITIES',
    intro: '从一个模糊的问题出发，寻找可以共同讨论的坐标，再让想法拥有行动的形状。',
    thought: '好的框架，让不同经验的人能够接着往下走。',
    accent: '#69714a', paper: '#e3e5d5', keywords: ['洞察', '判断', '行动'],
  },
  campaign: {
    label: 'SMALL ACTS, SHARED WORLDS',
    intro: '一封回信、一堂烹饪课、一场展览，以及反复赴约的日常。关系就在这些具体的事情里发生。',
    thought: '关心需要时间，也需要一次次具体的回应。',
    accent: '#985441', paper: '#eee0d7', keywords: ['倾听', '陪伴', '在场'],
  },
  content: {
    label: 'WAYS OF SEEING',
    intro: '把看见的、听到的、想明白的，留在文字与画面里。这一面，收录作品，也收录目光停留的瞬间。',
    thought: '按下快门，是给一个普通瞬间多一点时间。',
    accent: '#876a3f', paper: '#eee5ce', keywords: ['文字', '影像', '叙事'],
  },
  'visual-work': {
    label: 'LIFE BETWEEN THE LINES',
    intro: '音乐、电影、山路与城市漫游。那些没有被写进职位描述的部分，也一直参与着我的成长。',
    thought: '允许一些经验暂时没有用途，只是成为生活。',
    accent: '#506872', paper: '#dfe5e3', keywords: ['声音', '远行', '日常'],
  },
  'ai-experiments': {
    label: 'STAY WITH THE QUESTION',
    intro: '从粉丝文化到 AI 与情感，我关心技术和文化如何进入生活，以及人如何在其中理解自己。',
    thought: '研究的结尾，也可以是下一次认真观察的开头。',
    accent: '#68725d', paper: '#e2e5dc', keywords: ['文化', '技术', '情感'],
  },
  'personal-notes': {
    label: 'AN OPEN ENDING',
    intro: '一段生活已经收束，新的形状还在生长。在确定与未定之间，记下此刻愿意相信的事。',
    thought: '给答案留一点空白，也给自己留一点成为的余地。',
    accent: '#866346', paper: '#e9dfd0', keywords: ['此刻', '留白', '生成'],
  },
};

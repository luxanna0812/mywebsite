export interface RecordEntry {
  number: string; slug: string; title: string; category: string;
  year?: string; cover?: string; coverStyle: string; coverText: string;
  href: string; order: number; audio: string;
}
export interface DetailSection {
  heading: string;
  period?: string;
  intro?: string;
  bullets?: string[];
  tags?: string[];
  links?: { label: string; url?: string }[];
}
export interface TimelineEntry {
  period: string;
  title: string;
  type: 'education' | 'work' | 'project';
  location?: string;
  description: string;
  highlights: string[];
  tags: string[];
}
export interface TravelSpot {
  name: string;
  x: number;
  y: number;
}
const entries = [
  ['profile', 'About Me', '关于我', 'portrait', 'self.'],
  ['education', 'Timeline', '时间线', 'pages', 'Ways of\nlearning.'],
  ['research', 'Work', '工作经历', 'orbit', 'Look closer.'],
  ['strategy', 'Projects', '项目经历', 'path', 'Which\nway?'],
  ['campaign', 'Volunteering', '志愿与社区', 'type', 'MAKE\nIT\nMATTER.'],
  ['content', 'Portfolio', '作品集', 'editorial', 'Words,\nwith\nmeaning.'],
  ['visual-work', 'Beyond the CV', '简历之外', 'geometry', 'FORM\n& FEELING'],
  ['ai-experiments', 'Thinking', '思考与研究', 'dots', 'What\nif_'],
  ['personal-notes', 'Now / Next', '现在与未来', 'notes', 'Things\nI noticed.'],
];
export const records: RecordEntry[] = entries.map(([slug, title, category, coverStyle, coverText], index) => ({
  number: String(index + 1).padStart(2, '0'), slug, title, category, coverStyle, coverText,
  href: `/library/${slug}/`, order: index + 1,
  cover: `/covers/${index + 1}.jpg`,
  audio: `/audio/${index + 1}.m4a`,
})).sort((a, b) => a.order - b.order);

export const detailSections: Record<string, DetailSection[]> = {
  profile: [
    { heading: '关于我', intro: '我是一名战略传播与文化研究方向的硕士生，拥有广告学、内容运营、公共关系、新闻采编与文化项目实践经验。我的工作方式连接研究、内容与真实的人。', tags: ['战略传播', '文化研究', '内容策划', '中英双语'] },
    { heading: '我能带来的能力', bullets: ['把复杂信息整理成清晰的内容、策略或可执行流程。', '在中文与英文环境中完成写作、沟通、采访、活动执行与客户协作。', '用研究、数据和复盘支持内容运营、品牌传播与项目决策。'], tags: ['研究与分析', '项目统筹', '社群沟通', '视觉内容'] },
    { heading: '基础信息', bullets: ['伦敦政治经济学院战略传播及社会硕士在读（2025.09–2026.11）。', '四川大学广告学学士，GPA 3.91 / 4.0。', 'IELTS 7.5；CET-4 630；CET-6 603。'] },
  ],
  education: [
    { heading: '伦敦政治经济学院（LSE）', period: '2025.09–2026.11 · 在读', intro: '战略传播及社会硕士，学院为新闻传媒学院。研究关注中国粉丝如何理解并评价日本音乐人藤井风迈向全球音乐工业的转型。', tags: ['粉丝文化', '数字民族志', '半结构化访谈', '主题分析'] },
    { heading: '四川大学', period: '2021.09–2025.06', intro: '广告学学士，GPA 3.91 / 4.0。本科优秀毕业论文《AI 复生：从悼念到消费》，从技术哲学与欲望理论讨论 AI 数字复生、悼念实践与情感消费。', tags: ['传播理论', 'AI 与社会', '案例分析'] },
    { heading: '纽卡斯尔大学（英国）', period: '2023.09–2024.06', intro: 'Media Culture & Heritage 交换学习，在英文环境中学习媒体、文化与遗产研究，并参与当地社区志愿服务。', tags: ['跨文化适应', '文化遗产', '英文学习与工作'] },
    { heading: '城市轨迹', intro: '重庆 → 成都 → 上海 → 纽卡斯尔 → 伦敦。每一次迁移都让我在不同的组织、社区与文化现场中重新理解“传播”如何发生。' },
  ],
  research: [
    { heading: '良介文化世界电影节', period: '2026.04–2026.09 · 内容设计、展映运营', bullets: ['每周统筹 2 场线上展映，覆盖 500+ 人次，负责流程、调度与突发状况处置。', '协助筛选、分工、排班并培训 10 名志愿者，对接片方、场地方、字幕与技术团队。', '设计展映宣传物料，剪辑导演嘉宾对谈视频，并根据票务与参与数据输出排片建议。'], tags: ['项目统筹', '多方对接', '展映运营', '内容设计'] },
    { heading: 'Gusto Collective', period: '2025.02–2025.05 · 奢侈品 PR 实习生', bullets: ['为 FHCM 与路易十三撰写、打磨并中英双语转化新闻稿及宣传文案。', '整理 50+ 客户合作案例与 200+ 宣传素材，使用 Excel 输出周报、月报和平台反馈。', '运营小红书、抖音、微博三大平台，累计播放量 10 万+、点赞 1.2 万+、互动 800+；对接 30+ 媒体/KOL，落地 5 篇报道与内容。'], tags: ['PR', '品牌传播', '社媒运营', '数据分析'] },
    { heading: '四川省图书馆', period: '2024.10–2024.12 · 图书管理员', bullets: ['协助采购 10 余种新书与电子资源，完成上百册新书分类、编目和元数据录入。', '参与“四川地方志”“巴蜀文化数据库”等地方文化资源建设。'], tags: ['文献资源', '元数据', '数据库建设'] },
    { heading: '字节跳动 · 番茄小说', period: '2024.07–2024.09 · 内容质量检测中心', bullets: ['完成 500+ 本电子出版物质量核验，归档 500+ 项问题并提出改进方案。', '完成 800+ 份出版物分类与标签标注，分类准确率 97%；前置识别 5 起潜在版权或内容安全风险。'], tags: ['内容审核', '质量管控', '平台治理'] },
    { heading: '成都日报锦观新闻', period: '2023.05–2023.08 · 实习记者', bullets: ['参与“Panda Loves TCM”融媒体运营：策划原创 27 条、剪辑短视频 15 条、撰写及翻译文案 40 篇。', '独立完成智慧农业专题采访，走访 5 个点位、采访 3 名专家与 8 户农户，形成 1000 字深度报道。'], tags: ['新闻采访', '融媒体', '短视频', '中英文内容'] },
  ],
  strategy: [
    { heading: 'LSE Skills Accelerator Nano Project', period: '2026.01–2026.03 · AvecPortales Coaching+Consulting', intro: '为加拿大教育与成长初创公司研究 AI 情感陪伴软件与高端康养旅行的市场方向。', bullets: ['搜集 12 家代表性玩家资料，从产品形态、定价、目标用户、AI 能力 4 个维度建立竞品对标表。', '沿用户旅程归纳服务难规模化、旅程结束后缺少持续支持、临床 AI 伦理争议 3 大痛点。', '以菲律宾 Kapwa 关系哲学提出“数字入口 → 实体转型 → 品牌外化”的商业飞轮，与团队完成 30 页提案并交付客户。'], tags: ['市场调研', '竞品分析', '痛点诊断', 'AI 产品策略'] },
    { heading: '大学生创新创业项目 · 彝族语言景观', period: '2022.11–2023.05', intro: '围绕彝族语言景观开展的大学生创新创业训练计划项目。具体研究内容与分工待补充。', tags: ['学术研究', '田野调查', '语言文化'] },
  ],
  campaign: [
    { heading: 'Holborn Community Association Doorstep Help', period: '2025.10–2026.09 · 伦敦', bullets: ['每周为高龄、行动受限的独居老人提供陪伴，协助整理房间、采购药品与蔬果。', '通过固定上门、电话问候、散步谈心建立持续的情感联结。'], tags: ['社区服务', '长者关怀', '同理心'] },
    { heading: 'Migrateful Cookery Classes', period: '2025.12–2026.02 · 伦敦', bullets: ['协助移民厨师完成厨房筹备与食材备料，支持 5 场公益烹饪课。', '服务 40+ 名本地参与者，完成课后清洁消杀，100% 符合卫生要求，0 负面评价。'], tags: ['跨文化沟通', '公益项目', '活动执行'] },
    { heading: 'The Globe Café · Jesmond Church', period: '2023.11–2024.05 · 纽卡斯尔', intro: '为每周英语会话活动招募参与者、按语言水平分组、准备讨论材料，并协调场地、设备、签到与现场接待。', tags: ['社群招募', '活动执行', '英文环境'] },
    { heading: '“五彩石”心理辅导志愿', period: '2021.10–2023.06 · 四川大学', intro: '与偏远山区小学生通信结对，每两周进行作文交流，提供学业指导与生活支持，并参与专家督导和阶段性评估。', tags: ['长期志愿', '书信沟通', '心理支持'] },
  ],
  content: [
    { heading: '我创造过的内容', intro: '我的作品横跨文字、平面、视频、网页与研究型内容：从一条社交媒体文案，到一场展映、一篇深度报道或一份客户策略提案。', tags: ['文字', '平面', '视频', '网页', '视觉研究'] },
    { heading: '内容与视觉项目', bullets: ['成都日报：27 条原创内容、15 条短视频、40 篇中英文文案；完成 8 组 AIGC 视觉作品。', '四川大学官方媒体：策划“早安川大”“晚安川大”等系列，平均阅读 700+；设计 6 套品牌宣传海报。', '良介文化：设计电影节宣传物料，剪辑导演嘉宾对谈视频，为线上展映提供完整传播支持。'], tags: ['剪映', 'Canva', 'Midjourney', 'Recraft'] },
    { heading: '直接查看作品', intro: '以下入口可以直接查看我的视觉、文字与案例内容。', links: [
      { label: '小红书', url: 'https://xhslink.cn/o/5ENgYQVjCW7' },
      { label: '微信公众号：Simone的鱼塘' },
      { label: '网页：鲨鱼国的后花园', url: 'https://blog.94203344.xyz/' },
      { label: 'Notion 案例：Portfolio', url: 'https://brash-feeling-67b.notion.site/Portfolio-3567d96f056c8022a3f2c09586db186f' },
      { label: 'Notion 案例：Planning & Time Management', url: 'https://app.notion.com/p/Planning-Time-Management-A-Worked-Example-3567d96f056c80659e81ffec0a6059' },
    ] },
    { heading: '内容方法', intro: '先理解受众与场景，再确定叙事和视觉形式；用数据复盘内容表现，也保留文化内容应有的细节、语气与情绪。' },
  ],
  'visual-work': [
    { heading: '简历之外的我', intro: '我在工作之外持续通过音乐、旅行、影像与城市生活理解世界。对我而言，兴趣不是履历之外的装饰，而是观察、感受和建立连接的方式。', tags: ['音乐', '旅行', '电影', '文化生活'] },
    { heading: '声音与影像', bullets: ['偏好 Bossa Nova、微分摇滚与 J-Pop 等多元音乐风格。', '关注欧美、日本影视与当代文化内容，收听梁文道《八分半》《八分》等人文播客。'] },
    { heading: '在路上', bullets: ['游历欧洲多个国家，在不同城市观察地方文化与日常生活。', '喜欢徒步，走过尼泊尔、冰岛等地的特色路线。'] },
    { heading: '生活经验', intro: '在伦敦的社区志愿服务、咖啡店工作和跨文化学习，让我更直接地理解不同人的日常需求，也让我保持对具体生活的敏感。' },
  ],
  'ai-experiments': [
    { heading: 'LSE 粉丝文化研究', period: '2025.09–2026.11', intro: '以中文粉丝社群为田野，通过数字民族志与半结构化访谈，研究粉丝如何理解并评价日本音乐人藤井风迈向全球音乐工业的转型，以及他们如何协商真实性与情感。', tags: ['数字民族志', '半结构化访谈', '主题分析', '文化产业'] },
    { heading: '《AI 复生：从悼念到消费》', period: '四川大学本科优秀毕业论文', intro: '以 AI 数字复生现象为研究对象，结合弗鲁塞尔技术哲学与拉康欲望理论，探讨技术如何重塑当代悼念实践与情感消费。', tags: ['AI 与社会', '传播理论', '文献研究', '案例分析'] },
    { heading: '我的思考方式', bullets: ['从具体案例和人的经验出发，而不是只停留在抽象概念。', '把分散材料整理成可比较的维度、清晰的问题和可执行的建议。', '同时关注传播效果与文化语境，追问一个方案如何被真实的人理解、使用和感受。'] },
  ],
  'personal-notes': [
    { heading: '我现在在哪里', period: '伦敦 · 2026', intro: '目前在伦敦政治经济学院攻读战略传播及社会硕士，同时参与电影节内容设计与展映运营、社区志愿服务，并在英文环境中积累真实的工作与生活经验。' },
    { heading: '正在做的事', bullets: ['完成关于粉丝文化、全球音乐工业与情感协商的硕士研究。', '每周统筹线上电影节展映，持续练习项目管理、内容设计与多方协作。', '在社区服务与跨文化场景中保持对人和社会的观察。'] },
    { heading: '下一步', intro: '希望在传播、内容、新媒体运营、公关 PR、市场研究与咨询、用户研究、活动策划或文化机构等方向继续工作，把研究能力、内容能力和项目执行力结合起来。', tags: ['传播', '内容运营', 'PR', '市场研究', '文化项目'] },
    { heading: 'Contact', bullets: ['Email: simoneluxanna@outlook.com', '微信 / 电话：15683058711'] },
  ],
};

export const timelineEntries: TimelineEntry[] = [
  { period: '2026.04–2026.09', title: '良介文化世界电影节', type: 'work', location: '远程 · 内容设计、展映运营', description: '在文化项目现场，把内容、观众与合作方组织到同一条线上。', highlights: ['每周统筹 2 场线上展映，覆盖 500+ 人次。', '参与招募、培训和排班 10 名志愿者，对接片方、场地方及技术团队。'], tags: ['项目统筹', '展映运营'] },
  { period: '2026.01–2026.03', title: 'LSE Skills Accelerator Nano Project', type: 'project', location: '伦敦 · AI 项目咨询与策划', description: '为加拿大初创公司研究 AI 情感陪伴软件与高端康养旅行的市场方向。', highlights: ['完成 12 家竞品、4 个维度的对标分析。', '与团队完成 30 页终期提案并交付客户。'], tags: ['市场调研', 'AI 产品策略'] },
  { period: '2025.09–2026.11', title: '伦敦政治经济学院（LSE）', type: 'education', location: '伦敦 · 战略传播及社会硕士', description: '在文化研究与传播实践之间建立自己的问题意识，研究粉丝文化、全球音乐工业与情感协商。', highlights: ['以数字民族志、半结构化访谈和主题分析开展硕士研究。'], tags: ['粉丝文化', '数字民族志'] },
  { period: '2025.02–2025.05', title: 'Gusto Collective', type: 'work', location: '上海 · 奢侈品 PR 实习生', description: '在品牌、公关和社交媒体的交叉点工作，学习如何让信息准确抵达不同受众。', highlights: ['运营 3 个社媒平台，累计播放量 10 万+、点赞 1.2 万+、互动 800+。', '对接 30+ 媒体/KOL，落地 5 篇报道与内容。'], tags: ['PR', '品牌传播'] },
  { period: '2024.10–2024.12', title: '四川省图书馆', type: 'work', location: '成都 · 图书管理员', description: '在文献资源管理中理解信息如何被分类、保存，并重新被人找到。', highlights: ['协助引入 10 余种新资源，完成上百册新书分类、编目和元数据录入。'], tags: ['文献资源', '数据库建设'] },
  { period: '2024.07–2024.09', title: '字节跳动 · 番茄小说', type: 'work', location: '重庆 · 内容质量检测中心', description: '在大规模内容平台中训练判断力、规则意识与稳定的质量控制能力。', highlights: ['完成 500+ 本出版物核验及 500+ 项问题归档。', '完成 800+ 份分类标注，分类准确率 97%，前置识别 5 起潜在风险。'], tags: ['内容审核', '平台治理'] },
  { period: '2023.09–2024.06', title: '纽卡斯尔大学（英国）', type: 'education', location: '纽卡斯尔 · Media Culture & Heritage 交换学习', description: '第一次长期进入英文学习与生活环境，也在当地社区活动中实践跨文化沟通。', highlights: ['学习媒体、文化与遗产研究，并参与 The Globe Café 志愿服务。'], tags: ['跨文化适应', '文化遗产'] },
  { period: '2023.05–2023.08', title: '成都日报锦观新闻', type: 'work', location: '成都 · 实习记者', description: '从内容策划、采访到发布，完成一次完整的融媒体生产。', highlights: ['策划原创 27 条、剪辑短视频 15 条、撰写及翻译文案 40 篇。', '走访 5 个点位、采访 3 名专家与 8 户农户，完成 1000 字专题报道。'], tags: ['新闻采访', '融媒体'] },
  { period: '2021.09–2025.06', title: '四川大学', type: 'education', location: '成都 · 广告学学士', description: '以广告学为起点，逐步延伸到传播理论、文化研究和 AI 与社会议题。', highlights: ['GPA 3.91 / 4.0；完成本科优秀毕业论文《AI 复生：从悼念到消费》。'], tags: ['广告学', '传播理论'] },
];

export const travelSpots: TravelSpot[] = [
  { name: '冰岛', x: 31, y: 22 }, { name: '爱尔兰', x: 36, y: 30 },
  { name: '英国', x: 39, y: 32 }, { name: '葡萄牙', x: 37, y: 43 },
  { name: '西班牙', x: 40, y: 43 }, { name: '法国', x: 43, y: 39 },
  { name: '比利时', x: 46, y: 35 }, { name: '荷兰', x: 47, y: 32 },
  { name: '德国', x: 49, y: 37 }, { name: '波兰', x: 55, y: 35 },
  { name: '瑞士', x: 48, y: 43 }, { name: '奥地利', x: 52, y: 43 },
  { name: '意大利', x: 51, y: 49 }, { name: '希腊', x: 57, y: 53 },
  { name: '马耳他', x: 53, y: 58 }, { name: '尼泊尔', x: 74, y: 55 },
  { name: '泰国', x: 76, y: 67 }, { name: '越南', x: 81, y: 65 },
  { name: '台湾', x: 86, y: 57 }, { name: '韩国', x: 87, y: 42 },
  { name: '日本', x: 92, y: 42 },
];

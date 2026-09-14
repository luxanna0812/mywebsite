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
  href: `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}library/${slug}/`, order: index + 1,
  cover: `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}covers/${index + 1}.jpg`,
  audio: `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}audio/${index + 1}.m4a`,
})).sort((a, b) => a.order - b.order);

export const detailSections: Record<string, DetailSection[]> = {
  profile: [
    { heading: '关于我', intro: '我是一名战略传播及社会硕士生，拥有广告学训练，以及内容运营、公关传播、市场研究、新闻采编、活动策划与文化项目实践经验。我擅长把研究洞察转化为清晰内容、可执行方案与稳定交付。', tags: ['战略传播', '文化研究', '内容策划', '中英双语'] },
    { heading: '我能带来的能力', bullets: ['用 Excel 整理运营、审核与研究资料，用 PPT、Notion 和飞书多维表格支持提案、排期与知识归档。', '使用 AI Agent、Codex 辅助内容生成与代码开发，并独立搭建个人网站。', '在客户、团队与外部合作方之间梳理需求、把控节点，以因人施策的方式推进多任务协作。'], tags: ['数据分析', 'AI 应用', '项目统筹', '沟通协作'] },
    { heading: '基础信息', bullets: ['伦敦政治经济学院战略传播及社会硕士（2025.09–2026.11，预计）。', '四川大学广告学学士，GPA 3.91 / 4.0；2022 学年校级二等奖学金。', 'IELTS 7.5；CET-4 630；CET-6 603；高中英语教师资格证。'] },
  ],
  education: [
    { heading: '伦敦政治经济学院（LSE）', period: '2025.09–2026.11 · 在读', intro: '战略传播及社会硕士，学院为新闻传媒学院。研究关注中国粉丝如何理解并评价日本音乐人藤井风迈向全球音乐工业的转型。', tags: ['粉丝文化', '数字民族志', '半结构化访谈', '主题分析'] },
    { heading: '四川大学', period: '2021.09–2025.06 · 广告学学士', intro: '文学与新闻学院，GPA 3.91 / 4.0；获 2022 学年校级二等奖学金。本科优秀毕业论文《AI 复生：从悼念到消费》结合技术哲学与拉康欲望理论，讨论 AI 如何重塑悼念实践与情感消费。', tags: ['传播理论', 'AI 与社会', '案例分析'] },
    { heading: '纽卡斯尔大学（英国）', period: '2023.09–2024.06', intro: 'Media Culture & Heritage 交换学习，在英文环境中学习媒体、文化与遗产研究，并参与当地社区志愿服务。', tags: ['跨文化适应', '文化遗产', '英文学习与工作'] },
    { heading: '城市轨迹', intro: '重庆 → 成都 → 上海 → 纽卡斯尔 → 伦敦。每一次迁移都让我在不同的组织、社区与文化现场中重新理解“传播”如何发生。' },
  ],
  research: [
    { heading: '良介文化世界电影节', period: '2026.04–2026.09 · 内容设计、展映运营', bullets: ['连续 5 个月每周产出 4 组展映海报、直播海报及公众号 banner，使用 Photoshop、Canva 与 AI 工具完成视觉设计。', '每周剪辑并发布 1 条先导宣传片或对谈精华视频，及时适应嘉宾素材变更。', '统筹每周 2 场线上展映，覆盖 500+ 人次；主导组建 15 人志愿者团队，协调片方、字幕、技术与嘉宾交付。'], tags: ['视觉设计', '视频剪辑', '项目统筹', '展映运营'] },
    { heading: 'Gusto Collective', period: '2025.02–2025.05 · 奢侈品 PR 实习生', bullets: ['为 FHCM 与路易十三撰写、打磨并中英双语转化新闻稿及宣传文案。', '整理 50+ 客户合作案例与 200+ 宣传素材，使用 Excel 输出周报、月报和平台反馈。', '运营小红书、抖音、微博三大平台，累计播放量 10 万+、点赞 1.2 万+、互动 800+；对接 30+ 媒体/KOL，落地 5 篇报道与内容。'], tags: ['PR', '品牌传播', '社媒运营', '数据分析'] },
    { heading: '四川省图书馆', period: '2024.10–2024.12 · 图书管理员', bullets: ['结合馆藏方向、读者需求与预算，协助完成 60 余种文献资源采购。', '完成 440 册新书分类、编目及元数据录入，核对重复记录、字段缺漏与录入错误。', '参与“四川地方志”“巴蜀文化数据库”等特色资源建设。'], tags: ['文献资源', '元数据', '数据库建设'] },
    { heading: '字节跳动 · 番茄小说', period: '2024.07–2024.09 · 内容质量检测中心', bullets: ['累计审核上千本电子出版物，日均处理 100+ 本，判定准确率 96%；归档问题 500+ 项并提出改进建议。', '识别并上报 5 起潜在版权侵权及敏感内容风险，推动知识类电子图书审核口径细化。', '完成 800+ 份分类与标签标注，分类准确率 97%，对接运营与算法团队跟进异常。'], tags: ['内容审核', '质量管控', '平台治理'] },
    { heading: '成都日报锦观新闻', period: '2023.05–2023.08 · 实习记者', bullets: ['参与“Panda Loves TCM”融媒体运营：策划原创 27 条、剪辑短视频 15 条、撰写及翻译文案 40 篇。', '独立完成智慧农业专题采访，走访 5 个点位、采访 3 名专家与 8 户农户，形成 1000 字深度报道。'], tags: ['新闻采访', '融媒体', '短视频', '中英文内容'] },
  ],
  strategy: [
    { heading: 'LSE Skills Accelerator Nano Project', period: '2026.01–2026.03 · AvecPortales Coaching+Consulting', intro: '为加拿大教育与成长初创公司研究 AI 情感陪伴软件与高端康养旅行的市场方向。', bullets: ['筛选 12 家代表性企业，从产品形态、定价模式、目标客群及 AI 能力 4 个维度建立竞品框架。', '拆解完整用户旅程，识别高接触服务难规模化、旅行后缺少持续陪伴、临床型 AI 的适配与伦理限制 3 项痛点。', '结合菲律宾 Kapwa 关系哲学提出业务路径，与 5 人国际团队完成 35 页提案；SaaS 产品构想、用户体验设计及业务模式获客户认可并纳入后续开发。'], tags: ['市场调研', '竞品分析', '痛点诊断', 'AI 产品策略'] },
    { heading: 'Newcastle University Green Hackathon', period: '2024.02 · 纽卡斯尔大学', intro: '围绕学生搬离宿舍期间的衣物、电子产品及食品浪费问题，设计校园回收 Campaign。', bullets: ['梳理 4 类用户问题，设计提前 1 个月启动的搬家时间线、宿舍回收竞赛及实时排名机制。', '4 小时内完成活动主题、海报、二维码入口、资源网站、捐赠点与回收地图的一体化提案。'], tags: ['用户洞察', 'Campaign 策划', '快速交付'] },
    { heading: '雀巢咖啡罐装咖啡整合营销企划', period: '2022.11–2023.01', intro: '从市场、消费者与竞争格局出发，为雀巢罐装咖啡完成整合营销企划。', bullets: ['分析即饮咖啡市场与主要品牌，识别年轻消费群体扩张及便携需求增长等机会。', '围绕 20–35 岁学生与上班族设计社媒、KOL/KOC、世界杯促销、线下活动与会员运营方案。', '配置约 4,108 万元年度预算、效果指标与风险应对，完成 99 页完整企划案。'], tags: ['市场分析', '消费者洞察', '整合营销'] },
  ],
  campaign: [
    { heading: 'Holborn Community Association Doorstep Help', period: '2025.10–2026.09 · 伦敦', bullets: ['通过每周上门与电话回访，持续 11 个月陪伴一位 65 岁独居老人，建立稳定沟通节奏。', '独立策划生日小聚，协调场地、物资与人员，并将交流中识别的情绪与生活需求转化为代购药品生鲜、整理居室和陪伴散步等行动。'], tags: ['社区服务', '长者关怀', '需求识别'] },
    { heading: 'Migrateful Cookery Classes', period: '2025.12–2026.02 · 伦敦', bullets: ['参与 5 场公益烹饪课，完成工位布置、物料清点、签到接待、分组引导与收场，单场服务约 40 名参与者。', '协助英语非母语的难民厨师完成教学传达，针对饮食禁忌与进度差异调整沟通方式。'], tags: ['跨文化沟通', '公益项目', '活动执行'] },
    { heading: '“五彩石”心理辅导志愿', period: '2021.10–2023.06 · 四川大学', intro: '与偏远山区小学生长期通信结对，每两周进行作文交流，指导学业、回应生活困惑；每月接受专家督导，每三个月参与阶段评估。', tags: ['长期志愿', '书信沟通', '心理支持'] },
    { heading: '成都麓湖 A4 美术馆', period: '2023.03–2023.04 · 志愿者', bullets: ['参与“无尽之旋 II——James Jean 简明”展览筹备与现场执行，完成 5 次志愿服务、投入 40 小时。', '协助 4 场艺术家讲座及作品解读工作坊，服务 500+ 人次；参与艺术商店陈列、库存盘点与顾客咨询，日均实际交易 50+ 单。'], tags: ['展览策划', '观众运营', '艺术机构'] },
  ],
  content: [
    { heading: '我创造过的内容', intro: '我的作品横跨文字、平面、视频、网页与研究型内容：从一条社交媒体文案，到一场展映、一篇深度报道或一份客户策略提案。', tags: ['文字', '平面', '视频', '网页', '视觉研究'] },
    { heading: '内容与视觉项目', bullets: ['成都日报：27 条原创内容、15 条短视频、40 篇中英文文案；完成 8 组 AIGC 视觉作品。', '四川大学官方媒体：策划“早安川大”“晚安川大”等系列，平均阅读 700+；2022 转专业系列实现 3,500+ 阅读、增粉 300+；完成 6 套品牌宣传海报。', '四川大学学生广播电视台：参与广告片《积木游戏》与 MV《这世界那么多人》的创作、摄影与现场协调，7 天完成 6 个场景、58 个镜头拍摄；参与招募 200+ 学生并培养 8 名新成员。', '良介文化：连续 5 个月每周产出 4 组视觉物料、1 条视频，并为线上展映提供完整传播支持。'], tags: ['剪映', 'Canva', 'Midjourney', 'Recraft', '摄影'] },
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
    { heading: '声音与影像', bullets: ['偏好 Bossa Nova、微分摇滚与 J-Pop 等多元音乐风格。', '关注欧美、日本影视与当代文化内容，收听人文播客；也持续通过视觉创作、影像与城市生活观察文化。'] },
    { heading: '在路上', bullets: ['游历欧洲多个国家，在不同城市观察地方文化与日常生活。', '喜欢徒步，走过尼泊尔、冰岛等地的特色路线。'] },
    { heading: '生活经验', intro: '在伦敦的社区志愿服务、咖啡店工作和跨文化学习，让我更直接地理解不同人的日常需求，也让我保持对具体生活的敏感。' },
  ],
  'ai-experiments': [
    { heading: 'LSE 粉丝文化研究', period: '2025.09–2026.11', intro: '以中文粉丝社群为田野，通过数字民族志与半结构化访谈，研究粉丝如何理解并评价日本音乐人藤井风迈向全球音乐工业的转型，以及他们如何协商真实性与情感。', tags: ['数字民族志', '半结构化访谈', '主题分析', '文化产业'] },
    { heading: '《AI 复生：从悼念到消费》', period: '四川大学本科优秀毕业论文', intro: '以 AI 数字复生现象为研究对象，结合弗鲁塞尔技术哲学与拉康欲望理论，探讨技术如何重塑当代悼念实践与情感消费。', tags: ['AI 与社会', '传播理论', '文献研究', '案例分析'] },
    { heading: '我的思考方式', bullets: ['从具体案例和人的经验出发，而不是只停留在抽象概念。', '把分散材料整理成可比较的维度、清晰的问题和可执行的建议。', '同时关注传播效果与文化语境，追问一个方案如何被真实的人理解、使用和感受。'] },
  ],
  'personal-notes': [
    { heading: '我现在在哪里', period: '伦敦 · 2026', intro: '目前在伦敦政治经济学院攻读战略传播及社会硕士，同时参与电影节内容设计与展映运营、社区志愿服务、英文门店服务与线上中文教学。' },
    { heading: '正在做的事', bullets: ['完成关于中国粉丝、藤井风与全球音乐工业转型的硕士研究。', '每周统筹线上电影节展映，持续练习视觉设计、视频制作、项目管理与多方协作。', '为 3 名 10–14 岁学员提供一对一中文教学，累计完成 500+ 课时；在 Pret A Manger 英文门店环境中每班服务 100+ 人次。'] },
    { heading: '下一步', intro: '希望在传播、内容运营、公关 PR、市场研究与咨询、用户研究、活动策划与策展、内容审核与运营等方向继续工作，把研究能力、内容能力、数据与 AI 工具应用结合起来。', tags: ['传播', '内容运营', 'PR', '市场研究', '用户研究', '文化项目'] },
    { heading: 'Contact', bullets: ['Email: simoneluxanna@outlook.com', '微信 / 电话：15683058711'] },
  ],
};

export const timelineEntries: TimelineEntry[] = [
  { period: '2026.04–2026.09', title: '良介文化世界电影节', type: 'work', location: '远程 · 内容设计、展映运营', description: '在文化项目现场，把视觉内容、观众与合作方组织到同一条线上。', highlights: ['连续 5 个月每周产出 4 组视觉物料、1 条宣传视频；统筹每周 2 场线上展映，覆盖 500+ 人次。', '主导组建 15 人志愿者团队，协调片方、字幕、技术与嘉宾交付。'], tags: ['视觉设计', '项目统筹'] },
  { period: '2026.04–2026.09', title: 'Pret A Manger', type: 'work', location: '伦敦 · Barista 兼职', description: '在全英文门店环境中完成从接待、点单到出品的完整服务流程。', highlights: ['每班服务 100+ 人次，处理定制需求、收银、饮品制作、补货与清洁。', '在高峰期协调点单、制作和交付，兼顾服务效率与订单准确性。'], tags: ['英文客户服务', '门店运营'] },
  { period: '2026.02–2026.09', title: 'Preply', type: 'work', location: '线上 · 中文老师', description: '根据学员基础、目标与兴趣安排一对一中文课程，结合英语辅助解释和对话练习。', highlights: ['面向 3 名 10–14 岁学员累计完成 500+ 课时。', '根据发音、词汇和语序问题持续调整课程难度与复习重点。'], tags: ['双语教学', '跨文化沟通'] },
  { period: '2026.01–2026.03', title: 'LSE Skills Accelerator Nano Project', type: 'project', location: '伦敦 · AI 项目咨询与策划', description: '为加拿大初创公司研究 AI 情感陪伴软件与高端康养旅行的市场方向。', highlights: ['完成 12 家竞品、4 个维度的对标分析及 3 项用户旅程痛点诊断。', '与 5 人国际团队完成 35 页终期提案，方案获客户认可并纳入后续产品开发。'], tags: ['市场调研', 'AI 产品策略'] },
  { period: '2025.11–2026.06', title: 'LSE ResLife Events Ambassador', type: 'project', location: '伦敦 · 校园活动策划', description: '在国际学生占比 75% 的多元文化宿舍环境中，协助策划并执行身心健康、竞技互动与节庆社交活动。', highlights: ['累计支持 35 场活动，覆盖 300+ 人次，实现 70% 到场率，满意度 90%。', '通过 WhatsApp、社媒、官网与定向邀请推广活动，并根据反馈沉淀流程、物资清单及应急资料。'], tags: ['活动策划', '社群运营'] },
  { period: '2025.09–2026.11', title: '伦敦政治经济学院（LSE）', type: 'education', location: '伦敦 · 战略传播及社会硕士', description: '在文化研究与传播实践之间建立自己的问题意识，研究粉丝文化、全球音乐工业与情感协商。', highlights: ['以数字民族志、半结构化访谈和主题分析开展硕士研究。'], tags: ['粉丝文化', '数字民族志'] },
  { period: '2025.02–2025.05', title: 'Gusto Collective', type: 'work', location: '上海 · 奢侈品 PR 实习生', description: '在品牌、公关和社交媒体的交叉点工作，学习如何让信息准确抵达不同受众。', highlights: ['运营 3 个社媒平台，累计播放量 10 万+、点赞 1.2 万+、互动 800+。', '对接 30+ 媒体/KOL，落地 5 篇报道与内容。'], tags: ['PR', '品牌传播'] },
  { period: '2024.10–2024.12', title: '四川省图书馆', type: 'work', location: '成都 · 图书管理员', description: '在文献资源管理中理解信息如何被分类、保存，并重新被人找到。', highlights: ['协助引入 10 余种新资源，完成上百册新书分类、编目和元数据录入。'], tags: ['文献资源', '数据库建设'] },
  { period: '2024.07–2024.09', title: '字节跳动 · 番茄小说', type: 'work', location: '重庆 · 内容质量检测中心', description: '在大规模内容平台中训练判断力、规则意识与稳定的质量控制能力。', highlights: ['完成 500+ 本出版物核验及 500+ 项问题归档。', '完成 800+ 份分类标注，分类准确率 97%，前置识别 5 起潜在风险。'], tags: ['内容审核', '平台治理'] },
  { period: '2023.09–2024.06', title: '纽卡斯尔大学（英国）', type: 'education', location: '纽卡斯尔 · Media Culture & Heritage 交换学习', description: '第一次长期进入英文学习与生活环境，也在当地社区活动中实践跨文化沟通。', highlights: ['学习媒体、文化与遗产研究，并参与 The Globe Café 志愿服务。'], tags: ['跨文化适应', '文化遗产'] },
  { period: '2023.05–2023.08', title: '成都日报锦观新闻', type: 'work', location: '成都 · 实习记者', description: '从内容策划、采访到发布，完成一次完整的融媒体生产。', highlights: ['策划原创 27 条、剪辑短视频 15 条、撰写及翻译文案 40 篇，带动粉丝增长 1k+。', '走访 5 个点位、采访 3 名专家与 8 户农户，完成约 1,000 字专题报道。'], tags: ['新闻采访', '融媒体'] },
  { period: '2021.10–2023.06', title: '四川大学学生广播电视台', type: 'project', location: '成都 · 内容创作与摄影', description: '参与广告片、音乐 MV 的前期创作、拍摄制作、招募与新成员培养。', highlights: ['7 天完成 6 个场景、58 个镜头拍摄；触达 200+ 名学生并招募 10 名新成员。', '通过 5 次基础培训和 10 次项目实操，使 8 名成员 4 周内能够独立承担基础拍摄。'], tags: ['脚本策划', '摄影', '团队培养'] },
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

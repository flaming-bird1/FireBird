import type {ResumeBaseInfo, ResumeEducation, ResumeProject, ResumeHonor} from '@/types/resume.ts'

// 获取基础信息
export const getResumeBaseInfo = (): ResumeBaseInfo => {
    return {
        name: '烈焰飞鸟',
        phone: '12345678901',
        email: '12345678901@qq.com',
        education: '本科',
        school: '成都信息工程大学',
        major: '空间信息与数字技术',
        blog: 'https://blog.csdn.net/lieyanfeiniao_'
    }
}

// 获取教育背景（包含主修课程）
export const getResumeEducation = (): ResumeEducation => {
    return {
        school: '成都信息工程大学',
        college: '软件工程学院',
        major: '空间信息与数字技术',
        degree: '本科',
        period: '2023年9月 - 2027年6月',
        status: '应届毕业生',
        gpa: '3.62（五分制）',
        courses: ['数据结构', '计算机网络', '计算机组成原理', '操作系统', '数据库', '计算机图形学', '机器学习', '地理信息系统']
    }
}

// 获取技能标签（分组格式）
export const getResumeSkills = () => {
    return {
        frontend: ['Vue 3', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Element Plus', 'uni-app', 'ECharts', 'Three.js', 'Leaflet', 'Mermaid'],
        backend: ['Java 21', 'Spring Boot 4.0', 'Python', 'Flask', 'MySQL', 'MyBatis', 'JWT', 'RESTful API'],
        ai_ml: ['XGBoost', 'LSTM', 'CNN-LSTM', 'PyTorch', 'scikit-learn', 'RAG', 'Multi-Agent System', 'PCA', 'K-means'],
        devops_tools: ['Git', 'Linux', 'Vite', 'Maven', 'Docker', 'Nginx', 'VSCode'],
        data_visualization: ['ECharts', 'Leaflet', '天地图GIS', 'Three.js', 'GeoPandas', 'PySAL']
    }
}

// 获取荣誉奖项
export const getResumeHonors = (): ResumeHonor[] => {
    return [
        // 大一
        {id: '1', name: '2023-2024届共青团成都信息工程大学委员会青年发展服务中心-优秀干事', level: '证书', grade: '大一'},
        {id: '2', name: '计算机二级证书', level: '证书', grade: '大一'},
        {id: '3', name: '英语四级证书', level: '证书', grade: '大一'},

        // 大二
        {id: '4', name: '第七届传智杯程序设计赛道-国赛三等奖', level: '国赛', grade: '大二'},
        {id: '5', name: '第七届码蹄杯程序设计大赛-省赛铜奖', level: '省赛', grade: '大二'},
        {id: '6', name: '第二十一届百度之星程序设计大赛-铜奖', level: '省赛', grade: '大二'},
        {id: '7', name: '第二届教育信息技术应用创新大赛-区域赛二等奖', level: '省赛', grade: '大二'},
        {id: '8', name: '"2025全国大学生高新技术竞赛一算法智星挑战赛-优秀奖', level: '省赛', grade: '大二'},
        {id: '9', name: '第十五届全国大学生计算机应用能力与数字素养大赛-西南赛区一等奖', level: '省赛', grade: '大二'},
        {id: '10', name: '2023~2024学年二等奖学金', level: '校赛', grade: '大二'},
        {id: '11', name: '第十六届蓝桥杯web组-校赛三等奖', level: '校赛', grade: '大二'},
        {id: '12', name: '大学生创新创业比赛校级立项', level: '校赛', grade: '大二'},
        {id: '13', name: '2025年度全国青少年航天创新大赛四川赛区-志愿者证书', level: '证书', grade: '大二'},

        // 大三
        {id: '14', name: '第十九届中国成都软件设计与应用大赛总决赛-优胜奖', level: '国赛', grade: '大三'},
        {id: '15', name: '第十九届全国大学生软件创新大赛-国赛三等奖', level: '国赛', grade: '大三'},
        {id: '16', name: '第八届传智杯全国大学生IT技能大赛-AI WEB网页开发挑战赛-国赛三等奖', level: '国赛', grade: '大三'},
        {id: '17', name: '第19届中国大学生计算机设计大赛-省赛三等奖', level: '省赛', grade: '大三'},
        {id: '18', name: '第八届码蹄杯程序设计大赛-校赛铜奖', level: '校赛', grade: '大三'},
        {id: '19', name: '第八届传智杯全国大学生IT技能大赛-AI大模型创新应用挑战赛-初赛一等奖', level: '校赛', grade: '大三'},
        {id: '20', name: '第十六届全国大学生电子商务"创新、创意及创业"挑战赛-校赛一等奖', level: '校赛', grade: '大三'},
        {id: '21', name: '软件著作权-空间经济分析平台', level: '证书', grade: '大三'},
        {id: '22', name: '第十九届全国大学生节能减排社会实践与科技竞赛-校赛三等奖', level: '校赛', grade: '大三'},
        {id: '23', name: '2026年海峡两岸暨港澳地区大学生计算机创新作品赛四川省赛-省赛三等奖', level: '省赛', grade: '大三'},
        {id: '24', name: '2026年第二届全国大学生气象科技创新大赛-校赛二等奖', level: '校赛', grade: '大三'},
        {id: '25', name: '第十五届“中国软件杯”大学生软件设计大赛-校赛二等奖', level: '校赛', grade: '大三'},
        {id: '26', name: '2026中国高校计算机大赛-网络技术挑战赛A-西南赛区二等奖-热网智防', level: '省赛', grade: '大三'},
        {id: '27', name: '2026中国高校计算机大赛-网络技术挑战赛A-西南赛区三等奖-银龄智护', level: '省赛', grade: '大三'},
        {id: '28', name: '2026中国高校计算机大赛-网络技术挑战赛A-ICV-西南赛区三等奖-视界巡警', level: '省赛', grade: '大三'},
        {id: '29', name: 'HarmonyOs应用开发者高级认证', level: '证书', grade: '大三'},
        {id: '30', name: '2026中国高校计算机大赛-AIGC创新赛-西南赛区二等奖-智课回声', level: '省赛', grade: '大三'},
    ]
}

// 获取项目经验
export const getResumeProjects = (): ResumeProject[] => {
    return [
        {
            id: '1',
            name: 'FireBird 个人博客系统',
            description: '基于 Vue3 Composition API 开发的现代化静态博客平台，采用国风设计理念，集成文章管理、生活动态、在线简历三大模块，支持 Markdown/PDF 多格式渲染与响应式布局。',
            detail: '采用组件化架构，封装 MarkdownViewer/PDFViewer 等可复用组件和 useScrollAnimation 组合式函数，组件复用率 80%；数据层与视图层分离，实现关注点分离。配置路由懒加载 + Vite esbuild 压缩，首屏加载减少 40%，打包速度提升 50%，包体积减小 35%；集成 sharp 图片压缩，资源体积减小 30%。设计完整 TypeScript 类型系统（Article/LifeMoment 等接口），覆盖率 100%，零运行时错误。基于 marked + highlight.js 实现 Markdown 渲染与代码高亮，集成 DOMPurify 防 XSS；使用 pdfjs-dist 实现 PDF 预览；开发图片查看器支持键盘导航、背景模糊。实现动态目录激活（IntersectionObserver）、平滑滚动定位；独创国风视觉系统（山水渐变、打字机动画、滚动渐显），完全响应式适配多终端。',
            tags: ['Vue 3.5', 'TypeScript 5.7', 'Vite 6.0', 'Element Plus', 'Pinia', 'marked', 'pdfjs-dist'],
            projectUrl: 'http://1.95.153.56:5189/',
            giteeUrl: ''
        },
        {
            id: '2',
            name: '智课回声——AI驱动的自适应学习与教学反馈平台',
            description: '面向数据结构课程的全流程智慧教学平台，以「用户画像」为数据中枢、「多智能体协同」为执行引擎，构建「学→练→评→改」个性化学习闭环。集成 RAG 教材问答、AI 诊断式批改、知识点级能力画像、学习预警干预、语音交互助教等核心能力，覆盖教师教学与学生学习的全链路场景。',
            detail: '后端采用 Flask 蓝图架构，设计 10 大业务模块（用户权限/课程教材/作业题库/提交批改/画像中心/推荐路径/预警干预/智能体交互/教师学情/资源中心），MySQL 数据库 30+ 张表，涵盖知识点树形结构、能力画像动态更新、画像变更历史（数据飞轮）、多智能体任务日志等核心表设计。AI 层集成 vivo 蓝心大模型（Doubao-Seed-2.0-mini）+ m3e-base 向量化模型 + Chroma 向量数据库，实现完整 RAG 流水线：查询改写 → 文本向量化 → 语义检索 Top-K → 大模型生成 → 结果缓存，教材 PDF 经 LangChain 递归切分后向量化入库，划词问答命中率与响应速度通过 AI 回答缓存表二次优化。批改智能体实现选择题直接比对 + 简答题 LLM 语义评分（正确性60%/完整性20%/表达20%三维评估），自动分类错因（计算/概念/审题/格式）并映射知识点影响值，异步线程触发批改后自动更新 ability_profiles 能力画像 + ability_profile_history 变更历史 + alert_records 学习预警（连续低分/活跃度下降/掌握度骤降等5条规则引擎）。前端基于 uni-app 跨端开发（H5/App/小程序三端适配），26 个页面覆盖教师端（课程管理/学情分析/教学诊断/问卷系统/课程评价）与学生端（教材学习/AI助学/作业答题/学习画像/资源中心）。AI 智能助教模块实现完整语音交互闭环：录音 → ffmpeg 转 PCM 16k → vivo ASR WebSocket 识别 → 自动发送 → LLM 回答 → vivo TTS WebSocket 合成 → uni.downloadFile 下载播放，支持 20+ 音色切换（短音频/长音频/超拟人三类引擎），通过 _speechRequestId 机制解决打断后重复播放问题。资源中心实现 12 种算法（7种排序+2种查找+3种数据结构）的本地步骤生成器，逐帧输出比较/交换/指针状态供前端动画渲染，代码讲解支持文件上传与文本输入双模式 + 语言自动检测 + LLM 分析 + 本地模板兜底 + SHA256 哈希缓存。学习画像页面聚合知识点掌握度、六大能力维度雷达图、掌握度分布、周变化趋势、章节统计、预警提醒等多维数据可视化。问卷系统支持 AI 优化措辞 + 评分/单选/多选/文本四种题型 + AI 分析报告生成。采用 JWT 认证 + 角色权限控制（student/teacher/admin），QQ 邮箱 SMTP 验证码注册，gunicorn + systemd 部署于 Linux 服务器。',
            tags: ['uni-app', 'Vue', 'Flask', 'MySQL', 'Chroma', 'vivo蓝心大模型', 'RAG', 'WebSocket', 'LangChain', 'ffmpeg'],
            projectUrl: 'http://8.156.67.132:6010/',
            giteeUrl: ''
        },
        {
            "id": "2",
            "name": "长江流域（四川省段）水质分类与智能评价系统",
            "description": "面向地表水环境监测的智能评价平台，集成 XGBoost 多变量水质预测、多元统计分析、AI 智能体解读三大核心算法体系，实现从数据采集到智能决策的全链路闭环。",
            "detail": "系统采用**前后端分离六层架构**：前端展示层（Vue 3 + TypeScript）、业务服务层（Flask 3.0 Blueprint 9 模块）、算法引擎层（XGBoost + scikit-learn）、AI 智能体层（Chat/Prediction/Statistics 三 Agent）、数据层（MySQL + PyMySQL）、外部服务层（vivo AI 大模型 + 天地图）。\n\n**XGBoost 统一多变量水质预测模型**：将所有断面历史数据合并训练单一模型，构造 27 维特征向量（3 维时间特征 DOY/Month/Quarter + 16 维滞后特征 lag1/lag2 + 8 维滑动平均特征），同步预测水温/pH/溶解氧/高锰酸盐指数/氨氮/总磷/总氮/叶绿素 a 共 8 项指标，采用逐日递推策略实现 1-30 天滚动预测，引入脏标记机制实现数据导入后自动增量重训练，模型序列化至 Pickle 文件支持进程重启恢复。\n\n**4 种多元统计分析**：PCA 主成分分析（协方差矩阵特征值分解 + 累计方差≥85% 自动定维）、K-means 聚类（肘部法则自动寻优 K + PCA 2D 可视化）、Pearson 相关性分析（p<0.05 显著性筛选 + 热力图矩阵）、因子分析（载荷阈值≥0.4 的规则式污染源类型推断：生活源/农业源/自然因素）。\n\n**AI 智能体三层架构**：BaseAgent 基类封装 vivo AI 大模型 HTTP API 通信，派生出 ChatAgent（多轮领域对话）、PredictionAgent（预测四维解读：趋势分析→重点指标→原因推断→建议措施）、StatisticsAgent（PCA/相关性/聚类/因子四种差异化 Prompt 模板）三个专业化智能体。\n\n**水质自动评价**：基于 GB3838-2002 标准实现 21 项指标单因子评价法（一票否决制）与湖库 TLI 综合营养状态指数计算（chla/TP/TN/SD/CODₘₙ 五参数加权）。\n\n前端深度集成 Leaflet 天地图引擎实现监测点位 GeoJSON 图层渲染（六色编码），ECharts 6 实现多图表联动可视化，集成 Three.js 3D 数字人与 WebSocket TTS 语音合成。",
            "tags": ["XGBoost", "PCA", "K-means", "Factor Analysis", "AI Agent", "Flask", "Vue 3", "Leaflet", "ECharts"],
            "projectUrl": "",
            "giteeUrl": ""
        },
        {
            "id": "1",
            "name": "数据结构智能助教系统",
            "description": "面向数据结构课程的 AI 智能辅导平台，采用多智能体协同架构（Multi-Agent System），集成 6 个专业智能体与 RAG 检索增强生成技术，实现从学生画像构建、个性化学习路径规划、智能答疑辅导、习题生成批改到算法可视化的全链路个性化学习闭环。",
            "detail": "系统采用**前后端分离六层架构**：用户访问层、前端展示层（Vue 3 + TypeScript + Element Plus）、API 网关层（Flask 3.0 Blueprint 6 模块）、多智能体协同层（Orchestrator + 6 Agent）、服务层（LLM Client + ChromaDB + TTS）、数据持久层（MySQL + ChromaDB）。\n\n**多智能体协同架构（MAS）**：设计 6 个专业化智能体 + Orchestrator 协调器，统一通过 BaseAgent 基类封装 vivo 蓝心大模型 API。ProfileAgent 对话式问卷构建 6 维度画像，RetrievalAgent 基于 ChromaDB + m3e-base 实现 RAG 检索增强，TutorAgent 结合画像与检索结果个性化答疑并自动生成 Mermaid 图解，ExerciseAgent 自动出题（选择题/判断题/填空题）并批改，AlgorithmVizAgent 协同生成算法动画（Mermaid 流程图 + 步骤动画 + 可运行代码 + 复杂度），CodeAnalysisAgent 支持文本/文件上传 5 维度代码讲解。引入算法精确降级方案，LLM 失败时自动切换预置模拟步骤。\n\n**Orchestrator 三层协同流程**：画像更新 → 知识检索 → 专业执行，每次对话自动更新画像。\n\n**RAG 知识库**：PyMuPDF 解析教材 → OCR 识别 → LangChain 切块 → m3e-base 向量化 → ChromaDB 存储。\n\n**3D 交互创新**：Three.js + GSAP 构建 3D 岛屿式学习地图（GeoJSON 地块 + 贝塞尔曲线连线 + 四态颜色反馈），Unity WebGL 构建 3D 数字人助教「小慧」（唇形同步 + 肢体动画 + 语音交互）。\n\n集成 ECharts 6 统计可视化、Mermaid 11 流程图渲染（内置中文括号/HTML 标签清洗器）、vivo TTS WebSocket 语音合成（31 种音色）。",
            "tags": ["Multi-Agent System", "RAG", "Flask", "Vue 3", "ChromaDB", "蓝心大模型", "Three.js", "Mermaid", "TTS"],
            "projectUrl": "",
            "giteeUrl": ""
        },
        {
            id: '3',
            name: '智汇银龄 - 居家养老智能守护系统',
            description: '基于 Vue3 Composition API + uni-app 开发的跨平台智慧养老应用，集成实时健康监测、环境监控、AI健康分析、智能预警四大核心模块，支持多设备管理、数据可视化与个性化健康建议。',
            detail: '采用 Pinia 状态管理实现全局数据流控制，封装 environmentData/alertMessage/facilities 等多个 Store 模块，实现数据持久化存储；组件化架构设计，开发 bodyMainCom/environmentMainCom/warningMessage 等 13+ 可复用组件，组件复用率 75%；基于 uv-ui/uni-ui 组件库二次封装，统一橙色系视觉规范（#FF8C42），完全响应式适配移动端。集成 AI 健康助手功能，通过 askai API 实现智能问答，结合实时传感器数据（心率/呼吸/温度/湿度等9类指标）生成个性化健康报告，支持上下文对话与历史消息滚动；开发智能预警中心，实现分级预警（紧急/警告/提醒）、AI分析建议、筛选排序与自动刷新机制。实现多设备管理功能，支持设备绑定/切换/移除操作，实时同步传感器数据并展示动态图表（20秒/日/周维度）；环境监控页面集成视频播放、温湿度实时显示与弹窗详情；健康报告页面提供 AI 分析报告生成、折叠展开、分享导出等功能。配置路由懒加载、下拉刷新优化用户体验，首屏加载时间减少 35%，打包体积优化 28%；TypeScript 类型定义覆盖主要接口，确保代码健壮性。',
            tags: ['Vue 3', 'uni-app', 'Pinia', 'uv-ui', 'uni-ui', 'SCSS', 'AI集成'],
            projectUrl: '',
            giteeUrl: 'https://gitee.com/flaming-bird/pension-system.git'
        },
        {
            id: '4',
            name: '知课 - 知识课程管理系统-后端',
            description: '基于 Spring Boot 4.0 + Java 21 开发的现代化课程管理与评价平台，集成课程管理、问卷调查、AI 智能问答、用户权限管理等核心模块，支持多维度课程检索与数据分析。',
            detail: '采用分层架构设计（Controller-Service-Mapper），实现业务逻辑与数据访问分离；基于 MyBatis 4.0 实现动态 SQL 映射，封装统一响应结果类 Result 提升接口规范性。集成讯飞星火 AI API 实现智能问答功能，通过 RestTemplate 构建 HTTP 请求并配置温度参数控制生成质量。实现 JWT Token 认证机制（HS256 算法，12小时有效期），结合拦截器实现用户身份验证与权限控制。设计多角色用户体系（学生/教师/管理员），支持邮箱验证码注册、密码加密存储与批量用户管理。开发课程全生命周期管理功能，包括 CRUD 操作、教学大纲维护、状态流转控制及分页查询优化。构建问卷调查系统，支持问卷创建、答案暂存、提交校验与统计分析，采用 JSON 格式存储复杂问题结构。实现邮件服务集成（QQ SMTP），提供验证码发送与过期自动清理机制。基于 Location API 记录用户地理位置信息，支持 IP 地址追踪与位置更新。采用 Lombok 简化实体类代码，使用 @Slf4j 实现统一日志管理，配置 Jackson 处理 JSR310 时间类型序列化。数据库层面采用 MySQL，通过驼峰命名自动映射提升开发效率，配置 SQL 日志输出便于调试。前端跨域支持通过 @CrossOrigin 注解实现，文件上传配置最大 10MB 单文件与 100MB 总请求限制。',
            tags: ['Spring Boot 4.0', 'Java 21', 'MyBatis 4.0', 'MySQL', 'JWT', '讯飞星火 AI', 'Lombok', 'Maven'],
            projectUrl: 'http://1.95.153.56:5191/',
            giteeUrl: 'https://gitee.com/flaming-bird/knowledge-course.git'
        },
        {
            id: '5',
            name: '知课 - 课程调研数据平台-前端',
            description: '基于 Vue3 Composition API + TypeScript 构建的智能化课程评价与推荐系统，集成 AI 助手、数据可视化、智能推荐等核心功能，为高校学生提供全方位的课程决策支持服务。',
            detail: '采用组件化架构设计，封装 AIChat（AI 聊天）、CourseDetail（课程详情）、LearningTrendChart（学习趋势图表）等高复用组件，组件复用率达 75%；实现 Pinia 状态管理模块化管理用户、课程、问卷等业务状态，数据层与视图层完全分离。配置路由懒加载 + Vite esbuild 压缩，首屏加载时间减少 45%，打包速度提升 60%，包体积减小 40%；集成 sharp 图片压缩优化，资源体积减小 35%。设计完整 TypeScript 类型系统（Course/CourseReview/UserInfo 等接口），类型覆盖率 100%，零运行时类型错误。基于 ECharts 实现多维度数据可视化（雷达图、柱状图、折线图），展示课程评分、难度分布、学习趋势等核心指标；开发实时时钟组件（模拟时钟+数字时钟），集成动态粒子装饰与轨道动画效果。实现基于角色的权限控制系统（学生/教师/管理员三级权限），配合 Vue Router 守卫实现细粒度路由控制；独创国风视觉系统（山水渐变 #3D7D6F、呼吸灯光晕、毛玻璃效果 backdrop-filter），完全响应式适配多终端设备。集成 Axios 请求拦截器统一处理 Token 认证与错误响应，支持 JWT 身份验证；开发智能问答系统对接后端 AI 接口，实现课程推荐、学习路径规划、教学分析等功能；实现课程收藏、点赞、筛选等交互功能，数据持久化至 localStorage。',
            tags: ['Vue 3.5', 'TypeScript 5.7', 'Vite 6.0', 'Element Plus', 'Pinia', 'ECharts', 'Axios'],
            projectUrl: 'http://1.95.153.56:5191/',
            giteeUrl: 'https://gitee.com/flaming-bird/knowledge-course.git'
        },
        {
            id: "6",
            name: "省级GDP时空分析与预测系统",
            description: "基于多源数据融合的中国省级GDP时空分析平台，集成空间自相关分析、冷热点识别与深度学习预测三大核心模块，支持LSTM/CNN-LSTM双模型对比预测。",
            detail: "采用模块化架构设计，实现数据预处理、空间统计分析与深度学习预测的完整流水线。数据处理层整合5类多源经济数据（GDP、人口、财政支出、消费品零售等），通过标准化清洗与特征工程构建17维时间序列特征集，包含滞后变量、移动平均、增长率及结构占比等关键指标。空间分析模块基于GeoPandas和PySAL库，实现全局/局部Moran's I空间自相关分析与Getis-Ord Gi*冷热点检测，通过Queen邻接权重矩阵与孤立点修复算法确保空间关系准确性，识别出华东地区6个热点省份与西部2个冷点区域。预测引擎采用PyTorch框架构建LSTM与CNN-LSTM混合模型：LSTM模型（2层64隐藏单元）达到R²=0.997、MAPE=9.62%的高精度；CNN-LSTM模型创新性地结合1D-CNN局部特征提取、双向LSTM时序建模与注意力机制，使用SmoothL1Loss损失函数与梯度裁剪技术增强鲁棒性，AdamW优化器配合动态学习率调整策略有效防止过拟合。后端基于Flask框架提供RESTful API服务，支持双模型并行推理与递归多步预测（最长5年），前端预留WebGIS可视化接口。系统实现从原始CSV数据到SQL数据库入库的完整ETL流程，生成GeoJSON空间数据与多维度分析报告，为区域经济政策制定提供科学决策支持。",
            tags: ["Python 3.x", "PyTorch", "Flask", "GeoPandas", "PySAL", "LSTM", "CNN-LSTM", "scikit-learn", "NumPy", "Pandas"],
            projectUrl: "http://1.95.153.56:5190/",
            giteeUrl: "https://gitee.com/flaming-bird/gdp-analysis-and-forecast-ep3-frontend.git"
        },
        {
            id: "7",
            name: "供热管网爆管智能定位与应急关阀优化系统",
            description: "基于 Vue 3 Composition API + TypeScript 开发的智慧供热管网可视化监测平台，集成天地图 GIS 引擎、ECharts 数据可视化、设备信息管理三大模块，实现爆管定位结果展示、关阀方案可视化、节能减排效益分析等功能。",
            detail: "采用组件化架构设计，封装 AppHeader/AIChat 等可复用组件和 useUserStore 组合式函数，实现状态管理与视图层分离；深度集成 Leaflet 天地图引擎，构建供热管网拓扑可视化系统，支持点/线/面图层叠加渲染（管网节点、管道、换热站），实现爆管点精准标注（❗图标）、受影响区域动态闪烁动画（setInterval + setStyle）、压力波传播圆环扩散效果（CSS animation）。开发 ECharts 6.0 数据可视化模块，实现月度节能趋势对比（双折线图+面积渐变）、关阀优化效果分析（柱状图+数值标签）、碳减排等效展示（多系列柱状图）、节能效益构成饼图等 8+ 图表类型，支持点击钻取详情弹窗。集成 XLSX 库实现设备信息导入导出功能，支持传感器/阀门/换热站/管线四类数据的 Excel 解析、表格渲染与文件下载，提供网格/列表双视图切换。基于 Element Plus 2.13 构建响应式 UI 组件库，开发统计卡片、标签导航、操作下拉菜单等 20+ 业务组件，完全适配 380px-1920px 多分辨率（7 个断点媒体查询）。实现复杂交互逻辑：图层联动高亮（pipeLayer/pointLayer/surLayer）、半径圆绘制（L.circle + 坐标缓存索引）、动态目录激活、平滑滚动定位；独创绿色系视觉系统（#10b981 主色调、毛玻璃卡片 backdrop-filter: blur(12px)、粒子背景 radial-gradient 动画、渐变按钮 hover 动效），提升用户体验。配置 Vite 6.0 路由懒加载 + esbuild 压缩，首屏加载减少 35%，打包速度提升 45%；设计完整 TypeScript 类型系统（Sensor/Valve/Station/Pipe/LoginResponse 等接口），覆盖率 95%+，零运行时错误。对接 Django/SpringBoot 双后端 API，实现登录认证（token 管理）、爆管计算、关阀方案、定位结果等数据交互，提供完善的模拟数据降级策略确保演示可用性。",
            tags: ["Vue 3.5", "TypeScript 5.7", "Vite 6.0", "Element Plus 2.13", "Pinia 2.3", "Leaflet 1.9", "ECharts 6.0", "Axios", "XLSX"],
            projectUrl: "http://8.156.67.132:6001/",
            giteeUrl: ""
        }

    ]
}
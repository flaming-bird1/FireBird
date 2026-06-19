<div align="center" style="padding: 20px 0 10px;">

# 烈焰飞鸟 · 个人简历

<div style="font-size: 15px; color: #555; margin-bottom: 15px;">
本科 · 2027届 · 全栈开发 · AI应用探索者
</div>
<div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 20px; font-size: 14px; color: #666;">
  <span>11111111111</span>
  <span style="color: #ccc;">|</span>
  <span>1111111111@qq.com</span>
  <span style="color: #ccc;">|</span>
  <span>成都信息工程大学 · 空间信息与数字技术</span>
</div>


<div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 10px;">
  <a href="https://flaming-bird1.github.io/FireBird/#/" style="text-decoration: none; background: #4a6fa5; color: white; padding: 5px 16px; border-radius: 4px; font-size: 13px;">个人网页</a>
  <a href="https://blog.csdn.net/lieyanfeiniao_" style="text-decoration: none; background: #7E6B8F; color: white; padding: 5px 16px; border-radius: 4px; font-size: 13px;">CSDN 博客</a>
  <a href="https://github.com/flaming-bird1" style="text-decoration: none; background: #24292e; color: white; padding: 5px 16px; border-radius: 4px; font-size: 13px;">GitHub</a>
  <a href="https://gitee.com/flaming-bird" style="text-decoration: none; background: #c71d23; color: white; padding: 5px 16px; border-radius: 4px; font-size: 13px;">Gitee</a>
</div>

</div>

---

## 求职意向

> 意向岗位：**全栈开发工程师 / AI应用开发 / Java后端开发 / 前端开发**

**核心能力匹配：**

- 具备完整的前后端全栈开发能力（Vue 3 + Spring Boot / Flask），独立完成多个从0到1的项目落地
- 熟悉AI/机器学习全流程应用：XGBoost水质多变量预测、PyTorch深度学习时序建模（LSTM/CNN-LSTM）、RAG检索增强生成、Multi-Agent多智能体系统
- 掌握空间数据分析与可视化：GeoPandas空间自相关分析、Leaflet天地图GIS集成、ECharts多图表联动
- 具备复杂系统架构设计能力：前后端分离六层架构、多智能体协同、多模型并行推理

---

## 教育背景

**成都信息工程大学** | 软件工程学院 | 空间信息与数字技术 | 本科 | 2023.09 - 2027.06

- **状态：** 应届毕业生 | **综合绩点：** 3.62/5.0
- **主修课程：** 数据结构、计算机网络、计算机组成原理、操作系统、数据库、计算机图形学、机器学习、地理信息系统

---

## 技术栈

| 分类 | 技术 |
|:---:|:---|
| **前端** | Vue 3, TypeScript, JavaScript, HTML5, CSS3, ECharts, Leaflet, Three.js |
| **后端** | Java 21, Spring Boot, Python, Flask, MySQL, MyBatis, RESTful API, JWT |
| **AI/ML** | XGBoost, LSTM, CNN-LSTM, PyTorch, scikit-learn, PCA, K-means, RAG |
| **DevOps** | Git, Linux, Docker, Nginx, Vite, Maven |
| **数据分析** | GeoPandas, PySAL, Pandas, NumPy |

---

## 荣誉奖项

| 级别 | 奖项                                                  | 时间 |
| :--: | :---------------------------------------------------- | :--: |
| 国赛 | 第十九届中国成都软件设计与应用大赛总决赛 优胜奖       | 大三 |
| 国赛 | 第十九届全国大学生软件创新大赛 三等奖                 | 大三 |
| 国赛 | 第八届传智杯 AI WEB网页开发挑战赛 二等奖              | 大三 |
| 国赛 | 第七届传智杯程序设计赛道 三等奖                       | 大二 |
| 省赛 | 第19届中国大学生计算机设计大赛-省赛三等奖             | 大二 |
| 省赛 | 2026年海峡两岸暨港澳地区大学生计算机创新作品赛 三等奖 | 大三 |
| 省赛 | 第七届码蹄杯程序设计大赛 铜奖                         | 大二 |
| 省赛 | 第二届教育信息技术应用创新大赛-区域赛二等奖           | 大三 |
| 省赛 | 第二十一届百度之星程序设计大赛 铜奖                   | 大二 |
| 证书 | 软件著作权 - 空间经济分析平台                         | 大三 |
| 证书 | 计算机二级 / 英语四级                                 | 大一 |

## 项目经验

### 1. 长江流域（四川省段）水质分类与智能评价系统

**技术栈：** XGBoost, PCA, K-means, AI Agent, Flask, Vue 3, Leaflet, ECharts

面向地表水环境监测的智能评价平台，集成XGBoost多变量水质预测、多元统计分析、AI智能体解读三大核心算法体系，实现从数据采集到智能决策的全链路闭环。

**核心技术：**
- **前后端分离六层架构：** 前端展示层（Vue 3 + TypeScript）、业务服务层（Flask 3.0 Blueprint 9模块）、算法引擎层（XGBoost + scikit-learn）、AI智能体层（Chat/Prediction/Statistics三Agent）、数据层（MySQL + PyMySQL）、外部服务层（vivo AI大模型 + 天地图）
- **XGBoost统一多变量水质预测模型：** 构造27维特征向量（DOY/Month/Quarter三维时间特征 + 16维滞后特征 + 8维滑动平均特征），同步预测水温、pH、溶解氧、氨氮等8项水质指标，逐日递推实现1-30天滚动预测，脏标记机制支持增量重训练
- **多元统计分析：** PCA主成分分析（累计方差>=85%自动定维）、K-means聚类（肘部法则自动寻优）、Pearson相关性分析（p<0.05显著性筛选）、因子分析（载荷阈值>=0.4推断污染源类型）
- **AI智能体三层架构：** BaseAgent基类封装LLM API，派生ChatAgent（多轮对话）、PredictionAgent（趋势分析+原因推断+建议措施）、StatisticsAgent（差异化Prompt模板）
- **水质自动评价：** GB3838-2002标准21项指标单因子评价法 + 湖库TLI综合营养状态指数（chla/TP/TN/SD/CODmn五参数加权）

---

### 2. 数据结构智能助教系统

**技术栈：** Multi-Agent System, RAG, Flask, Vue 3, ChromaDB, LLM, Three.js, Mermaid

面向数据结构课程的AI智能辅导平台，采用多智能体协同架构（MAS），集成6个专业智能体与RAG检索增强生成技术，实现从学生画像构建、个性化学习路径规划、智能答疑辅导、习题生成批改到算法可视化的全链路闭环。

**核心技术：**
- **前后端分离六层架构：** 用户访问层、前端展示层（Vue 3 + TypeScript + Element Plus）、API网关层（Flask 3.0 Blueprint 6模块）、多智能体协同层（Orchestrator + 6 Agent）、服务层（LLM Client + ChromaDB + TTS）、数据持久层（MySQL + ChromaDB）
- **多智能体协同架构（MAS）：** 6个专业化智能体 + Orchestrator协调器，统一通过BaseAgent基类封装vivo蓝心大模型API。ProfileAgent对话式构建6维度画像，RetrievalAgent基于ChromaDB + m3e-base实现RAG检索增强，TutorAgent个性化答疑并自动生成Mermaid图解，ExerciseAgent自动出题批改，AlgorithmVizAgent协同生成算法动画，CodeAnalysisAgent多维度代码讲解。Orchestrator三层协同流程：画像更新 → 知识检索 → 专业执行
- **RAG知识库：** PyMuPDF解析教材 → OCR识别 → LangChain文本切块 → m3e-base向量化（768维） → ChromaDB向量存储与语义检索
- **3D交互创新：** Three.js + GSAP构建3D岛屿式学习地图，Unity WebGL构建3D数字人助教（唇形同步 + 肢体动画 + TTS语音交互）
- **集成技术：** ECharts 6统计可视化、Mermaid 11流程图渲染（中文括号/HTML标签清洗器）、vivo TTS WebSocket语音合成（31种音色）

---

### 3. 省级GDP时空分析与预测系统

**技术栈：** PyTorch, LSTM, CNN-LSTM, Flask, GeoPandas, PySAL, scikit-learn

基于多源数据融合的中国省级GDP时空分析平台，集成空间自相关分析、冷热点识别与深度学习预测三大核心模块，支持LSTM/CNN-LSTM双模型对比预测。

**核心技术：**
- **数据处理与特征工程：** 整合5类多源经济数据（GDP、人口、财政支出、消费品零售等），构建17维时间序列特征集（滞后变量、移动平均、增长率及结构占比）
- **空间统计分析：** 基于GeoPandas和PySAL实现全局/局部Moran‘s I空间自相关分析 + Getis-Ord Gi*冷热点检测，Queen邻接权重矩阵与孤立点修复算法，识别出华东6个热点省份与西部2个冷点区域
- **深度学习预测引擎（PyTorch）：**
  - **LSTM模型：** 2层64隐藏单元，R²=0.997，MAPE=9.62%
  - **CNN-LSTM混合模型：** 1D-CNN局部特征提取 + 双向LSTM时序建模 + 注意力机制，SmoothL1Loss损失函数 + 梯度裁剪，AdamW优化器 + 动态学习率调整
- **后端服务：** Flask提供RESTful API，支持双模型并行推理与递归多步预测（最长5年），完整ETL流程实现从CSV到MySQL入库，生成GeoJSON空间数据与多维度分析报告

> 项目地址：[http://1.95.153.56:5190/](http://1.95.153.56:5190/) | Gitee：[https://gitee.com/flaming-bird/gdp-analysis-and-forecast-ep3-frontend.git](https://gitee.com/flaming-bird/gdp-analysis-and-forecast-ep3-frontend.git)

---

### 4. 知课 - 知识课程管理与调研平台（全栈）

**技术栈：** Spring Boot 4.0, Java 21, MyBatis, MySQL, JWT, Vue 3, TypeScript, Element Plus, ECharts, Pinia, Axios

面向高校的现代化课程管理与评价全栈平台，集成课程管理、问卷调查、AI智能问答、用户权限管理、数据可视化、智能推荐等核心功能。

**核心技术：**
- **后端（Spring Boot 4.0 + Java 21）：** 分层架构（Controller-Service-Mapper），MyBatis动态SQL映射，统一响应结果类Result；集成讯飞星火AI API实现智能问答（RestTemplate + 温度参数控制）；JWT Token认证（HS256算法，12小时有效期）+ 拦截器权限控制；多角色用户体系（学生/教师/管理员），邮箱验证码注册；课程全生命周期管理（CRUD + 状态流转 + 分页）；问卷调查系统（JSON复杂问题结构 + 答案暂存 + 提交校验）；QQ SMTP邮件服务；Location API地理位置追踪
- **前端（Vue 3 + TypeScript）：** 组件化架构（AIChat、CourseDetail等复用组件，复用率75%）；Pinia状态管理模块化；ECharts多维度可视化（雷达图、柱状图、折线图）；角色权限控制（三级）+ Vue Router守卫；Axios请求拦截器统一Token认证；国风视觉系统（山水渐变 #3D7D6F、毛玻璃效果），完全响应式适配多终端

> 项目地址：[http://1.95.153.56:5191/](http://1.95.153.56:5191/) | Gitee：[https://gitee.com/flaming-bird/knowledge-course.git](https://gitee.com/flaming-bird/knowledge-course.git)

---

## 自我评价

- **技术热情：** 对全栈开发、AI应用、数据可视化有浓厚兴趣，持续跟踪前沿技术动态，坚持撰写技术博客分享项目经验与学习心得
- **项目驱动：** 独立完成多个涵盖前后端开发、AI算法应用、大数据分析的综合项目，具备完整的技术方案设计与工程落地能力
- **团队协作：** 具备良好的沟通表达能力与团队协作精神，多次参与团队竞赛项目并取得国家级奖项
- **学习能力：** 能够快速掌握新技术并应用于实际项目，从大一到大三持续进步，累计荣获10余项竞赛奖项及软件著作权

---

<div align="center" style="padding: 15px 0; color: #999; font-size: 13px;">

感谢您花时间阅读我的简历，期待与您共事！

1111111111@qq.com | [CSDN 博客](https://blog.csdn.net/lieyanfeiniao_)

</div>

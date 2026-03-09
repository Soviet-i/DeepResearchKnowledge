# 团队分工

#### 注意：所有过程中涉及的外部来源图片均复制一份存放于prototypes/assets对应文件夹中



### 刘悦文：前端架构

##### 负责内容：

frontend/

├── package.json                    # 依赖管理（主责）

├── vite.config.ts                  # 构建配置（主责）

├── tsconfig.json                   # TypeScript配置（主责）

├── .eslintrc.js                    # 代码规范（主责）

├── .prettierrc                     # 代码格式化（主责）

├── src/

│   ├── main.ts                     # 应用入口（主责）

│   ├── stores/                     # 状态管理（主责）

│   │   ├── authStore.ts           # 认证状态（主责）

│   │   ├── userStore.ts           # 用户状态（主责）

│   │   └── preferencesStore.ts    # 偏好状态（主责）

│   ├── router/                     # 路由配置（主责）

│   │   └── index.ts               # 路由定义（主责）

│   ├── utils/                      # 工具函数（主责）

│   │   ├── apiClient.ts           # API客户端（主责）

│   │   ├── authHelper.ts          # 认证工具（主责）

│   │   └── validation.ts          # 验证工具（主责）

│   └── types/                      # TypeScript类型（主责）

│       ├── user.types.ts          # 用户类型（主责）

│       ├── auth.types.ts          # 认证类型（主责）

│       └── api.types.ts           # API类型（主责）

└── scripts/

&nbsp;   └── deploy.sh                  # 部署脚本（主责）

##### 不需负责文件：

frontend/src/assets/styles/        # 样式文件

frontend/src/components/           # 交互组件

design-system.md                   # 设计文档

##### 关键交互点

与前端交互：提供 useAuthStore() 供交互组件使用



与后端API：apiClient.ts 配置认证头和后端API地址



与后端数据库：通过API类型定义与数据模型对齐



与前端UI：确保CSS变量在构建中正确导入



### 钟楚萌：前端UI视觉

##### 核心职责

让产品拥有专业、一致、美观的视觉体验。

##### 负责内容：

frontend/

├── src/

│   ├── assets/

│   │   ├── styles/

│   │   │   ├── variables.scss           # 设计变量（主责）

│   │   │   ├── reset.scss               # 样式重置（主责）

│   │   │   └── global.scss              # 全局样式（主责）

│   │   ├── fonts/                       # 字体文件（主责）

│   │   ├── images/                      # 图片资源（主责）

│   │   └── icons/                       # SVG图标（主责）

│   ├── App.vue                          # 主应用样式（主责）

│   └── components/

│       ├── Auth/

│       │   ├── LoginForm.vue            # 登录表单样式（主责）

│       │   └── RegisterForm.vue         # 注册表单样式（主责）

│       └── User/

│           ├── UserProfile.vue          # 用户资料样式（主责）

│           └── PreferencesPanel.vue     # 偏好设置样式（主责）

├── public/

│   └── favicon.ico                      # 网站图标（主责）

└── design-system.md                     # 设计系统文档（主责）

##### 不需负责文件：

frontend/src/components/    # 组件逻辑

frontend/src/composables/   # 业务逻辑

backend/                    # 所有后端文件

##### 关键交互点

与前端交互：LoginForm.vue的视觉状态（正常/加载/错误）



与前端架构：CSS变量命名和导入方式



### 余明远：前端交互逻辑

##### 核心职责

实现流畅、智能、用户友好的交互体验。

##### 负责内容：

frontend/src/

├── components/

│   ├── Auth/

│   │   ├── LoginForm.vue           # 登录逻辑（主责）

│   │   └── RegisterForm.vue        # 注册逻辑（主责）

│   ├── User/

│   │   ├── UserProfile.vue         # 用户资料交互（主责）

│   │   ├── PreferencesPanel.vue    # 偏好设置交互（主责）

│   │   └── HistoryList.vue         # 历史记录交互（主责）

│   └── Navigation/

│       └── UserMenu.vue            # 用户菜单交互（主责）

├── composables/

│   ├── useAuth.ts                  # 认证逻辑（主责）

│   ├── useUserPreferences.ts       # 用户偏好逻辑（主责）

│   └── useUserHistory.ts           # 用户历史逻辑（主责）

└── router/

&nbsp;   └── guards/

&nbsp;       └── auth.ts                 # 路由守卫认证逻辑（主责）

##### 不需负责文件：

frontend/src/assets/styles/         # 样式文件

frontend/src/stores/                # 状态管理

frontend/vite.config.ts             # 构建配置

##### 关键交互点

与前端UI：使用UI专家提供的CSS类名和组件



与前端架构：调用 useAuthStore() 管理用户状态



与后端API：调用 /auth/login 等用户相关API



与后端数据库：通过API间接获取用户数据



### 胡杨：后端API

##### 核心职责

构建稳定、安全、易用的API系统，特别是用户相关API。

##### 负责内容：

backend/

├── src/

│   ├── api/                        # API核心（主责）

│   │   ├── routes.py               # 路由定义（主责）

│   │   │   ├── auth\_routes         # 认证路由（主责）

│   │   │   ├── user\_routes         # 用户路由（主责）

│   │   │   └── preferences\_routes  # 偏好路由（主责）

│   │   ├── schemas.py              # 请求响应模式（主责）

│   │   │   ├── AuthSchemas         # 认证模式（主责）

│   │   │   ├── UserSchemas         # 用户模式（主责）

│   │   │   └── PreferenceSchemas   # 偏好模式（主责）

│   │   └── middleware.py           # 中间件（主责）

│   ├── auth/                       # 认证授权（主责）

│   │   ├── jwt\_handler.py          # JWT处理（主责）

│   │   ├── password\_handler.py     # 密码处理（主责）

│   │   └── oauth\_handler.py        # OAuth处理（如果支持）（主责）

│   ├── services/                   # 业务服务（主责）

│   │   ├── auth\_service.py         # 认证服务（主责）

│   │   ├── user\_service.py         # 用户服务（主责）

│   │   └── preference\_service.py   # 偏好服务（主责）

│   └── config/

│       └── api\_config.yaml         # API配置（主责）

├── app.py                          # 应用入口（主责）

├── requirements.txt                # 依赖列表（主责）

├── .env.example                    # 环境变量示例（主责）

└── tests/

&nbsp;   ├── test\_auth\_api.py            # 认证API测试（主责）

&nbsp;   └── test\_user\_api.py            # 用户API测试（主责）

##### 不需负责文件：

backend/src/database/models.py      # 数据模型

backend/src/agents/                 # 智能体

backend/src/database/repositories/  # 数据仓库

##### 关键交互点

与前端架构：定义API契约和类型



与后端数据库：调用用户数据仓库接口



与后端智能体：调用个性化服务接口



与前端交互：确认API交互需求



### 蔡荣汉：后端智能体

##### 核心职责

实现智能、专业、可靠的深度研究算法，包括用户个性化。

##### 负责文件：

backend/

├── src/

│   ├── agents/                     # 智能体核心（主责）

│   │   ├── personalization\_agent.py # 个性化智能体（主责）

│   │   ├── research\_agent.py       # 主智能体（主责）

│   │   ├── user\_analyzer.py        # 用户分析器（主责）

│   │   └── recommendation\_engine.py # 推荐引擎（主责）

│   ├── llm/                        # LLM集成（主责）

│   │   └── personalization\_prompts.py # 个性化提示词（主责）

│   └── config/

│       └── personalization\_config.yaml # 个性化配置（主责）

├── prompts/                        # 提示词目录（主责）

│   ├── user\_analysis.txt           # 用户分析提示词（主责）

│   └── personalized\_recommendation.txt # 个性化推荐提示词（主责）

└── tests/

&nbsp;   └── test\_personalization.py     # 个性化测试（主责）

##### 不需负责文件：

backend/src/database/models.py      # 用户模型

backend/src/api/routes.py           # 用户API

backend/src/auth/                   # 认证逻辑

##### 关键交互点

与后端数据库：读取用户历史数据进行分析



与后端API：提供个性化推荐API的实现



与前端交互：通过API间接提供个性化功能



### 蒋宇飞：后端数据库

##### 核心职责

构建高效、稳定、可扩展的数据存储与检索系统，特别是用户数据。

##### 负责文件：

backend/

├── src/

│   ├── database/                   # 数据库核心（主责）

│   │   ├── models.py               # 数据模型（主责）

│   │   │   ├── User模型            # 用户模型（主责）

│   │   │   ├── ResearchHistory模型 # 研究历史（主责）

│   │   │   └── UserPreferences模型 # 用户偏好（主责）

│   │   ├── repositories/           # 数据仓库（主责）

│   │   │   ├── user\_repository.py  # 用户仓库（主责）

│   │   │   ├── history\_repository.py # 历史仓库（主责）

│   │   │   └── preferences\_repository.py # 偏好仓库（主责）

│   │   └── migrations/             # 数据库迁移（主责）

│   │       └── versions/

│   │           └── add\_user\_tables.py # 用户表迁移（主责）

│   └── config/

│       └── database\_config.yaml    # 数据库配置（主责）

├── scripts/

│   ├── init\_user\_data.py           # 用户数据初始化（主责）

│   └── backup\_user\_data.py         # 用户数据备份（主责）

└── tests/

&nbsp;   └── test\_user\_database.py       # 用户数据库测试（主责）

##### 不需负责文件：

backend/src/api/routes.py           # 用户API

backend/src/auth/jwt\_handler.py     # 认证逻辑

backend/src/agents/                 # 智能体

##### 关键交互点

与后端API：提供用户CRUD接口供API层调用



与后端智能体：提供用户历史数据供分析



与前端架构：通过API类型定义对齐数据结构






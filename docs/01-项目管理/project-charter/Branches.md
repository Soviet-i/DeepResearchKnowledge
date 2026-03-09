# 一.docs----项目文档

├── 01-项目管理/

│   ├── project-charter/           项目章程

│   │   ├── Branches.md           分支介绍

│   │   ├── target.md		项目目标

│   │   ├── product.md		阶段产出物

│   │   └── teamwork.md		团队分工

│   ├── milestone.md                 计划

│   ├── meeting-notes/               会议记录

│   └── task-board.md                github初步使用指南

│

├── 02-产品需求/

│   ├── PRD.md                       产品需求文档

│   ├── user-stories.md              用户故事

│   ├── feature-list.md              功能清单与优先级

│   └── user-personas.md             用户画像

│

├── 03-设计/

│   ├── design-system.md             设计规范

│   ├── ui-specs/                    界面详细标注

│   │   ├── home-page-spec.md				主界面

│   └── figma-links.md               即时设计链接汇总

│

├── 04-技术/

│   ├── tech-stack.md                技术选型说明

│   ├── api-documentation.md         API接口文档

│   ├── database-schema.md           数据库/数据结构设计

│   ├── deployment-guide.md          部署指南

│   └── third-party-apis.md          第三方API使用说明

│

├── 05-商业/

│   ├── market-analysis.md           市场分析

│   ├── competitor-analysis.md       竞品分析

│   ├── business-model.md            商业模式

│   └── financial-projection.md      财务预测

│

└── 06-演示与交付/

    ├── demo-script.md               演示脚本

    ├── faq.md                       评委可能问的问题及答案

    └── submission-checklist.md      提交前需要检查清单





# 二.prototypes----设计原型文件

├── screenshots/            各页面截图（用于README）

├── assets/                 设计资源（图标、图片等）

│   ├── icons/

│   ├── images/

│   └── logos/

└── README.md               设计说明，包含在线原型链接







# 三.frontend----前端代码

├── public/                静态资源（如果使用传统前端）

│   ├── index.html

│   ├── favicon.ico

│   └── assets/

│

├── src/                   源代码（如果手写代码）

│   ├── components/         组件

│   ├── pages/             页面

│   ├── styles/            样式

│   └── utils/             工具函数

│

├── lowcode-export/         低代码平台导出的代码

│   └── (平台生成的文件夹)

│

└── README.md               前端启动说明

# 四.backend----后端逻辑

├── api/                    API处理（如果有独立后端）

│   ├── routes/            路由

│   └── controllers/       控制器

│

├── services/              业务逻辑

│   ├── ai-service.js      AI调用服务

│   └── research-service.js  研究逻辑

│

├── scripts/               数据处理脚本

│   └── mock-data-generator.py  生成模拟数据

│

├── lowcode-workflows/     低代码平台的工作流配置备份

│   └── (导出或截图)

│

└── README.md              后端启动说明

# 五.presentations----路演材料

├── 01-商业计划书/

│

├── 02-路演PPT/

│

├── 03-海报与展板/

│

└── 04-演示视频/

# 六.scripts----工具脚本

# 七.README.md----项目总说明

## 关于“占位用”：仅做占位方便初始创建空文件夹，后续可以自行删去

## 相关名词介绍：

产品需求文档：用于规定“我们具体要做一个什么东西”

用户故事：站在不同用户角度分析需求

功能清单与优先级：必须做的是什么，可以做的是什么，不用做的是什么

设计规范：告诉所有人：“深知”这个网站应该长什么样，以及为什么长这样

界面详细标注：用标注的方式，把设计稿中每一个元素的精确尺寸、颜色、间距、字体、交互状态等详细信息明确标出来，确保开发人员能100%还原设计

即时设计链接汇总：指的是一个专门记录所有设计资源在线链接的文档

技术选型说明：是项目文档中解释“我们用什么工具/技术来实现产品”的部分

第三方API使用说明：我们计划调用的、不属于自己开发的外部服务的接入文档

静态资源：包括网页基础骨架，样式文件（装饰网站），JavaScript文件，图片资源，字体文件，数据文件

低代码平台导出的代码：从我们选定的低代码开发平台（如即时设计、Bubble.io、V0.dev等）中导出的可以直接在浏览器中运行的网页文件

工具脚本：为辅助开发、测试、部署或数据处理而编写的小型程序


# 深知智能体 · 功能清单

## 最后更新：2026年02月23日



### 一、功能分级说明

采用 MoSCoW 法则进行优先级划分：



优先级		含义						

Must have	必须有，没有则产品无法使用	

Should have	应该有，核心体验的重要组成部分	

Could have	可以有，提升体验的加分项	

Won't have	本次不做，但可能纳入未来规划	

### 二、核心功能清单

##### 2.1 智能问答（深度研究模式）

功能				优先级		说明

研究问题输入框	Must have	支持自然语言输入研究问题

问题历史记录		Should have	记录用户之前提过的问题

问题示例推荐		Could have	为新用户提供示例问题

多语言问题支持	Won't have	暂不支持中英文以外语言



功能				优先级		说明

研究状态分步展示	Must have	显示当前研究进行到哪一步（解析问题、检索文献、分析对比、生成报告）

思考过程可视化	Should have	展示AI正在思考的关键词、检索策略

实时进度提示		Should have	预计剩余时间、已找到的论文数量

中途取消研究		Could have	允许用户中断正在进行的研究



功能			优先级		说明

核心答案摘要	Must have	AI生成的问题核心回答，300字以内

关键论文列表	Must have	展示最重要的3-10篇论文，包含标题、作者、年份、摘要

论文详情弹窗	Should have	点击论文可查看完整摘要、DOI、原文链接

观点对比表格	Should have	对不同论文/团队的核心观点进行对比

研究时间线	Could have	按年份展示该领域的重要进展

学者网络图	Could have	展示核心作者及其引用关系

研究热度趋势	Could have	该领域论文发表数量随时间变化

论文引用次数	Could have	显示每篇论文的被引次数

结果导出		Could have	导出为Markdown或PDF

##### 2.2 论文检索与管理

功能			优先级	 	说明

关键词检索	Must have	支持传统的论文关键词搜索

高级筛选		Should have	按年份、作者、期刊、被引次数筛选

搜索结果排序	Should have	按相关度、时间、被引次数排序

论文收藏		Should have	用户可以收藏感兴趣的论文

收藏夹管理	Should have	查看、整理收藏的论文

阅读历史		Could have	记录用户看过的论文

论文笔记		Could have	为论文添加个人笔记

引用格式导出	Could have	导出BibTeX、EndNote等格式

##### 2.3 用户系统

功能			优先级		说明

免登录使用	Must have	用户无需登录即可使用基础搜索功能

账号注册/登录	Should have	支持邮箱/手机号注册登录

个人主页		Should have	查看自己的收藏、历史、笔记

第三方登录	Could have	支持微信/GitHub/Google登录

密码找回		Could have	忘记密码时可重置

##### 2.4 用户体验相关

功能			优先级		说明

新用户引导	Should have	第一次使用时介绍核心功能

帮助文档		Should have	常见问题解答、使用教程

反馈入口		Should have	用户可以提交问题或建议

深色模式		Could have	支持浅色/深色主题切换

移动端适配	Could have	手机浏览器可用（非APP）

快捷键支持	Could have	键盘快捷键提升效率

##### 2.5 数据与性能

功能				优先级		说明

真实学术API接入	Must have	至少接入ArXiv或Semantic Scholar

本地数据缓存		Should have	缓存搜索结果，减少重复请求

错误处理			Must have	API超时、无结果等情况有友好提示

加载状态			Must have	所有操作都有明确的加载反馈

空状态设计		Should have	无数据时页面不显得空洞

页面响应时间		Should have	核心操作响应时间<2秒




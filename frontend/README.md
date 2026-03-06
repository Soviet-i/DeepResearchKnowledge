# Deep Research - 学术研究助手

一个基于React+TypeScript的学术研究助手，帮助用户搜索学术文献、生成研究报告。

## 项目特性

- 📚 文献搜索与筛选
- 📝 多种类型研究报告生成（综述、详细分析、对比研究）
- 📊 研究数据可视化
- 🎨 响应式设计，支持多种设备
- 🌓 深色/浅色主题切换
- 🌐 多语言支持

## 技术栈

- **前端框架**: React 18+
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **路由**: React Router
- **动画**: Framer Motion
- **图表**: Recharts
- **通知**: Sonner
- **数据验证**: Zod

## 环境准备

在运行项目之前，请确保您的计算机已安装以下软件：

- **Node.js**: 推荐 v16.0 或更高版本
- **包管理器**: npm、yarn 或 pnpm（至少安装一种）

### 检查 Node.js 版本

```bash
node -v
```

如果您还没有安装 Node.js，可以从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。

## 运行项目

### 方法一：使用 npm（推荐，大多数用户的默认选择）

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 打开浏览器访问

开发服务器启动后，打开浏览器并访问以下地址：
http://localhost:3000

### 方法二：使用 pnpm

如果您希望使用 pnpm 作为包管理器，请按照以下步骤操作：

1. 安装 pnpm（如果尚未安装）

```bash
npm install -g pnpm
```

2. 安装依赖

```bash
pnpm install
```

3. 启动开发服务器

```bash
pnpm dev
```

### 方法三：使用 yarn

如果您希望使用 yarn 作为包管理器，请按照以下步骤操作：

1. 安装 yarn（如果尚未安装）

```bash
npm install -g yarn
```

2. 安装依赖

```bash
yarn install
```

3. 启动开发服务器

```bash
yarn dev
```

## 构建项目

如果您需要构建生产版本的项目，可以使用以下命令：

### 使用 npm

```bash
npm run build
```

### 使用 pnpm

```bash
pnpm build
```

### 使用 yarn

```bash
yarn build
```

构建后的文件将位于 `dist` 目录中。

## 项目结构

```
├── src/
│   ├── components/      # 可复用组件
│   ├── contexts/        # React Context
│   ├── hooks/           # 自定义 hooks
│   ├── lib/             # 工具函数和API服务
│   ├── pages/           # 页面组件
│   ├── App.tsx          # 应用入口组件
│   ├── index.css        # 全局样式
│   └── main.tsx         # 程序入口文件
├── index.html           # HTML入口
├── package.json         # 项目依赖配置
└── vite.config.ts       # Vite配置
```

## 常见问题及解决方案

### 问题 1：`pnpm` 不是内部或外部命令，也不是可运行的程序

**解决方案**：这意味着您的计算机上尚未安装 pnpm。您可以选择：

1. 安装 pnpm：`npm install -g pnpm`
2. 或者使用 npm：`npm install` 和 `npm run dev`
3. 或者使用 yarn：`yarn install` 和 `yarn dev`

### 问题 2：依赖安装失败

**解决方案**：
- 检查您的网络连接
- 尝试使用不同的包管理器
- 清除包管理器缓存：
  - npm: `npm cache clean --force`
  - pnpm: `pnpm store prune`
  - yarn: `yarn cache clean`

### 问题 3：开发服务器无法启动或端口被占用

**解决方案**：
- 检查是否有其他程序正在使用 3000 端口
- 可以尝试修改 `package.json` 中的 `dev:client` 脚本，更改端口号

### 问题 4：页面显示异常或功能不可用

**解决方案**：
- 确保所有依赖都已正确安装
- 清除浏览器缓存或使用无痕模式
- 检查控制台错误信息，针对性解决问题

## 功能使用说明

### 搜索文献

1. 在首页或导航栏的搜索框中输入关键词
2. 点击搜索按钮或按回车键
3. 在搜索结果页面查看相关文献
4. 可以使用左侧筛选面板进行过滤和排序

### 生成研究报告

1. 在搜索结果页面选择感兴趣的文献
2. 页面右下角会出现报告生成选项
3. 选择所需的报告类型（综述、详细分析、对比研究）
4. 系统将开始生成报告，完成后可查看、下载或复制报告内容

### 偏好设置

1. 点击导航栏中的"偏好设置"
2. 可以调整主题模式、界面语言和通知设置
3. 设置将自动保存并应用

## 开发说明

如果您想参与项目开发或进行自定义修改，请参考以下说明：

1. 确保您已安装了所有必要的开发依赖
2. 遵循代码风格和项目结构规范
3. 在提交代码前进行充分测试

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 联系我们

如果您在使用过程中遇到任何问题或有任何建议，欢迎联系我们。
## Backend API Base URL

This frontend supports runtime API base URL via Vite env:

- `VITE_API_BASE_URL` (example: `http://localhost:3001/api`)

Behavior:
- If `VITE_API_BASE_URL` is set, frontend calls that base URL.
- If not set and running in dev, it defaults to `http://localhost:3001/api`.
- If not set and running in production, it defaults to `/api`.

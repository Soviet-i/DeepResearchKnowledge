<template>
  <!-- 1. 应用根容器 -->
  <div class="app">
    
    <!-- 2. 导航栏 -->
    <nav class="navbar">
      <!-- 2.1 左侧：Logo和网站名称 -->
      <div class="nav-left">
        <!-- 移除Logo图标，只保留网站名称 -->
        <h1 class="site-name">Deep Research</h1>
      </div>
      
      <!-- 2.2 右侧：导航链接 -->
      <div class="nav-right">
        <!-- 首页链接 -->
        <router-link to="/" class="nav-link">
          <span class="nav-text">首页</span>
        </router-link>
        
        <!-- 注册/登录链接 -->
        <router-link to="/login" class="nav-link">
          <i class="nav-icon"></i>
          <span class="nav-text">注册/登录</span>
        </router-link>
        
        <router-link to="/preferences" class="nav-link">
          <i class="nav-icon"></i>
          <span class="nav-text">偏好设置</span>
        </router-link>
      </div>
    </nav>

    <!-- 3. 主要内容区域 -->
    <main class="main-content">
      <!-- 只在首页显示搜索框 -->
      <template v-if="$route.path === '/'">
        <!-- 4. 标语区域 -->
        <div class="slogan-section">
          <div class="slogan-container">
            <h2 class="slogan-text">Make in-depth research accessible to all</h2>
            <div class="slogan-decoration">
              <span class="decoration-line"></span>
              <i class="decoration-icon"></i>
              <span class="decoration-line"></span>
            </div>
          </div>
        </div>

        <!-- 5. 搜索区域 - 置于页面最下方 -->
        <div class="search-section">
          <!-- 搜索框容器 -->
          <div class="search-container">
            <!-- 搜索图标 -->
            <i class="search-icon"></i>
            <!-- 搜索输入框 -->
            <input 
              type="text" 
              class="search-input" 
              placeholder="输入关键词搜索..." 
            />
            <!-- 搜索按钮 -->
            <button class="search-button">
              搜索
            </button>
          </div>
        </div>
      </template>
      

      <div class="route-content">
        <router-view></router-view>
      </div>
      
    </main>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>

<style lang="scss">

/* 强制显示所有导航内容 */
.nav-link * {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.nav-icon {
  font-size: 5.25rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.nav-text {
  font-size: 4.2rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
  white-space: nowrap !important;
}

/* 路由内容区域样式 */
.route-content {
  flex: 1;
  width: 100%;
  padding: 40px 20px;
  margin-top: 40px;
}



// 间距系统 (基于8px网格)
$spacing-1: 0.25rem;     
$spacing-2: 0.5rem;      
$spacing-3: 0.75rem;    
$spacing-4: 1rem;       
$spacing-5: 1.25rem;     
$spacing-6: 1.5rem;      
$spacing-8: 2rem;        
$spacing-10: 2.5rem;     
$spacing-12: 3rem;       
$spacing-16: 4rem;       
$spacing-20: 5rem;       
$spacing-24: 6rem;       
$spacing-32: 8rem;       

// 字体系统
$font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
$font-family-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

$font-size-xs: 0.75rem;      // 12px
$font-size-sm: 0.875rem;     // 14px 
$font-size-base: 1rem;       // 16px
$font-size-lg: 1.125rem;     // 18px
$font-size-xl: 1.25rem;      // 20px
$font-size-2xl: 1.5rem;      // 24px
$font-size-3xl: 1.875rem;    // 30px
$font-size-4xl: 2.25rem;     // 36px
$font-size-5xl: 3rem;        // 48px 
$font-size-6xl: 3.75rem;     // 60px 
$font-size-7xl: 4.5rem;      // 72px 
$font-size-8xl: 5.25rem;     // 84px 

$font-weight-light: 300;
$font-weight-normal: 400;    // 常规
$font-weight-medium: 500;    // 中等
$font-weight-semibold: 600;  // 半粗
$font-weight-bold: 700;      // 粗体
$font-weight-extrabold: 800; // 特粗

$slogan-font-size-watermark: 7.6rem; //标语水印字体大小

// 🎨 主色调 - 蓝紫色系
$color-primary: #3b82f6;        // 主蓝色 - 用于主要按钮、重要元素
$color-primary-light: #60a5fa;   // 浅蓝色 - 用于悬停、高亮状态
$color-primary-dark: #1d4ed8;    // 深蓝色 - 用于激活状态

$color-secondary: #8b5cf6;       // 紫色 - 用于辅助元素、强调色
$color-secondary-light: #a78bfa;  // 浅紫色 - 用于背景、渐变
$color-secondary-dark: #7c3aed;   // 深紫色 - 用于深色主题

$color-accent: #06b6d4;          // 蓝绿色 - 点缀色，用于图标、小元素

// ⚪ 中性色 - 白色系
$color-white: #ffffff;           // 纯白色 - 背景、文字反色
$color-gray-50: #f8fafc;         // 最浅灰 - 页面背景
$color-gray-100: #f1f5f9;        // 浅灰 - 卡片背景
$color-gray-200: #e2e8f0;        // 中浅灰 - 边框、分隔线
$color-gray-300: #cbd5e1;        // 中等灰 - 禁用状态
$color-gray-400: #94a3b8;        // 中深灰 - 次要文字
$color-gray-500: #64748b;        // 深灰 - 正文文字
$color-gray-600: #475569;        // 更深灰 - 标题文字
$color-gray-700: #334155;        // 接近黑 - 重要标题
$color-gray-800: #1e293b;        // 深黑灰 - 强调文字
$color-gray-900: #0f172a;        // 接近纯黑 - 极少使用

// ✅ 功能色
$color-success: #10b981;         // 成功绿色 - 完成状态
$color-warning: #f59e0b;         // 警告黄色 - 提醒状态
$color-error: #ef4444;           // 错误红色 - 错误状态
$color-info: #3b82f6;            // 信息蓝色 - 提示信息

// 圆角系统
$border-radius-none: 0;
$border-radius-sm: 0.125rem;   // 2px
$border-radius-base: 0.25rem;  // 4px 
$border-radius-md: 0.375rem;   // 6px  
$border-radius-lg: 0.5rem;     // 8px 
$border-radius-xl: 0.75rem;    // 12px
$border-radius-2xl: 1rem;      // 16px 
$border-radius-3xl: 1.5rem;    // 24px
$border-radius-4xl: 2rem;      // 32px
$border-radius-5xl: 2.5rem;    // 40px 
$border-radius-6xl: 3rem;      // 48px 
$border-radius-full: 9999px;   // 完全圆形

// 阴影系统
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
$shadow-3xl: 0 35px 60px -15px rgba(0, 0, 0, 0.3);

// 动画
$transition-fast: 150ms ease;      // 快速过渡
$transition-base: 300ms ease;      // 基础过渡
$transition-slow: 500ms ease;      // 慢速过渡

// 布局尺寸
$navbar-height: 4rem;              // 64px  - 导航栏高度
$container-max-width: 80rem;       // 1280px - 容器最大宽度
$search-box-max-width: 50rem;      // 800px  - 搜索框最大宽度
$sidebar-width: 16rem;             // 256px - 侧边栏宽度



/* ====================标语区域样式 ==================== */
.slogan-section {
  width: 100%;
  max-width: 3600px;
  padding: 0 72px;
  margin-top: 0;
  margin-bottom: 0;
  position: relative; 
  top: 0; 
  left: 0; 
  transform: none; 
  z-index: 1;
  height: 70vh; 
  display: flex; 
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.slogan-container {
  text-align: center;
  padding: 0;
  position: relative;
}

.slogan-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: $slogan-font-size-watermark; 
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 12px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.15; 
  width: 100%;
  pointer-events: none;
}

.slogan-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.decoration-line {
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, transparent, #06b6d4, transparent);
  border-radius: 9999px;
  opacity: 0.5; 
}

.decoration-icon {
  font-size: 2.8rem;
  color: #06b6d4;
  animation: pulse 2s infinite;
  opacity: 0.5; 
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); } 
  50% { opacity: 0.6; transform: scale(1.1); } 
}


/* ==================== 应用全局样式 ==================== */

/* 1. 应用根容器 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* ==================== 导航栏样式 ==================== */

/* 2. 导航栏容器 */
.navbar {
  height: 240px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 96px;
  box-shadow: $shadow-lg;
  position: relative;
  z-index: 1000;
  flex-shrink: 0;
}

/* 2.1 导航栏左侧区域 */
.nav-left {
  display: flex;
  align-items: center;
  gap: 72px;
}

/* Logo图标 */
.logo {
  width: 10.5rem;
  height: 10.5rem;
  background-color: rgba($color-white, 0.2);
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.logo-icon {
  font-size: 6rem;
  color: $color-white;
}

/* 网站名称 */
.site-name {
  font-size: 6rem;
  font-weight: $font-weight-bold;
  color: $color-white;
  letter-spacing: -2.25px;
  text-shadow: 0 9px 18px rgba(0, 0, 0, 0.2);
}

/* 2.2 导航栏右侧区域 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 96px;
}

/* 导航链接 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 36px 54px;
  color: rgba($color-white, 0.9);
  font-size: 4.2rem;
  font-weight: $font-weight-medium;
  border-radius: calc($border-radius-lg * 1.2);
  transition: all $transition-base;
  text-decoration: none;
  
  &:hover {
    background-color: rgba($color-white, 0.12);
    color: $color-white;
    transform: translateY(-9px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 导航图标 */
.nav-icon {
  font-size: 5.25rem;
}

/* 导航文字 */
.nav-text {
  white-space: nowrap;
}

/* ==================== 主要内容区域 ==================== */

/* 3. 主要内容容器 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 0;
  width: 100%;
}

/* ==================== 搜索区域样式 ==================== */

/* 4. 搜索区域容器 */
.search-section {
  width: 100%;
  max-width: 4200px;
  padding: 0;
  margin-top: auto; 
  margin-bottom: 0; 
  position: relative;
  z-index: 10;
  padding-bottom: 0;
  margin-bottom: 0;
  transform: translateY(12rem);
}

/* 搜索框整体容器 */
.search-container {
  display: flex;
  align-items: center;
  background-color: $color-white;
  border: 5px solid $color-primary;
  border-radius: 4rem;
  padding: 32px 65px;
  box-shadow: $shadow-xl;
  transition: all $transition-base;
  height: auto;
  position: relative; 
  
  &:hover {
    border-color: $color-primary-dark;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-6px);
  }
  
  &:focus-within {
    border-color: $color-secondary;
    box-shadow: 0 0 0 6px rgba($color-secondary, 0.2);
  }
}

/* 搜索图标 */
.search-icon {
  font-size: 4.2rem;
  color: $color-gray-400;
  margin-right: 48px;
  flex-shrink: 0;
}

/* 搜索输入框 */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 3.6rem;
  padding: 24px 280px 24px 0; 
  color: $color-gray-900;
  min-width: 0;
  background-color: transparent;
  font-weight: $font-weight-medium;
  letter-spacing: 0.8px;
  height: 8rem;
  
  &::placeholder {
    color: $color-gray-400;
    font-size: 4rem; 
    font-weight: $font-weight-normal;
  }
}

/* 搜索按钮 */
.search-button {
  background: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
  color: $color-white;
  border: none;
  padding: 28px 80px;
  border-radius: 2.5rem;
  font-size: 4rem; 
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;
  white-space: nowrap;
  letter-spacing: 1px;
  box-shadow: $shadow-lg;
  position: absolute; 
  right: 20px; 
  bottom: 20px; 
  overflow: hidden;
  height: 10rem; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba($color-white, 0.22), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
}

/* ==================== 响应式设计 ==================== */

/* 平板设备适配（宽度 ≤ 768px） */
@media (max-width: 768px) {
  .slogan-section {
    padding: 0 $spacing-4;
    margin-top: 0;
    margin-bottom: 0;
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    height: 50vh; 
    margin-top: -30px;
  }
  
  .slogan-text {
    font-size: 3.8rem; 
    opacity: 0.1; 
  }
  
  .decoration-icon {
    font-size: 1.5rem;
  }
  
  .slogan-decoration {
    gap: $spacing-3;
    margin-top: $spacing-1;
    margin-bottom: $spacing-2;
  }
  
  .main-content {
    padding-top: 0;
  }
  
  .navbar {
    padding: 0 $spacing-4;
    height: 3.5rem;
  }
  
  .logo {
    width: 2rem;
    height: 2rem;
  }
  
  .logo-icon {
    font-size: 1.25rem;
  }
  
  .site-name {
    font-size: $font-size-xl;
  }
  
  .nav-right {
    gap: $spacing-4;
  }
  
  .nav-link {
    padding: $spacing-1 $spacing-2;
    font-size: $spacing-2;
  }
  
  .nav-icon {
    font-size: 1rem;
  }
  
  .search-section {
    padding: 0;
    margin-bottom: 0; 
    padding-bottom: 0;
    margin-bottom: 0;
    transform: translateY(5rem);
  }
  
  .search-container {
    padding: $spacing-3 $spacing-4;
    border-radius: 2.5rem;
  }
  
  .search-icon {
    font-size: 1.25rem;
    margin-right: $spacing-3;
  }
  
  .search-input {
    font-size: $font-size-lg;
    height: auto; 
    padding: $spacing-2 $spacing-6 $spacing-2 $spacing-2;
    
    &::placeholder {
      font-size: $font-size-lg;
    }
  }
  
  .search-button {
    position: static; 
    padding: $spacing-2 $spacing-6;
    font-size: $font-size-base;
    margin-left: $spacing-3;
    height: auto; 
  }
}

/* 手机设备适配（宽度 ≤ 480px） */
@media (max-width: 480px) {
  .slogan-section {
    height: 40vh;
    margin-top: -20px;
  }
  
  .slogan-text {
    font-size: 2.5rem; 
    opacity: 0.08; 
  }
  
  .slogan-decoration {
    gap: $spacing-2;
    margin-top: $spacing-1;
    margin-bottom: $spacing-2;
  }
  
  .main-content {
    padding-top: 0;
  }
  
  .navbar {
    padding: 0 $spacing-3;
    height: 3rem;
  }
  
  .nav-left {
    gap: $spacing-3;
  }
  
  .site-name {
    font-size: $font-size-lg;
  }
  
  .nav-right {
    gap: $spacing-3;
  }
  
  .nav-link .nav-text {
    display: none;
  }
  
  .nav-link {
    padding: $spacing-1;
  }
  
  .nav-icon {
    font-size: 1.125rem;
  }
  
  .search-section {
    padding: 0; 
    margin-bottom: 0; 
    padding-bottom: 0;
    margin-bottom: 0;
    transform: translateY(3rem);
  }
  
  .search-container {
    flex-direction: column;
    gap: $spacing-3;
    padding: $spacing-4;
    border-radius: $border-radius-xl;
  }
  
  .search-icon {
    display: none;
  }
  
  .search-input {
    text-align: center;
    padding: $spacing-2;
    height: auto; 
    
    &::placeholder {
      font-size: $font-size-base; 
    }
  }
  
  .search-button {
    width: 100%;
    margin-left: 0;
    border-radius: $border-radius-lg;
    height: auto; 
    position: static; 
    font-size: $font-size-base;
  }
}
</style>

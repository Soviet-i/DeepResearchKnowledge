<template>
  <!-- 注册表单容器 -->
  <div class="auth-container">
    <!-- 注册卡片 -->
    <div class="auth-card">
      <!-- 卡片头部 -->
      <div class="auth-header">
        <!-- 标题 -->
        <h2 class="auth-title">创建账号</h2>
        <!-- 副标题 -->
        <p class="auth-subtitle">加入我们，开启探索之旅</p>
      </div>

      <!-- 表单区域 -->
      <form class="auth-form">
        <!-- 用户名输入 -->
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <div class="input-group">
            <!-- 用户图标 -->
            <i class="input-icon"></i>
            <!-- 用户名输入框 -->
            <input
              id="username"
              type="text"
              class="form-input"
              placeholder="输入用户名"
            >
          </div>
        </div>

        <!-- 邮箱输入 -->
        <div class="form-group">
          <label class="form-label" for="email">邮箱地址</label>
          <div class="input-group">
            <!-- 邮箱图标 -->
            <i class="input-icon"></i>
            <!-- 邮箱输入框 -->
            <input
              id="email"
              type="email"
              class="form-input"
              placeholder="your.email@example.com"
            >
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <div class="input-group">
            <!-- 密码图标 -->
            <i class="input-icon"></i>
            <!-- 密码输入框 -->
            <input
              id="password"
              type="password"
              class="form-input"
              placeholder="至少8位字符"
            >
          </div>
          <!-- 密码强度指示器 -->
          <div class="password-strength">
            <div class="strength-bar"></div>
            <span class="strength-text">密码强度：弱</span>
          </div>
        </div>

        <!-- 确认密码输入 -->
        <div class="form-group">
          <label class="form-label" for="confirmPassword">确认密码</label>
          <div class="input-group">
            <!-- 密码图标 -->
            <i class="input-icon"></i>
            <!-- 确认密码输入框 -->
            <input
              id="confirmPassword"
              type="password"
              class="form-input"
              placeholder="再次输入密码"
            >
          </div>
        </div>

        <!-- 协议同意 -->
        <div class="form-group">
          <label class="checkbox-label agreement-label">
            <input type="checkbox" class="checkbox-input">
            <span class="checkbox-text">
              我已阅读并同意
              <a href="#" class="agreement-link">服务条款</a>
              和
              <a href="#" class="agreement-link">隐私政策</a>
            </span>
          </label>
        </div>

        <!-- 注册按钮 -->
        <button type="submit" class="submit-button">
          注册账号
        </button>

        <!-- 登录链接 -->
        <div class="auth-footer">
          <p class="footer-text">
            已有账号？
            <a href="#" class="footer-link">立即登录</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 注册页面
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
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

/* 注册容器 */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-gray-50 0%, $color-gray-100 100%);
  padding: $spacing-24;
  transform: translateY(calc(-100% / 6));
}

.auth-card {
  width: 100%;
  max-width: 84rem;
  background: $color-white;
  border-radius: $border-radius-4xl;
  padding: $spacing-24;
  box-shadow: $shadow-3xl;
  border: 3px solid $color-gray-200;
}

.auth-header {
  text-align: center;
  margin-bottom: $spacing-24;
  
  .auth-title {
    font-size: $font-size-7xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin-bottom: $spacing-8;
  }
  
  .auth-subtitle {
    font-size: $font-size-5xl;
    color: $color-gray-600;
  }
}

.auth-form {
  .form-group {
    margin-bottom: $spacing-20;
  }

  .form-label {
    display: block;
    font-size: $font-size-5xl;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    margin-bottom: $spacing-8;
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: $spacing-16;
    color: $color-gray-400;
    font-size: $font-size-5xl;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: $spacing-12 $spacing-16 $spacing-12 $spacing-32;
    font-size: $font-size-5xl;
    color: $color-gray-900;
    background: $color-white;
    border: 6px solid $color-gray-300;
    border-radius: $border-radius-3xl;
    transition: all $transition-base;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 12px rgba($color-primary, 0.1);
    }
    
    &::placeholder {
      color: $color-gray-400;
      font-size: $font-size-5xl;
    }
  }

  /* 密码强度指示器 */
  .password-strength {
    margin-top: $spacing-8;
    display: flex;
    align-items: center;
    gap: $spacing-8;
  }

  .strength-bar {
    flex: 1;
    height: 16px;
    background: $color-gray-300;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 30%;
      background: $color-error;
      border-radius: 8px;
      transition: all $transition-base;
    }
  }

  .strength-text {
    font-size: $font-size-4xl;
    color: $color-gray-600;
    font-weight: $font-weight-medium;
  }

  /* 协议同意标签 */
  .agreement-label {
    align-items: flex-start;
  }

  .agreement-link {
    color: $color-primary;
    text-decoration: none;
    font-weight: $font-weight-medium;
    font-size: $font-size-5xl;
    transition: color $transition-fast;
    
    &:hover {
      color: $color-primary-dark;
      text-decoration: underline;
    }
  }

  .submit-button {
    width: 100%;
    padding: $spacing-12 $spacing-24;
    font-size: $font-size-5xl;
    font-weight: $font-weight-semibold;
    color: $color-white;
    background: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
    border: none;
    border-radius: $border-radius-3xl;
    cursor: pointer;
    transition: all $transition-base;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: $shadow-3xl;
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: $spacing-8;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-input {
    width: $spacing-16;
    height: $spacing-16;
    border: 4px solid $color-gray-300;
    border-radius: $border-radius-base;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 8px;
    
    &:checked {
      background-color: $color-primary;
      border-color: $color-primary;
    }
  }

  .checkbox-text {
    font-size: $font-size-5xl;
    color: $color-gray-700;
    line-height: 1.4;
  }
}

.auth-footer {
  margin-top: $spacing-24;
  padding-top: $spacing-20;
  border-top: 3px solid $color-gray-200;
  text-align: center;
}

.footer-text {
  font-size: $font-size-5xl;
  color: $color-gray-600;
}

.footer-link {
  color: $color-primary;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  margin-left: $spacing-4;
  font-size: $font-size-5xl;
  transition: color $transition-fast;
  
  &:hover {
    color: $color-primary-dark;
    text-decoration: underline;
  }
}
</style>

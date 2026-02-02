<template>
  <!-- 应用根容器 -->
  <div class="app">
    
    <!-- 导航栏 -->
    <nav class="navbar">
      <!-- 左侧：Logo和网站名称 -->
      <div class="nav-left">
        <h1 class="site-name">Deep Research</h1>
      </div>
      
      <!-- 右侧：导航链接 -->
      <div class="nav-right">
        <router-link to="/" class="nav-link">
          <span class="nav-text">首页</span>
        </router-link>
        
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

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 路由内容区域 -->
      <div class="route-content">
        <router-view></router-view>
      </div>
    </main>

  </div>
</template>

<script setup>
// App.vue只负责全局布局
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

/* 应用全局样式 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* ==================== 导航栏样式 ==================== */
.navbar {
  height: 240px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 96px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
  flex-shrink: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 72px;
}

.site-name {
  font-size: 6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -2.25px;
  text-shadow: 0 9px 18px rgba(0, 0, 0, 0.2);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 96px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 36px 54px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 4.2rem;
  font-weight: 500;
  border-radius: 16px;
  transition: all 300ms ease;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    transform: translateY(-9px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 0;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
    height: 120px;
  }
  
  .site-name {
    font-size: 3rem;
  }
  
  .nav-right {
    gap: 30px;
  }
  
  .nav-link {
    padding: 15px 20px;
    font-size: 2rem;
    gap: 15px;
  }
  
  .nav-icon {
    font-size: 2.5rem !important;
  }
  
  .nav-text {
    font-size: 2rem !important;
  }
  
  .route-content {
    padding: 20px 10px;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 80px;
    padding: 0 15px;
  }
  
  .site-name {
    font-size: 2rem;
  }
  
  .nav-right {
    gap: 15px;
  }
  
  .nav-link {
    padding: 10px 15px;
    font-size: 1.5rem;
    gap: 10px;
  }
  
  .nav-icon {
    font-size: 1.8rem !important;
  }
  
  .nav-text {
    font-size: 1.5rem !important;
  }
  
  .route-content {
    padding: 15px 8px;
    margin-top: 15px;
  }
}
</style>

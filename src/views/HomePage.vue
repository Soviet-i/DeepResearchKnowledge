<template>
  <div class="home-page">
    <div class="header">
      <h1>深知DeepResearch</h1>
      <p class="subtitle">智能科研助手 - 基于AI的深度研究平台</p>
    </div>
    
    <div class="content">
      <div class="card">
        <h2>🎉 第一周成果</h2>
        <ul>
          <li>✅ Vue 3 + TypeScript 项目框架搭建完成</li>
          <li>✅ Vite构建工具配置完成</li>
          <li>✅ Element Plus UI库集成</li>
          <li>✅ Vue Router路由系统就绪</li>
          <li>✅ 开发服务器正常运行</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>🚀 快速开始</h2>
        <div class="buttons">
          <el-button type="primary" size="large" @click="$router.push('/login')">
            开始使用
          </el-button>
          <el-button size="large" @click="$router.push('/register')">
            注册账号
          </el-button>
        </div>
      </div>
      
      <div class="team-info">
        <h3>👥 团队分工</h3>
        <div class="team-roles">
          <div class="role">
            <span class="role-icon">🎨</span>
            <div>
              <strong>UI视觉</strong>
              <p>负责界面设计和视觉规范</p>
            </div>
          </div>
          <div class="role">
            <span class="role-icon">🖱️</span>
            <div>
              <strong>交互逻辑</strong>
              <p>负责用户交互和体验优化</p>
            </div>
          </div>
          <div class="role">
            <span class="role-icon">⚙️</span>
            <div>
              <strong>前端架构</strong>
              <p>负责技术框架和工程化</p>
            </div>
          </div>
          <div class="role">
            <span class="role-icon">🤖</span>
            <div>
              <strong>AI智能体</strong>
              <p>负责深度研究算法</p>
            </div>
          </div>
          <div class="role">
            <span class="role-icon">🗄️</span>
            <div>
              <strong>数据库</strong>
              <p>负责数据存储和检索</p>
            </div>
          </div>
          <div class="role">
            <span class="role-icon">🔌</span>
            <div>
              <strong>API接口</strong>
              <p>负责后端服务和接口</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页组件
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px;
}

.header {
  text-align: center;
  margin-bottom: 50px;
}

.header h1 {
  font-size: 3rem;
  color: #1890ff;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #333;
  margin-bottom: 20px;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  padding: 8px 0;
  color: #555;
}

.card li:before {
  content: "✓ ";
  color: #52c41a;
  font-weight: bold;
}

.buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.team-info {
  margin-top: 50px;
  text-align: center;
}

.team-info h3 {
  color: #333;
  margin-bottom: 30px;
}

.team-roles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.role {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.role:hover {
  transform: translateY(-5px);
}

.role-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f7ff;
  border-radius: 50%;
}

.role strong {
  display: block;
  color: #1890ff;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.role p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}
</style>

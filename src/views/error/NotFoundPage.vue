<template>
  <div class="not-found">
    <div class="error-code">404</div>
    <h1>页面不存在</h1>
    <p>抱歉，您访问的页面不存在或已被移除</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
// 404页面
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #1890ff;
  line-height: 1;
}

h1 {
  margin: 20px 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 30px;
}
</style>

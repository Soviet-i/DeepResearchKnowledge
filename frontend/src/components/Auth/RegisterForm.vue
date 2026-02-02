<template>
  <div class="register-form">
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="registerForm.username"
          class="form-input"
          type="text"
          placeholder="请设置用户名"
        />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="registerForm.email"
          class="form-input"
          type="email"
          placeholder="请输入邮箱"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="registerForm.password"
          class="form-input"
          type="password"
          placeholder="请设置密码"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input
          id="confirmPassword"
          v-model="registerForm.confirmPassword"
          class="form-input"
          type="password"
          placeholder="请再次输入密码"
        />
      </div>
      <button 
        class="btn btn-primary" 
        :disabled="isLoading"
        type="submit"
      >
        <span v-if="isLoading">注册中...</span>
        <span v-else>注册</span>
      </button>
      <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

const { registerForm, isLoading, errorMsg, register } = useAuth();
</script>

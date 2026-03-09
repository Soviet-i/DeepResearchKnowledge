<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="loginForm.username"
          class="form-input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="loginForm.password"
          class="form-input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="loginForm.rememberMe"
            class="form-checkbox"
            type="checkbox"
          />
          记住我
        </label>
      </div>
      <button 
        class="btn btn-primary" 
        :disabled="isLoading"
        type="submit"
      >
        <span v-if="isLoading">登录中...</span>
        <span v-else>登录</span>
      </button>
      <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

const { loginForm, isLoading, errorMsg, login } = useAuth();
</script>

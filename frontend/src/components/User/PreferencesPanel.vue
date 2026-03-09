<template>
  <div class="preferences-panel">
    <h3 class="panel-title">偏好设置</h3>
    
    <div class="preference-item">
      <label class="label">主题</label>
      <select 
        v-model="preferences.theme" 
        class="form-select"
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
        <option value="auto">跟随系统</option>
      </select>
    </div>

    <div class="preference-item">
      <label class="label">语言</label>
      <select 
        v-model="preferences.language" 
        class="form-select"
      >
        <option value="zh-CN">中文</option>
        <option value="en-US">英文</option>
      </select>
    </div>

    <div class="preference-item">
      <label class="checkbox-label">
        <input
          v-model="preferences.notify"
          class="form-checkbox"
          type="checkbox"
        />
        开启消息通知
      </label>
    </div>

    <div class="preference-item">
      <label class="checkbox-label">
        <input
          v-model="preferences.compactMode"
          class="form-checkbox"
          type="checkbox"
        />
        紧凑模式
      </label>
    </div>

    <button 
      class="btn btn-primary mt-4"
      :disabled="isSaving"
      @click="savePreferences"
    >
      <span v-if="isSaving">保存中...</span>
      <span v-else>保存设置</span>
    </button>
    <div v-if="saveMsg" class="msg-text">{{ saveMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { useUserPreferences } from '@/composables/useUserPreferences';

const { preferences, isSaving, saveMsg, savePreferences } = useUserPreferences();
</script>

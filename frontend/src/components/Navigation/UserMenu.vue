<template>
  <div class="user-menu">
    <div class="menu-trigger" @click="toggleMenu">
      <img 
        :src="user.avatar || '/default-avatar.png'" 
        class="user-avatar"
        alt="用户头像"
      />
      <span class="user-name">{{ user.nickname || user.username }}</span>
      <i class="menu-icon" :class="{ 'icon-up': isMenuOpen, 'icon-down': !isMenuOpen }"></i>
    </div>

    <div v-if="isMenuOpen" class="menu-dropdown">
      <router-link 
        to="/user/profile" 
        class="menu-item"
        @click="closeMenu"
      >
        个人资料
      </router-link>
      <router-link 
        to="/user/preferences" 
        class="menu-item"
        @click="closeMenu"
      >
        偏好设置
      </router-link>
      <router-link 
        to="/user/history" 
        class="menu-item"
        @click="closeMenu"
      >
        操作历史
      </router-link>
      <div 
        class="menu-item menu-item-danger"
        @click="handleLogout"
      >
        退出登录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '@/composables/useAuth';

const authStore = useAuthStore();
const { logout } = useAuth();
const isMenuOpen = ref(false);

// 获取当前用户信息
const user = ref(authStore.user);

// 切换菜单显示
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false;
};

// 退出登录
const handleLogout = async () => {
  closeMenu();
  await logout();
};

// 点击外部关闭菜单
document.addEventListener('click', (e) => {
  const menuEl = document.querySelector('.user-menu');
  if (menuEl && !menuEl.contains(e.target as Node)) {
    isMenuOpen.value = false;
  }
});
</script>

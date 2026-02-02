<template>
  <div class="user-profile">
    <h3 class="profile-title">个人资料</h3>
    <div class="profile-avatar">
      <img 
        :src="profile.avatar || '/default-avatar.png'" 
        class="avatar-img"
        alt="头像"
      />
      <button class="btn btn-sm btn-outline-primary" @click="triggerAvatarUpload">
        更换头像
      </button>
      <input
        ref="avatarInput"
        type="file"
        accept="image/*"
        class="avatar-upload"
        @change="uploadAvatar"
        hidden
      />
    </div>

    <div class="profile-form">
      <div class="form-group">
        <label class="label">用户名</label>
        <input
          v-model="profile.username"
          class="form-input"
          type="text"
          disabled
        />
      </div>
      <div class="form-group">
        <label class="label">邮箱</label>
        <input
          v-model="profile.email"
          class="form-input"
          type="email"
        />
      </div>
      <div class="form-group">
        <label class="label">昵称</label>
        <input
          v-model="profile.nickname"
          class="form-input"
          type="text"
        />
      </div>
      <div class="form-group">
        <label class="label">手机号</label>
        <input
          v-model="profile.phone"
          class="form-input"
          type="tel"
        />
      </div>
    </div>

    <button 
      class="btn btn-primary mt-4"
      :disabled="isSaving"
      @click="saveProfile"
    >
      <span v-if="isSaving">保存中...</span>
      <span v-else>保存资料</span>
    </button>
    <div v-if="saveMsg" class="msg-text">{{ saveMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const profile = ref({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  avatar: ''
});
const avatarInput = ref<HTMLInputElement>(null);
const isSaving = ref(false);
const saveMsg = ref('');

// 获取用户资料
const fetchProfile = async () => {
  try {
    const response = await axios.get('/user/profile');
    profile.value = response.data;
  } catch (err) {
    console.error('获取用户资料失败', err);
  }
};

// 保存用户资料
const saveProfile = async () => {
  isSaving.value = true;
  saveMsg.value = '';
  try {
    await axios.put('/user/profile', {
      email: profile.value.email,
      nickname: profile.value.nickname,
      phone: profile.value.phone
    });
    saveMsg.value = '保存成功！';
    // 更新状态管理中的用户信息
    authStore.updateUser(profile.value);
  } catch (err) {
    saveMsg.value = '保存失败，请稍后重试';
    console.error('保存资料失败', err);
  } finally {
    isSaving.value = false;
  }
};

// 触发头像上传
const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

// 上传头像
const uploadAvatar = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);
  try {
    const response = await axios.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    profile.value.avatar = response.data.avatarUrl;
    authStore.updateUser({ avatar: response.data.avatarUrl });
    alert('头像上传成功');
  } catch (err) {
    console.error('上传头像失败', err);
    alert('头像上传失败');
  }
  // 清空input
  target.value = '';
};

onMounted(() => {
  fetchProfile();
});
</script>

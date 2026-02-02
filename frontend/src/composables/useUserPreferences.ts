import { ref, watch } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import axios from 'axios';

export function useUserPreferences() {
  const preferencesStore = useUserPreferencesStore();
  const preferences = ref({
    theme: preferencesStore.theme || 'light',
    language: preferencesStore.language || 'zh-CN',
    notify: preferencesStore.notify || true,
    compactMode: preferencesStore.compactMode || false
  });
  const isSaving = ref(false);
  const saveMsg = ref('');

  // 保存偏好设置
  const savePreferences = async () => {
    isSaving.value = true;
    saveMsg.value = '';
    try {
      await axios.put('/user/preferences', preferences.value);
      // 更新状态管理
      preferencesStore.setPreferences(preferences.value);
      saveMsg.value = '保存成功！';
    } catch (err) {
      saveMsg.value = '保存失败，请稍后重试';
      console.error('保存偏好失败', err);
    } finally {
      isSaving.value = false;
    }
  };

  // 监听状态变化，同步到本地
  watch(
    () => preferencesStore.preferences,
    (newVal) => {
      preferences.value = { ...newVal };
    },
    { immediate: true }
  );

  return {
    preferences,
    isSaving,
    saveMsg,
    savePreferences
  };
}

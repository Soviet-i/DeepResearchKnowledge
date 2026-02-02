import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 状态管理（仅调用，不实现）
import axios from 'axios';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const loginForm = ref({
    username: '',
    password: '',
    rememberMe: false
  });
  const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const isLoading = ref(false);
  const errorMsg = ref('');

  // 登录逻辑
  const login = async () => {
    if (!loginForm.value.username || !loginForm.value.password) {
      errorMsg.value = '请输入用户名和密码';
      return;
    }
    isLoading.value = true;
    errorMsg.value = '';
    try {
      const response = await axios.post('/auth/login', {
        username: loginForm.value.username,
        password: loginForm.value.password,
        rememberMe: loginForm.value.rememberMe
      });
      // 存入状态管理
      authStore.setUser(response.data.user);
      authStore.setToken(response.data.token);
      // 跳转首页
      router.push('/dashboard');
    } catch (err) {
      errorMsg.value = err.response?.data?.message || '登录失败，请检查账号密码';
    } finally {
      isLoading.value = false;
    }
  };

  // 注册逻辑
  const register = async () => {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      errorMsg.value = '两次密码输入不一致';
      return;
    }
    isLoading.value = true;
    errorMsg.value = '';
    try {
      await axios.post('/auth/register', {
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password
      });
      // 注册成功后跳转登录页
      router.push('/login?registered=true');
    } catch (err) {
      errorMsg.value = err.response?.data?.message || '注册失败，请稍后重试';
    } finally {
      isLoading.value = false;
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('登出请求失败', err);
    } finally {
      authStore.clearUser();
      authStore.clearToken();
      router.push('/login');
    }
  };

  // 检查登录状态
  const isAuthenticated = computed(() => authStore.isLoggedIn);

  return {
    loginForm,
    registerForm,
    isLoading,
    errorMsg,
    login,
    register,
    logout,
    isAuthenticated
  };
}

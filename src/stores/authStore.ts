import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  
  // 登录方法
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟成功登录
      user.value = { id: '1', email, username: '测试用户' }
      token.value = 'fake-jwt-token'
      localStorage.setItem('token', token.value)
      
      return { success: true }
    } catch (err) {
      error.value = '登录失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }
  
  // 登出方法
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }
  
  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout
  }
})
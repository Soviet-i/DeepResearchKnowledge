import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000
})

// 请求拦截器
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 导出常用方法
export const get = (url: string, config?: any) => 
  apiClient.get(url, config).then(res => res.data)

export const post = (url: string, data?: any, config?: any) =>
  apiClient.post(url, data, config).then(res => res.data)

export const put = (url: string, data?: any, config?: any) =>
  apiClient.put(url, data, config).then(res => res.data)

export const del = (url: string, config?: any) =>
  apiClient.delete(url, config).then(res => res.data)

export default apiClient
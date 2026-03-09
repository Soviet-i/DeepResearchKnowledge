// 基础类型定义
export interface User {
  id: string
  email: string
  username?: string
  avatar?: string
}

export interface ResearchRequest {
  question: string
  options?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

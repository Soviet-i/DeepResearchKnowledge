// API服务文件，用于与后端服务通信

// 定义基础API URL
const API_BASE_URL = '/api';

// 文献数据类型
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  source: string;
  abstract: string;
  relevanceScore: number;
  type: 'journal' | 'conference' | 'book' | 'article';
}

// 报告生成请求参数
export interface GenerateReportParams {
  query: string;
  papers: ResearchPaper[];
  reportType: 'summary' | 'detailed' | 'comparative';
}

// 搜索请求参数
export interface SearchParams {
  query: string;
  filters?: {
    type?: string;
    publicationYear?: number | number[];
    author?: string;
    source?: string;
  };
  sortBy?: 'relevance' | 'publicationYear' | 'citationCount';
  page?: number;
  pageSize?: number;
}

// 搜索结果响应
export interface SearchResults {
  results: ResearchPaper[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    type: Array<{ value: string; count: number }>;
    publicationYear: Array<{ value: number; count: number }>;
    authors: Array<{ value: string; count: number }>;
    sources: Array<{ value: string; count: number }>;
  };
}

// 用户认证信息
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 认证响应
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    preferences?: {
      theme?: 'light' | 'dark' | 'auto';
      language?: string;
      notifications?: boolean;
    };
  };
}

// 生成研究报告的函数
export async function generateResearchReport(params: GenerateReportParams): Promise<string> {
  try {
  // 调用后端API生成研究报告
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(params)
  });
  
  if (!response.ok) {
    // 详细处理API错误
    try {
      const errorData = await response.json();
      throw new Error(`API调用失败: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 如果响应不是有效的JSON
      throw new Error(`API调用失败: ${response.statusText || '未知错误'}`);
    }
  }
  
  try {
    const data = await response.json();
    // 确保返回数据格式正确
    if (!data.reportContent) {
      throw new Error('API返回的数据格式不正确');
    }
    return data.reportContent;
  } catch (jsonError) {
    throw new Error('解析API响应失败');
  }

  } catch (error) {
    console.error('生成报告时出错:', error);
    throw error;
  }
}

// 搜索文献函数
export async function searchPapers(params: SearchParams): Promise<SearchResults> {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('query', params.query);
    
    if (params.filters) {
      if (params.filters.type) queryParams.append('type', params.filters.type);
      if (params.filters.publicationYear) {
        if (Array.isArray(params.filters.publicationYear)) {
          params.filters.publicationYear.forEach(year => 
            queryParams.append('year', year.toString())
          );
        } else {
          queryParams.append('year', params.filters.publicationYear.toString());
        }
      }
      if (params.filters.author) queryParams.append('author', params.filters.author);
      if (params.filters.source) queryParams.append('source', params.filters.source);
    }
    
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
  // 调用后端API搜索文献
  const response = await fetch(`${API_BASE_URL}/papers/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(`搜索失败: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 如果响应不是有效的JSON
      throw new Error(`搜索失败: ${response.statusText || '未知错误'}`);
    }
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (jsonError) {
    throw new Error('解析搜索结果失败');
  }
    
  } catch (error) {
    console.error('搜索文献时出错:', error);
    throw error;
  }
}

// 用户登录函数
export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(`登录失败: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 如果响应不是有效的JSON
      throw new Error(`登录失败: ${response.statusText || '未知错误'}`);
    }
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (jsonError) {
    throw new Error('解析登录响应失败');
  }
    

  } catch (error) {
    console.error('登录时出错:', error);
    throw error;
  }
}

// 用户登出函数
export function logout(): void {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
}

// 获取认证令牌辅助函数
function getAuthToken(): string {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
}

// 检查用户是否已认证
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
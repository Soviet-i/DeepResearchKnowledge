// API鏈嶅姟鏂囦欢锛岀敤浜庝笌鍚庣鏈嶅姟閫氫俊

// 瀹氫箟鍩虹API URL
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = envApiBaseUrl
  ? envApiBaseUrl.replace(/\/+$/, '')
  : import.meta.env.DEV
    ? 'http://localhost:3001/api'
    : '/api';

// 鏂囩尞鏁版嵁绫诲瀷
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  source: string;
  abstract: string;
  relevanceScore: number;
  type: 'journal' | 'conference' | 'book' | 'article';
  detailUrl?: string;
}

// 鎶ュ憡鐢熸垚璇锋眰鍙傛暟
export interface GenerateReportParams {
  query: string;
  papers: ResearchPaper[];
  reportType: 'summary' | 'detailed' | 'comparative';
}

// 鎼滅储璇锋眰鍙傛暟
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

// 鎼滅储缁撴灉鍝嶅簲
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

// 鐢ㄦ埛璁よ瘉淇℃伅
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 璁よ瘉鍝嶅簲
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

// 鐢熸垚鐮旂┒鎶ュ憡鐨勫嚱鏁?
export async function generateResearchReport(params: GenerateReportParams): Promise<string> {
  try {
  // 璋冪敤鍚庣API鐢熸垚鐮旂┒鎶ュ憡
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(params)
  });
  
  if (!response.ok) {
    // 璇︾粏澶勭悊API閿欒
    try {
      const errorData = await response.json();
      throw new Error(`API璋冪敤澶辫触: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 濡傛灉鍝嶅簲涓嶆槸鏈夋晥鐨凧SON
      throw new Error(`API璋冪敤澶辫触: ${response.statusText || '鏈煡閿欒'}`);
    }
  }
  
  try {
    const data = await response.json();
    // 纭繚杩斿洖鏁版嵁鏍煎紡姝ｇ‘
    if (!data.reportContent) {
      throw new Error('API杩斿洖鐨勬暟鎹牸寮忎笉姝ｇ‘');
    }
    return data.reportContent;
  } catch (jsonError) {
    throw new Error('瑙ｆ瀽API鍝嶅簲澶辫触');
  }

  } catch (error) {
    console.error('鐢熸垚鎶ュ憡鏃跺嚭閿?', error);
    throw error;
  }
}

// 鎼滅储鏂囩尞鍑芥暟
export async function searchPapers(params: SearchParams): Promise<SearchResults> {
  try {
    // 鏋勫缓鏌ヨ鍙傛暟
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
    
  // 璋冪敤鍚庣API鎼滅储鏂囩尞
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
      throw new Error(`鎼滅储澶辫触: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 濡傛灉鍝嶅簲涓嶆槸鏈夋晥鐨凧SON
      throw new Error(`鎼滅储澶辫触: ${response.statusText || '鏈煡閿欒'}`);
    }
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (jsonError) {
    throw new Error('瑙ｆ瀽鎼滅储缁撴灉澶辫触');
  }
    
  } catch (error) {
    console.error('鎼滅储鏂囩尞鏃跺嚭閿?', error);
    throw error;
  }
}

// 鐢ㄦ埛鐧诲綍鍑芥暟
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
      throw new Error(`鐧诲綍澶辫触: ${errorData.message || response.statusText}`);
    } catch (jsonError) {
      // 濡傛灉鍝嶅簲涓嶆槸鏈夋晥鐨凧SON
      throw new Error(`鐧诲綍澶辫触: ${response.statusText || '鏈煡閿欒'}`);
    }
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (jsonError) {
    throw new Error('瑙ｆ瀽鐧诲綍鍝嶅簲澶辫触');
  }
    

  } catch (error) {
    console.error('鐧诲綍鏃跺嚭閿?', error);
    throw error;
  }
}

// 鐢ㄦ埛鐧诲嚭鍑芥暟
export function logout(): void {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  sessionStorage.removeItem('authUser');
  localStorage.removeItem('userEmail');
}

// 鑾峰彇璁よ瘉浠ょ墝杈呭姪鍑芥暟
function getAuthToken(): string {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
}

// 妫€鏌ョ敤鎴锋槸鍚﹀凡璁よ瘉
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

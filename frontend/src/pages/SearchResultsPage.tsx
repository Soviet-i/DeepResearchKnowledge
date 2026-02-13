import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// 定义搜索结果类型
interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  source: string;
  abstract: string;
  relevanceScore: number;
  type: 'journal' | 'conference' | 'book' | 'article';
}

// Mock搜索结果数据
const generateMockSearchResults = (query: string): SearchResult[] => {
  const types = ['journal', 'conference', 'book', 'article'] as const;
  const sources = ['Nature', 'Science', 'IEEE', 'Springer', 'ACM', 'Elsevier'];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `result-${i + 1}`,
    title: `${query}研究：${i + 1}种新方法与应用案例分析`,
    authors: [`作者${i + 1}-1`, `作者${i + 1}-2`, `作者${i + 1}-3`],
    publicationYear: 2023 - Math.floor(Math.random() * 5),
    source: sources[Math.floor(Math.random() * sources.length)],
    abstract: `本文深入探讨了${query}在多个领域的应用，包括理论基础、实践方法和最新进展。研究发现，通过创新的方法论和技术手段，可以显著提升${query}的应用效果和社会价值。本文还提出了未来研究方向和潜在的应用场景。`,
    relevanceScore: Math.floor(Math.random() * 40) + 60, // 60-100的相关度
    type: types[Math.floor(Math.random() * types.length)],
  }));
};

// 统计数据
const generateStatsData = () => {
  return [
    { name: '期刊论文', value: 45 },
    { name: '会议论文', value: 25 },
    { name: '书籍', value: 15 },
    { name: '其他文章', value: 15 },
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'year'>('relevance');
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());
  const statsData = generateStatsData();

  // 模拟搜索请求
  useEffect(() => {
    if (query) {
      setLoading(true);
      
      // 模拟网络延迟
      setTimeout(() => {
        const mockResults = generateMockSearchResults(query);
        
        // 根据排序方式排序
        const sortedResults = [...mockResults].sort((a, b) => {
          if (sortBy === 'relevance') {
            return b.relevanceScore - a.relevanceScore;
          } else {
            return b.publicationYear - a.publicationYear;
          }
        });
        
        setResults(sortedResults);
        setLoading(false);
      }, 1200);
    }
  }, [query, sortBy]);

  // 应用筛选
  const filteredResults = activeFilter 
    ? results.filter(result => result.type === activeFilter) 
    : results;

  // 格式化作者列表
  const formatAuthors = (authors: string[]) => {
    return authors.join(', ');
  };

  // 获取类型的中文名称
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'journal': '期刊论文',
      'conference': '会议论文',
      'book': '书籍',
      'article': '其他文章'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">搜索结果</h1>
          <p className="text-gray-600">为 "{query}" 找到 {results.length} 条结果</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧筛选面板 */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">筛选条件</h2>
              
              {/* 排序选项 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">排序方式</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sortBy"
                      value="relevance"
                      checked={sortBy === 'relevance'}
                      onChange={() => setSortBy('relevance')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">相关度</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sortBy"
                      value="year"
                      checked={sortBy === 'year'}
                      onChange={() => setSortBy('year')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">出版年份</span>
                  </label>
                </div>
              </div>
              
              {/* 文献类型筛选 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">文献类型</h3>
                <div className="space-y-2">
                  {['journal', 'conference', 'book', 'article'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilter === type}
                        onChange={() => setActiveFilter(activeFilter === type ? null : type)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{getTypeLabel(type)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 统计图表 */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">文献类型分布</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={statsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {statsData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center text-xs">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧搜索结果列表 */}
          <div className="w-full md:w-3/4">
            {loading ? (
              // 加载状态
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </motion.div>
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              // 搜索结果列表
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {filteredResults.map((result) => (
                    <motion.div
                      key={result.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                       <div className="flex justify-between items-start mb-2">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedPapers.has(result.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedPapers);
                              if (e.target.checked) {
                                newSelected.add(result.id);
                              } else {
                                newSelected.delete(result.id);
                              }
                              setSelectedPapers(newSelected);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-2"
                          />
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {result.title}
                          </h3>
                        </label>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                       <p className="text-sm font-medium text-gray-700 mb-3 pl-6">
                         作者: {formatAuthors(result.authors)}
                       </p>
                       <p className="text-sm text-gray-600 mb-3 pl-6">
                         {result.publicationYear} · {result.source}
                       </p>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3 pl-6">{result.abstract}</p>
                      
                      <div className="flex justify-between items-center pl-6">
                        <div className="flex space-x-3">
                          <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                            查看详情
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                            引用
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">相关度: {result.relevanceScore}%</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // 无结果状态
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到结果</h3>
                <p className="text-gray-600 mb-4">尝试使用不同的关键词或调整筛选条件</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  清除筛选条件
                </button>
              </div>
            )}
            
            {/* 分页控件 */}
            {!loading && filteredResults.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        page === 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors">
                    ...
                  </button>
                  <button className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors">
                    下一页
                  </button>
                </nav>
              </div>
             )}
          </div>
        </div>
      </div>
      
       {/* 生成报告按钮 */}
      {!loading && results.length > 0 && selectedPapers.size > 0 && (
        <motion.div 
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
            <p className="text-sm text-gray-700 mb-3">已选择 {selectedPapers.size} 篇文献</p>
            <div className="space-y-2">
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                onClick={() => {
                  try {
                    // 保存选中的文献到localStorage
                    const selectedPapersData = results.filter(paper => selectedPapers.has(paper.id));
                    localStorage.setItem('selectedPapers', JSON.stringify(selectedPapersData));
                    // 跳转到报告生成页面
                    window.location.href = `/report?query=${encodeURIComponent(query)}&reportType=summary`;
                  } catch (error) {
                    console.error('保存选中的文献失败:', error);
                    alert('保存选中的文献失败，请稍后重试');
                  }
                }}
              >
                <i className="fas fa-file-alt mr-2"></i> 生成综述报告
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
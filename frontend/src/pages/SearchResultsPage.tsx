import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { searchPapers } from '../lib/api';

interface SearchResult {
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PAGE_SIZE = 10;

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const [queryInput, setQueryInput] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'year'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState('');
  const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedPapers(new Set());
  }, [query, sortBy, activeFilter]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const filters = activeFilter ? { type: activeFilter } : undefined;

    searchPapers({
      query,
      filters,
      sortBy: sortBy === 'relevance' ? 'relevance' : 'publicationYear',
      page: currentPage,
      pageSize: PAGE_SIZE,
    })
      .then((data) => {
        setResults(data.results || []);
        setTotalResults(data.total || 0);

        const pageCount = Math.max(1, Math.ceil((data.total || 0) / PAGE_SIZE));
        if (currentPage > pageCount) {
          setCurrentPage(pageCount);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message || '搜索失败，请稍后重试');
        setResults([]);
        setTotalResults(0);
      })
      .finally(() => setLoading(false));
  }, [query, sortBy, activeFilter, currentPage]);

  const pageWindowStart = useMemo(() => {
    return Math.floor((currentPage - 1) / 3) * 3 + 1;
  }, [currentPage]);

  const pageNumbers = useMemo(() => {
    const end = Math.min(pageWindowStart + 2, totalPages);
    const list: number[] = [];
    for (let p = pageWindowStart; p <= end; p += 1) {
      list.push(p);
    }
    return list;
  }, [pageWindowStart, totalPages]);

  const hasMoreBlocks = pageNumbers[pageNumbers.length - 1] < totalPages;
  const hasPrevBlocks = pageWindowStart > 1;

  const statsData = [
    { name: '期刊论文', value: 45 },
    { name: '会议论文', value: 25 },
    { name: '书籍', value: 15 },
    { name: '其他文章', value: 15 },
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      journal: '期刊论文',
      conference: '会议论文',
      book: '书籍',
      article: '其他文章',
    };
    return labels[type] || type;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextQuery = queryInput.trim();
    if (!nextQuery) return;
    navigate(`/search?query=${encodeURIComponent(nextQuery)}`);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number.parseInt(jumpPageInput, 10);
    if (!Number.isFinite(page)) return;
    const target = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(target);
    setJumpPageInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">搜索结果</h1>
            <p className="text-gray-600">
              为 "{query}" 找到 {totalResults} 条结果（第 {currentPage}/{totalPages} 页）
            </p>
          </div>
          <div className="w-full md:w-3/4">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex shadow-md rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="输入关键词重新搜索"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  搜索
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">筛选条件</h2>

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

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">文献类型分布</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={statsData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {loading ? (
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
                  </motion.div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <AnimatePresence>
                  {results.map((result) => (
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
                              const next = new Set(selectedPapers);
                              if (e.target.checked) next.add(result.id);
                              else next.delete(result.id);
                              setSelectedPapers(next);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-2"
                          />
                          <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                        </label>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-2 pl-6">作者: {result.authors.join(', ')}</p>
                      <p className="text-sm text-gray-600 mb-3 pl-6">{result.publicationYear} · {result.source}</p>
                      <p className="text-gray-700 mb-3 pl-6 line-clamp-3">{result.abstract}</p>
                      <div className="flex items-center justify-between pl-6">
                        <a
                          href={result.detailUrl || `https://scholar.google.com/scholar?q=${encodeURIComponent(result.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          查看原文详情
                        </a>
                        <div className="text-xs text-gray-500">相关度: {result.relevanceScore}%</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">当前页无结果</h3>
                <p className="text-gray-600">你可以直接翻页或在上方搜索框更换关键词</p>
              </div>
            )}

            {!loading && totalResults > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <nav className="flex items-center space-x-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      首页
                    </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  {hasPrevBlocks && (
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 3))}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      ...
                    </button>
                  )}
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
                  {hasMoreBlocks && (
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 3))}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      ...
                    </button>
                  )}
                  {hasMoreBlocks && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        totalPages === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    末页
                  </button>
                  </nav>
                  <form onSubmit={handleJumpPage} className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">跳转</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!loading && results.length > 0 && selectedPapers.size > 0 && (
        <motion.div className="fixed bottom-6 right-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
            <p className="text-sm text-gray-700 mb-3">已选择 {selectedPapers.size} 篇文献</p>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={() => {
                const selectedPapersData = results.filter((paper) => selectedPapers.has(paper.id));
                localStorage.setItem('selectedPapers', JSON.stringify(selectedPapersData));
                window.location.href = `/report?query=${encodeURIComponent(query)}&reportType=summary`;
              }}
            >
              生成综述报告
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

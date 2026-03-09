import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-16 flex flex-col justify-between">
        <div className="text-center py-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Deep Research
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            深度研究助手，帮助您快速获取学术文献和研究资料
          </motion.p>
        </div>
        
        {/* 搜索框区域 */}
        <div className="mb-12 w-full max-w-3xl mx-auto">
          <motion.div 
            className="flex shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="输入关键词搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              onClick={handleSearch}
            >
              搜索
            </button>
          </motion.div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-500">需要个性化您的体验？</p>
            <Link to="/preferences" className="mt-2 inline-block text-blue-600 hover:text-blue-800 transition-colors">
              前往偏好设置
            </Link>
          </div>
          
          {/* 热门搜索推荐 */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-600 mb-3 text-left">热门搜索：</h3>
            <div className="flex flex-wrap gap-2">
              {['人工智能', '气候变化', '区块链应用', '基因编辑', '量子计算'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/search?query=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
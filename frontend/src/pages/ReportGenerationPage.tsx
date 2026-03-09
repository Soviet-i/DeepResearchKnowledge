import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateResearchReport, type ResearchPaper } from '../lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function ReportGenerationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  
  // 选中的参考文献数据
  const [selectedReferences, setSelectedReferences] = useState<Array<{
    id: string;
    title: string;
    authors: string[];
    year: number;
    source: string;
    type: string;
  }>>([]);
  
  // 图片数据
  const [imagesData, setImagesData] = useState<Array<{
    id: string;
    title: string;
    caption: string;
    source: string;
    size: string;
    thumbnailSize: string;
    imageUrl: string;
    linkUrl: string;
  }>>([]);

  // 从URL参数中获取数据
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '人工智能在医学影像分析中的应用';
    const reportType = searchParams.get('reportType') as 'summary' | 'detailed' | 'comparative' || 'summary';
    
    // 设置搜索查询和报告标题
    setSearchQuery(query);
    
    // 根据查询词和报告类型生成合适的报告标题
    let title = '';
    switch(reportType) {
      case 'summary':
        title = `${query}研究综述`;
        break;
      case 'detailed':
        title = `${query}详细研究报告`;
        break;
      case 'comparative':
        title = `${query}文献对比分析`;
        break;
      default:
        title = `${query}研究报告`;
    }
    setReportTitle(title);
    
    // 从localStorage获取选中的文献
    const selectedPapersJson = localStorage.getItem('selectedPapers');
    
    try {
      let selectedPapers: ResearchPaper[] = [];
      
      // 安全地解析localStorage数据
      if (selectedPapersJson) {
        try {
          selectedPapers = JSON.parse(selectedPapersJson);
          // 验证解析后的数据格式
          if (!Array.isArray(selectedPapers)) {
            console.warn('选中的文献数据格式不正确，使用默认数据');
            selectedPapers = [];
          }
        } catch (parseError) {
          console.error('解析选中的文献数据失败:', parseError);
          setError('解析选中的文献数据失败');
          setLoading(false);
          return;
        }
      }
      
      // 转换选中的文献为参考文献格式
      const referencesFromSelectedPapers = selectedPapers.map((paper, index) => ({
        id: `ref-${index + 1}`,
        title: paper.title,
        authors: paper.authors,
        year: paper.publicationYear,
        source: paper.source,
        type: paper.type
      }));
      
      // 如果没有选中的文献，使用默认参考文献
      const referencesToUse = referencesFromSelectedPapers.length > 0 
        ? referencesFromSelectedPapers 
        : [
            {
              id: 'ref-1',
              title: '默认参考文献示例',
              authors: ['示例作者'],
              year: 2024,
              source: '示例期刊',
              type: 'journal'
            }
          ];
      
      // 设置选中的参考文献
      setSelectedReferences(referencesToUse);
      
      // 生成与查询相关的图片数据
      const generateImages = (query: string) => {
        // 移除查询中的特殊字符，用于生成图片URL
        const cleanQuery = encodeURIComponent(query.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ''));
        
        // 生成与查询相关的图片数据
        const queryImages = [
          {
            id: 'img-1',
            title: `${query}概念示意图`,
            caption: `图1 ${query}基本概念示意图`,
            source: '网络搜索图片',
            size: '2.5 MB',
            thumbnailSize: '300 KB',
            imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Research%20illustration%20of%20artificial%20intelligence%20applications&sign=452ea7dee18187245f3bc6c668bd4a54",
            linkUrl: "#image-1"
          },
          {
            id: 'img-2',
            title: `${query}研究方法流程图`,
            caption: `图2 ${query}研究方法论流程`,
            source: '网络搜索图片',
            size: '1.8 MB',
            thumbnailSize: '220 KB',
            imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Flowchart%20of%20research%20methodology%20for%20AI%20in%20medical%20applications&sign=6945042578afd083681c6e9d7184a38e",
            linkUrl: "#image-2"
          },
          {
            id: 'img-3',
            title: `${query}数据分析结果可视化`,
            caption: `图3 ${query}关键数据结果展示`,
            source: '网络搜索图片',
            size: '2.2 MB',
            thumbnailSize: '280 KB',
            imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Data%20visualization%20of%20AI%20research%20findings&sign=1b40dff9791c022ae58ecb0245baf52c",
            linkUrl: "#image-3"
          }
        ];
        
        return queryImages;
      };
      
      // 设置图片数据
      const imagesToUse = generateImages(query);
      setImagesData(imagesToUse);
      
      // 模拟进度条动画
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return newProgress;
        });
      }, 300);
      
      // 生成报告
      generateResearchReport({ query, papers: selectedPapers, reportType })
        .then(result => {
          setReport(result);
          setProgress(100);
          setLoading(false);
        })
        .catch(err => {
          console.error('生成报告时出错:', err);
          // 提供更具体的错误信息
          setError(err.message || '生成报告时出错，请稍后重试');
          setLoading(false);
          clearInterval(progressInterval);
        });
    } catch (err) {
      console.error('处理报告生成请求时出错:', err);
      setError('处理请求时发生错误');
      setLoading(false);
    }
  }, [location.search]);

  // 将Markdown格式的报告转换为HTML显示，并插入图片
  const renderReport = (content: string) => {
    // 简单的Markdown解析
    let htmlContent = content
      .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold mb-4 text-gray-800">$1</h1>')
      .replace(/## (.*?)\n/g, '<h2 class="text-xl font-semibold mb-3 text-gray-700">$1</h2>')
      .replace(/### (.*?)\n/g, '<h3 class="text-lg font-medium mb-2 text-gray-700">$1</h3>')
      .replace(/\n\n/g, '<p class="mb-4 text-gray-600"></p>')
      .replace(/\n/g, '<br>')
      .replace(/\* (.*?)\n/g, '<li class="list-disc pl-5 mb-1 text-gray-600">$1</li>');
    
    // 在报告中插入图片
    // 查找第一个二级标题后的位置插入第一张图片
    if (imagesData.length > 0) {
      const firstImageInsertPoint = htmlContent.indexOf('</h2>');
      if (firstImageInsertPoint !== -1) {
        const firstImage = `
          <div id="image-1" class="my-6">
            <figure class="flex flex-col items-center">
              <img 
                src="${imagesData[0].imageUrl}" 
                alt="${imagesData[0].title}" 
                class="max-w-full h-auto rounded-lg shadow-md"
              />
              <figcaption class="mt-2 text-sm text-gray-500 text-center">${imagesData[0].caption}</figcaption>
            </figure>
          </div>
        `;
        htmlContent = htmlContent.slice(0, firstImageInsertPoint + 5) + firstImage + htmlContent.slice(firstImageInsertPoint + 5);
      }
      
      // 在报告中间插入第二张图片（如果有）
      if (imagesData.length > 1) {
        const middlePoint = Math.floor(htmlContent.length / 2);
        const secondImage = `
          <div id="image-2" class="my-6">
            <figure class="flex flex-col items-center">
              <img 
                src="${imagesData[1].imageUrl}" 
                alt="${imagesData[1].title}" 
                class="max-w-full h-auto rounded-lg shadow-md"
              />
              <figcaption class="mt-2 text-sm text-gray-500 text-center">${imagesData[1].caption}</figcaption>
            </figure>
          </div>
        `;
        htmlContent = htmlContent.slice(0, middlePoint) + secondImage + htmlContent.slice(middlePoint);
      }
      
      // 在结论部分前插入第三张图片（如果有）
      if (imagesData.length > 2) {
        const conclusionPoint = htmlContent.toLowerCase().indexOf('结论');
        if (conclusionPoint !== -1) {
          const thirdImage = `
            <div id="image-3" class="my-6">
              <figure class="flex flex-col items-center">
                <img 
                  src="${imagesData[2].imageUrl}" 
                  alt="${imagesData[2].title}" 
                  class="max-w-full h-auto rounded-lg shadow-md"
                />
                <figcaption class="mt-2 text-sm text-gray-500 text-center">${imagesData[2].caption}</figcaption>
              </figure>
            </div>
          `;
          htmlContent = htmlContent.slice(0, conclusionPoint) + thirdImage + htmlContent.slice(conclusionPoint);
        }
      }
    }
    
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // 下载报告为文本文件
  const downloadReport = () => {
    try {
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')}_报告.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('报告已下载');
    } catch (error) {
      console.error('下载报告失败:', error);
      toast.error('下载报告失败，请稍后重试');
    }
  };

  // 复制报告内容
  const copyToClipboard = () => {
    navigator.clipboard.writeText(report).then(() => {
      toast.success('已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      toast.error('复制失败，请稍后重试');
    });
  };

  // 重试生成报告
  const retryGeneration = () => {
    setLoading(true);
    setError('');
    setProgress(0);
    // 重新触发useEffect
    const searchParams = new URLSearchParams(location.search);
    const currentQuery = searchParams.get('query') || '';
    const reportType = searchParams.get('reportType') || 'summary';
    navigate(`/report?query=${encodeURIComponent(currentQuery)}&reportType=${reportType}`);
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent, searchValue: string) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  // 获取报告字数
  const getReportWordCount = () => {
    return report ? report.length : 8452; // 使用默认值
  };

  // 获取报告生成时间
  const getReportGenerationTime = () => {
    // 实际应用中应该使用真实的生成时间
    return '2024-01-15 14:30';
  };

  // 打开图片链接
  const openImageLink = (linkUrl: string) => {
    if (linkUrl.startsWith('#')) {
      // 页面内链接，滚动到对应位置
      const element = document.querySelector(linkUrl);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 外部链接，在新标签页打开
      window.open(linkUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* 搜索框 */}
        <div className="mb-6">
          <form onSubmit={(e) => handleSearch(e, searchQuery)}>
            <div className="flex shadow-md rounded-lg overflow-hidden max-w-3xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                搜索
              </button>
            </div>
          </form>
        </div>
        
         {/* 生成文本下载链接 */}
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <i className="fas fa-file-pdf text-red-500 mr-2"></i>
               <span className="text-gray-800">{reportTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')}_完整报告.pdf</span>
             </div>
             <div className="flex items-center space-x-4">
               <span className="text-sm text-gray-500">2.4 MB</span>
               <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                 <i className="fas fa-download mr-1"></i> PDF
               </button>
             </div>
           </div>
         </div>
          
          {/* 主要内容区域 - 三栏布局 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧：选中的参考文献 */}
          <div className="w-full lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">选中的参考文献</h2>
                <span className="text-sm text-gray-500">{selectedReferences.length}篇文献</span>
              </div>
              
              <div className="space-y-4">
                {selectedReferences.length > 0 ? (
                  selectedReferences.map((ref) => (
                    <div key={ref.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="text-sm font-medium text-blue-600 mb-1">{ref.id}</div>
                      <div className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">{ref.title}</div>
                      <div className="text-xs text-gray-600 mb-1 line-clamp-1">{ref.authors.join(', ')}</div>
                      <div className="text-xs text-gray-500">{ref.year} · {ref.source}</div>
                      <div className="flex items-center mt-2 space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                          <i className="fas fa-file-pdf text-red-500 mr-1"></i> PDF
                        </button>
                        <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                          <i className="fas fa-external-link-alt mr-1"></i> DOI
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    暂无选中的文献
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 中间：报告内容 */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {loading ? (
                // 加载状态
                <div className="py-12 flex flex-col items-center">
                  <motion.div 
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <h2 className="text-lg font-medium text-gray-700 mb-4">正在生成研究报告...</h2>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <motion.div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: "0%" }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500">正在分析文献并生成深度见解，请稍候...</p>
                </div>
              ) : error ? (
                // 错误状态
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                  </div>
                  <h2 className="text-lg font-medium text-gray-700 mb-2">生成报告失败</h2>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={retryGeneration}
                    >
                      重试
                    </button>
                    <button 
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => navigate('/')}
                    >
                      返回首页
                    </button>
                  </div>
                </div>
              ) : (
                // 报告内容
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{reportTitle}</h1>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
                    <span className="flex items-center mr-4 mb-2">
                      <i className="far fa-clock mr-1"></i> 生成时间: {getReportGenerationTime()}
                    </span>
                    <span className="flex items-center mr-4 mb-2">
                      <i className="far fa-file-alt mr-1"></i> 字数: {getReportWordCount()}
                    </span>
                    <span className="flex items-center mr-4 mb-2">
                      <i className="fas fa-quote-left mr-1"></i> 引用文献: {selectedReferences.length}篇
                    </span>
                    <div className="flex space-x-2 mb-2">
                      <button 
                        onClick={copyToClipboard}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
                      >
                        <i className="fas fa-copy mr-1"></i> 复制
                      </button>
                      <button 
                        onClick={downloadReport}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <i className="fas fa-download mr-1"></i> 下载
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-gray-700">
                    {renderReport(report)}
                  </div>
                  
                  {/* 报告评价 */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">报告质量评价</h3>
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          className="text-xl text-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                          <i className="fas fa-star"></i>
                        </button>
                      ))}
                      <span className="text-sm text-gray-500 ml-2">帮助我们改进报告质量</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧：图片链接 */}
          <div className="w-full lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">报告图片链接</h2>
                <span className="text-sm text-gray-500">{imagesData.length}张图片</span>
              </div>
              
              <div className="space-y-4">
                {imagesData.length > 0 ? (
                  imagesData.map((img) => (
                    <div key={img.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-50 p-3 border-b border-gray-100">
                        <div className="text-sm text-gray-800 mb-1">{img.title}</div>
                        <div className="text-xs text-gray-600">{img.caption}</div>
                      </div>
                      <div className="p-3 bg-gray-50">
                        <div className="text-xs text-gray-500 mb-2">{img.source}</div>
                        <button 
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                          onClick={() => openImageLink(img.linkUrl)}
                        >
                          <i className="fas fa-external-link-alt mr-1"></i> 查看图片
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    无
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
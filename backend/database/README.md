1.daily_scraper 爬取每日更新的论文
功能：“输入中文关键词（如“人工智能”），
     爬取最近 1 天（可配置）的论文，包括标题、摘要、链接和 PDF 地址
     结果保存为 JSON 文件”
安装依赖：pip install arxiv tqdm python-dotenv openai
使用方法:
    from daily_crawler import DailyCrawler
    crawler = DailyCrawler(query="QUERY")   # QUERY 替换为你的中文关键词
    papers = crawler.main()                 # 返回论文列表，并保存为 JSON 文件
输出示例：[
      {
        "title": "论文标题",
        "summary": "摘要内容",
        "url": "http://arxiv.org/abs/...",
        "pdf_url": "http://arxiv.org/pdf/...",
        "published_date": "2025-03-09"
      },
      ...
    ]



2.topic_scraper 爬取话题相关论文
功能：“输入中文关键词（如“人工智能”）
    获取论文标题、作者、摘要、发表日期、分类等信息 ,根据引用数和发表时间计算综合分数，排序后返回 Top N 论文
    保存元数据为 JSON 文件,可下载 PDF 文件”
安装依赖：pip install paperscraper aiohttp aiofiles requests tqdm python-dotenv openai
使用方法:
        from topic_crawler import TopicCrawler
    
        # 初始化爬虫
        crawler = TopicCrawler(
            keyword="QUERY",        # 中文关键词
            max_results=100,        # 最终保留的论文数量
            save_dir="./topic_papers"  # 保存目录（可选）
        )
    
        # 运行主流程
        crawler.main(
            initial_search=1000,    # 初始搜索论文数量（用于排序筛选）
            citation_weight=0.7,    # 引用数在排序中的权重（0-1）
            download_pdf=True     # 是否下载 PDF（网络问题建议关闭）
        )
输出示例：   arxiv_papers/
            ├── cache.pkl              # 论文元数据缓存
            ├── citations.pkl          # 引用数缓存
            ├── search_results.jsonl   # paperscraper 原始搜索结果
            ├── metadata/
            │   └── papers_metadata.json   # 最终排序后的论文元数据（JSON）
            └── pdfs/                  # 下载的 PDF 文件（如启用下载）
                └── {paper_id}.pdf


3.环境变量
在项目根目录创建 .env 文件，设置API 密钥（用于关键词转换）
API_KEY=your_api_key

代码中使用智谱glm-4.7-flash，如使用其他模型修改api_key， base_url，model等参数
 client = OpenAI(
            api_key=api_key,
            base_url="https://open.bigmodel.cn/api/paas/v4/"
        )
 response = client.chat.completions.create(
                model="glm-4.7-flash",
                messages=full_messages,
                temperature=0.3
            )
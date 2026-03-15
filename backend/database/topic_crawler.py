import json
import time
import os
import pickle
import asyncio
import aiohttp
from datetime import datetime
from pathlib import Path
from typing import List, Dict
from tqdm import tqdm
from openai import OpenAI
from dotenv import load_dotenv


class TopicCrawler:
    """高性能arXiv论文爬虫 - 基于paperscraper库"""

    def __init__(self,
                 keyword: str,
                 save_dir: str = "./topic_papers",
                 max_results: int = 100):
        self.keyword = keyword
        self.save_dir = Path(save_dir)
        self.max_results = max_results
        self.cache_file = self.save_dir / "cache.pkl"
        self.citation_cache_file = self.save_dir / "citations.pkl"
        self.temp_search_file = self.save_dir / "search_results.jsonl"

        # 创建目录结构
        self.papers_dir = self.save_dir / "papers"
        self.pdfs_dir = self.save_dir / "pdfs"
        self.metadata_dir = self.save_dir / "metadata"

        for dir_path in [self.papers_dir, self.pdfs_dir, self.metadata_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

        # 加载缓存
        self.cached_papers = self.load_cache()
        self.citation_cache = self.load_citation_cache()

        # 异步配置
        self.semaphore_limit = 20
        self.batch_size = 500

    # LLM查询转换 - 静态方法（保持不变）
    @staticmethod
    def get_query(user_input: str) -> str:
        """使用智谱GLM-4 API将中文查询转换为paperscraper可用的搜索关键词

        注意：paperscraper会在关键词前自动添加 all: 前缀
        因此只需要返回纯关键词，不要添加任何前缀
        """
        load_dotenv()
        api_key = os.getenv('API_KEY')

        if not api_key:
            print("警告: 未设置API_KEY")
            return user_input

        client = OpenAI(
            api_key=api_key,
            base_url="https://open.bigmodel.cn/api/paas/v4/"
        )

        system_prompt = '''你是一个学术搜索助手，负责将用户的中文查询转换为 paperscraper 库可用的搜索关键词。

重要说明：paperscraper 库会在关键词前自动添加 "all:" 前缀，因此你只需要返回纯关键词，不要添加任何前缀！

任务规则：
1. 分析用户输入的中文关键词
2. 如果是特定类别（如"人工智能"、"机器学习"、"计算机视觉"、"自然语言处理"等），返回对应的 arXiv 类别代码（cs.AI, cs.LG, cs.CV, cs.CL 等）
3. 如果是通用概念或技术术语（如"注意力机制"、"神经网络"、"深度学习"等），返回英文关键词
4. 返回格式：只需返回搜索关键词字符串，不要添加任何前缀（cat:、all: 等），不要添加任何解释

类别参考：
- cs.AI：人工智能
- cs.LG：机器学习
- cs.CV：计算机视觉
- cs.CL：自然语言处理
- cs.NE：神经与计算
- cs.RO：机器人学

示例：
输入：人工智能 → 输出：cs.AI
输入：机器学习 → 输出：cs.LG
输入：计算机视觉 → 输出：cs.CV
输入：自然语言处理 → 输出：cs.CL
输入：注意力机制 → 输出：attention mechanism
输入：深度学习 → 输出：deep learning
输入：神经网络 → 输出：neural network'''

        full_messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]

        try:
            response = client.chat.completions.create(
                model="glm-4.7-flash",
                messages=full_messages,
                temperature=0.3
            )
            ai_reply = response.choices[0].message.content.strip()

            # 清理前缀：移除 cat:、all: 等前缀，只保留核心关键词
            # 因为 paperscraper 会自动添加 all: 前缀
            cleaned_reply = ai_reply
            # 循环清理所有可能的前缀，直到没有前缀为止
            while True:
                found_prefix = False
                for prefix in ['cat:', 'all:', 'ti:', 'au:', 'abs:', 'jr:']:
                    if cleaned_reply.lower().startswith(prefix):
                        cleaned_reply = cleaned_reply[len(prefix):].strip()
                        found_prefix = True
                        break
                if not found_prefix:
                    break

            print(f"LLM生成的查询: {ai_reply}")
            print(f"清理后的查询: {cleaned_reply}")
            return cleaned_reply
        except Exception as e:
            print(f"LLM API调用失败: {e}")
            return user_input

    def load_cache(self) -> Dict:
        """加载缓存数据"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'rb') as f:
                    return pickle.load(f)
            except:
                return {}
        return {}

    def load_citation_cache(self) -> Dict:
        """加载引用数缓存"""
        if self.citation_cache_file.exists():
            try:
                with open(self.citation_cache_file, 'rb') as f:
                    return pickle.load(f)
            except:
                return {}
        return {}

    def save_cache(self):
        """保存缓存数据"""
        with open(self.cache_file, 'wb') as f:
            pickle.dump(self.cached_papers, f)

    def save_citation_cache(self):
        """保存引用数缓存"""
        with open(self.citation_cache_file, 'wb') as f:
            pickle.dump(self.citation_cache, f)

    def parse_date(self, date_str: str) -> datetime:
        """解析日期字符串"""
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except:
            try:
                return datetime.strptime(date_str[:10], '%Y-%m-%d')
            except:
                return datetime.now()

    def search_papers(self, max_search: int = 10000) -> List[Dict]:
        """搜索论文 - 使用paperscraper库"""
        # 使用LLM转换关键词
        search_keyword = self.get_query(self.keyword)
        print(f" 正在搜索关键词: {self.keyword}")
        print(f" LLM转换后: {search_keyword}")
        print(f" 初始搜索数量: {max_search}, 目标筛选: {self.max_results}")

        papers = []

        # 使用paperscraper搜索论文
        print("\n 正在获取论文信息...")
        start_time = time.time()

        # 确保保存目录存在（使用os.makedirs确保所有父目录都被创建）
        os.makedirs(self.save_dir, exist_ok=True)

        try:
            # 导入paperscraper
            from paperscraper.arxiv import get_and_dump_arxiv_papers

            # 构建查询 - paperscraper会自动添加 all: 前缀
            # 只需要传入纯关键词
            keywords = [search_keyword]

            # 搜索论文并保存到临时文件
            get_and_dump_arxiv_papers(
                keywords=keywords,
                output_filepath=str(self.temp_search_file),
                max_results=max_search
            )

            # 读取搜索结果
            if self.temp_search_file.exists():
                with open(self.temp_search_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        try:
                            paper_data = json.loads(line.strip())
                            paper_id = paper_data.get('doi', '').replace('10.48550/arXiv.', '')

                            # 检查缓存
                            if paper_id in self.cached_papers:
                                papers.append(self.cached_papers[paper_id])
                            else:
                                paper_info = {
                                    'id': paper_id,
                                    'title': paper_data.get('title', ''),
                                    'authors': paper_data.get('authors', []),
                                    'abstract': paper_data.get('abstract', ''),
                                    'published': self.parse_date(paper_data.get('date', '')),
                                    'updated': self.parse_date(paper_data.get('date', '')),
                                    'pdf_url': paper_data.get('pdf', ''),
                                    'entry_url': paper_data.get('link', ''),
                                    'categories': paper_data.get('categories', []),
                                    'primary_category': paper_data.get('categories', [''])[0] if paper_data.get('categories') else '',
                                    'doi': paper_data.get('doi', ''),
                                }

                                papers.append(paper_info)
                                self.cached_papers[paper_id] = paper_info

                        except json.JSONDecodeError:
                            continue

        except ImportError:
            print(" 错误: paperscraper库未安装，请运行: pip install paperscraper")
            raise ImportError("paperscraper库未安装")

        except Exception as e:
            print(f" paperscraper搜索失败: {e}")
            raise

        elapsed = time.time() - start_time
        print(f" 成功获取 {len(papers)} 篇论文 (耗时: {elapsed:.1f}秒)")
        self.save_cache()
        return papers

    async def fetch_citations_batch(self, paper_titles: List[str], paper_ids: List[str] = None) -> Dict[str, int]:
        """批量获取引用数 - 使用OpenAlex API（替代Semantic Scholar）"""
        # 先检查缓存
        uncached_titles = [title for title in paper_titles if title not in self.citation_cache]
        cached_results = {title: self.citation_cache[title] for title in paper_titles if title in self.citation_cache}

        if not uncached_titles:
            print(f" 引用数: 全部从缓存获取 ({len(cached_results)} 条)")
            return cached_results

        print(f" 引用数: 缓存命中 {len(cached_results)}, 需API查询 {len(uncached_titles)}")

        results = {}
        success_count = 0
        fail_count = 0

        max_concurrent = 30
        connector = aiohttp.TCPConnector(limit=max_concurrent)
        timeout = aiohttp.ClientTimeout(total=60, connect=15)

        async def fetch_by_arxiv_id(session, paper_id, semaphore):
            """通过arXiv ID查询OpenAlex"""
            nonlocal success_count, fail_count
            async with semaphore:
                try:
                    # OpenAlex使用arXiv ID查询
                    url = f"https://api.openalex.org/works/https://arxiv.org/abs/{paper_id}"
                    headers = {"Accept": "application/json"}

                    async with session.get(url, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            citation = data.get('cited_by_count', 0) or 0
                            success_count += 1
                            return paper_id, citation
                        else:
                            fail_count += 1
                            return paper_id, 0
                except:
                    fail_count += 1
                    return paper_id, 0

        async def fetch_by_title(session, title, semaphore):
            """通过标题搜索OpenAlex（备用方案）"""
            nonlocal success_count, fail_count
            async with semaphore:
                try:
                    # 使用title.search过滤
                    url = f"https://api.openalex.org/works?filter=title.search:{title}&per_page=1"
                    headers = {"Accept": "application/json"}

                    async with session.get(url, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data.get('results') and len(data['results']) > 0:
                                paper = data['results'][0]
                                citation = paper.get('cited_by_count', 0) or 0
                                success_count += 1
                                return title, citation
                            else:
                                fail_count += 1
                                return title, 0
                        else:
                            fail_count += 1
                            return title, 0
                except:
                    fail_count += 1
                    return title, 0

        semaphore = asyncio.Semaphore(max_concurrent)

        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            tasks = []
            # 优先使用arXiv ID查询
            if paper_ids:
                for title, paper_id in zip(uncached_titles, paper_ids):
                    if paper_id:
                        tasks.append(fetch_by_arxiv_id(session, paper_id, semaphore))
                    else:
                        tasks.append(fetch_by_title(session, title, semaphore))
            else:
                for title in uncached_titles:
                    tasks.append(fetch_by_title(session, title, semaphore))

            with tqdm(total=len(uncached_titles), desc="获取引用数") as pbar:
                for coro in asyncio.as_completed(tasks):
                    try:
                        key, count = await coro
                        results[key] = count
                        self.citation_cache[key] = count
                    except:
                        pass
                    pbar.update(1)

        print(f" 引用数获取完成: 成功 {success_count}, 失败 {fail_count}")
        final_results = {**cached_results, **results}
        return final_results

    def calculate_score(self, paper: Dict, citation_weight: float = 0.7) -> float:
        """计算论文综合分数"""
        try:
            if isinstance(paper['published'], str):
                published_date = datetime.fromisoformat(paper['published'].replace('Z', '+00:00'))
            else:
                published_date = paper['published']
            days_since_publish = (datetime.now() - published_date.replace(tzinfo=None)).days
        except:
            days_since_publish = 0

        time_score = max(0, 1 - days_since_publish / 3650)

        citation_count = paper.get('citation_count', 0)
        if citation_count > 0:
            citation_score = min(1.0, (citation_count ** 0.5) / 10)
        else:
            citation_score = 0

        total_score = (citation_score * citation_weight +
                       time_score * (1 - citation_weight))

        return total_score

    async def rank_papers_async(self, papers: List[Dict], citation_weight: float = 0.7) -> List[Dict]:
        """异步排序论文 - 全局比较所有论文"""
        print("\n 正在获取引用数并计算分数...")

        # 对所有论文获取引用数（全局比较）
        paper_titles = [p['title'] for p in papers]
        paper_ids = [p['id'] for p in papers]

        print(f" 目标筛选论文数: {len(papers)}, 需获取引用数: {len(paper_titles)}")

        start_time = time.time()
        citation_map = await self.fetch_citations_batch(paper_titles, paper_ids)
        elapsed = time.time() - start_time
        print(f" 引用数获取完成 (耗时: {elapsed:.1f}秒)")

        for paper in papers:
            paper['citation_count'] = citation_map.get(paper['id'], citation_map.get(paper['title'], 0))
            paper['score'] = self.calculate_score(paper, citation_weight)

        ranked_papers = sorted(papers, key=lambda x: x['score'], reverse=True)

        print(f" 排序完成，已选出Top {self.max_results}篇论文")
        self.save_citation_cache()
        return ranked_papers[:self.max_results]

    def rank_papers(self, papers: List[Dict], citation_weight: float = 0.7) -> List[Dict]:
        """排序论文 - 同步入口"""
        return asyncio.run(self.rank_papers_async(papers, citation_weight))

    async def download_pdf_async(self, session, paper, semaphore):
        """异步下载单篇论文PDF - 使用同步requests + 代理支持"""
        import requests
        import os

        paper_id = paper.get('id', '')
        pdf_path = self.pdfs_dir / f"{paper_id}.pdf"

        if pdf_path.exists():
            return True

        # 获取代理设置
        proxies = {}
        http_proxy = os.environ.get('HTTP_PROXY') or os.environ.get('http_proxy')
        https_proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')

        if http_proxy:
            proxies['http'] = http_proxy
        if https_proxy:
            proxies['https'] = https_proxy

        # 备用URL列表 - 优先使用国内镜像
        pdf_urls = [
            # 优先 ar5iv 国内镜像
            f"https://ar5iv.org/pdf/{paper_id}.pdf",
            # 然后其他镜像
            f"https://arxiv.org/pdf/{paper_id}.pdf",
            # 尝试使用 jina AI 代理
            f"https://r.jina.ai/http://arxiv.org/pdf/{paper_id}.pdf",
        ]

        async with semaphore:
            for url in pdf_urls:
                try:
                    # 使用同步requests，更稳定
                    response = requests.get(
                        url,
                        timeout=60,
                        allow_redirects=True,
                        proxies=proxies if proxies else None,
                        headers={'User-Agent': 'Mozilla/5.0'}
                    )

                    if response.status_code == 200:
                        content = response.content
                        # 检查是否为PDF
                        if len(content) > 1000 and content[:4] == b'%PDF':
                            with open(pdf_path, 'wb') as f:
                                f.write(content)
                            if pdf_path.exists() and pdf_path.stat().st_size > 1000:
                                return True
                    elif response.status_code == 404:
                        continue
                    elif response.status_code == 429:
                        await asyncio.sleep(3)
                        continue
                except Exception as e:
                    if 'proxy' in str(e).lower():
                        continue
                    continue

            return False

    async def download_papers_async(self, papers: List[Dict], max_workers: int = 10):
        """异步批量下载论文"""
        print(f"\n 开始下载 {len(papers)} 篇论文...")

        # 统计已下载的论文
        papers_to_download = []
        for paper in papers:
            pdf_path = self.pdfs_dir / f"{paper.get('id', '')}.pdf"
            if not pdf_path.exists():
                papers_to_download.append(paper)

        print(f" 需下载: {len(papers_to_download)} 篇")

        if not papers_to_download:
            print(" 所有论文已存在，跳过下载")
            return

        # 降低并发数，避免被限流
        semaphore = asyncio.Semaphore(max_workers)
        connector = aiohttp.TCPConnector(limit=max_workers, ttl_dns_cache=300)
        timeout = aiohttp.ClientTimeout(total=60)

        success_count = 0
        failed_papers = []
        error_count = 0  # 限制错误日志数量

        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            tasks = [self.download_pdf_async(session, paper, semaphore) for paper in papers_to_download]

            with tqdm(total=len(papers_to_download), desc="下载PDF") as pbar:
                for i, coro in enumerate(asyncio.as_completed(tasks)):
                    try:
                        result = await coro
                        if result:
                            success_count += 1
                        else:
                            failed_papers.append(papers_to_download[i].get('id', 'unknown'))
                    except Exception as e:
                        failed_papers.append(papers_to_download[i].get('id', 'unknown'))
                    pbar.update(1)

        # 输出失败论文列表
        if failed_papers:
            print(f"\n 下载失败论文数: {len(failed_papers)}")
            # 只显示前5个
            print(f" 失败论文ID: {', '.join(failed_papers[:5])}")

        print(f" 成功下载 {success_count}/{len(papers_to_download)} 篇论文")

    def download_papers(self, papers: List[Dict], max_workers: int = 20):
        """下载论文 - 同步入口"""
        asyncio.run(self.download_papers_async(papers, max_workers))

    def save_metadata(self, papers: List[Dict]):
        """保存论文元数据（只保留JSON格式）"""
        print("\n 正在保存元数据...")

        # 只保存为JSON
        json_path = self.metadata_dir / "papers_metadata.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(papers, f, ensure_ascii=False, indent=2, default=str)

        print(f" 元数据已保存至: {json_path}")

    # 主入口
    def main(self,
              initial_search: int = 1000,
              citation_weight: float = 0.7,
              download_pdf: bool = True):
        """运行爬虫主流程

        参数:
            initial_search: 初始搜索论文数量
            citation_weight: 引用数权重 (0-1)
            download_pdf: 是否下载PDF (默认False，因网络问题)
        """
        start_time = time.time()

        print("=" * 80)
        print(" arXiv 论文爬虫启动 (基于paperscraper)")
        print("=" * 80)

        # 1. 搜索论文
        papers = self.search_papers(max_search=initial_search)

        if not papers:
            print(" 未找到相关论文")
            return

        # 2. 排序筛选
        top_papers = self.rank_papers(papers, citation_weight)

        # 3. 保存元数据
        self.save_metadata(top_papers)

        # 4. 下载PDF (默认关闭，因网络问题)
        if download_pdf:
            print("\n 注意: 由于网络原因，PDF下载可能失败")
            self.download_papers(top_papers, max_workers=10)

        # 统计信息
        elapsed_time = time.time() - start_time
        print("\n" + "=" * 80)
        print(" 爬取完成!")
        print(f"  总耗时: {elapsed_time:.2f} 秒 ({elapsed_time / 60:.1f} 分钟)")
        print(f" 论文总数: {len(top_papers)}")
        print(f" 保存位置: {self.save_dir.absolute()}")
        print("=" * 80)
        print("\n 元数据文件已保存:")
        print(f"  - JSON: {self.metadata_dir / 'papers_metadata.json'}")
        print("=" * 80)


# 使用示例
if __name__ == "__main__":
    crawler = TopicCrawler(keyword="人工智能", max_results=100)
    crawler.main()
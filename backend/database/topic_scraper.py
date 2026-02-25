"""
arXiv 论文爬虫 - 优化版本
支持关键词搜索、论文下载、智能排序、速率限制处理
"""

import arxiv
import requests
import json
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import pickle


class ArxivCrawler:
    """arXiv 论文爬虫类"""

    def __init__(self,
                 keyword: str,
                 save_dir: str = "./arxiv_papers",
                 max_results: int = 100):
        """
        初始化爬虫

        Args:
            keyword: 搜索关键词
            save_dir: 保存目录
            max_results: 最终筛选的论文数量
        """
        self.keyword = keyword
        self.save_dir = Path(save_dir)
        self.max_results = max_results
        self.cache_file = self.save_dir / "cache.pkl"
        self.citation_cache_file = self.save_dir / "citations.pkl"

        # 创建目录结构
        self.papers_dir = self.save_dir / "papers"
        self.pdfs_dir = self.save_dir / "pdfs"
        self.metadata_dir = self.save_dir / "metadata"

        for dir_path in [self.papers_dir, self.pdfs_dir, self.metadata_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

        # 加载缓存
        self.cached_papers = self._load_cache()
        self.citation_cache = self._load_citation_cache()

        # API 速率控制
        self.last_api_call = 0
        self.api_delay = 0.1  # 100ms延迟

    def _load_cache(self) -> Dict:
        """加载缓存数据"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'rb') as f:
                    return pickle.load(f)
            except:
                return {}
        return {}

    def _load_citation_cache(self) -> Dict:
        """加载引用数缓存"""
        if self.citation_cache_file.exists():
            try:
                with open(self.citation_cache_file, 'rb') as f:
                    return pickle.load(f)
            except:
                return {}
        return {}

    def _save_cache(self):
        """保存缓存数据"""
        with open(self.cache_file, 'wb') as f:
            pickle.dump(self.cached_papers, f)

    def _save_citation_cache(self):
        """保存引用数缓存"""
        with open(self.citation_cache_file, 'wb') as f:
            pickle.dump(self.citation_cache, f)

    def search_papers(self, max_search: int = 2000) -> List[Dict]:
        """
        搜索论文

        Args:
            max_search: 初始搜索数量（会进行筛选）

        Returns:
            论文列表
        """
        print(f"🔍 正在搜索关键词: {self.keyword}")
        print(f"📊 初始搜索数量: {max_search}, 目标筛选: {self.max_results}")

        papers = []

        # 使用新的 Client API
        client = arxiv.Client()

        # 构建搜索查询
        search = arxiv.Search(
            query=self.keyword,
            max_results=max_search,
            sort_by=arxiv.SortCriterion.SubmittedDate,
            sort_order=arxiv.SortOrder.Descending
        )

        # 获取论文
        print("\n📥 正在获取论文信息...")
        with tqdm(total=max_search, desc="获取论文") as pbar:
            for result in client.results(search):
                try:
                    paper_id = result.entry_id.split('/')[-1]

                    # 检查缓存
                    if paper_id in self.cached_papers:
                        papers.append(self.cached_papers[paper_id])
                    else:
                        paper_info = {
                            'id': paper_id,
                            'title': result.title,
                            'authors': [author.name for author in result.authors],
                            'abstract': result.summary,
                            'published': result.published,
                            'updated': result.updated,
                            'pdf_url': result.pdf_url,
                            'entry_url': result.entry_id,
                            'categories': result.categories,
                            'primary_category': result.primary_category,
                        }

                        papers.append(paper_info)
                        self.cached_papers[paper_id] = paper_info

                    pbar.update(1)

                    # 每100篇保存一次缓存
                    if len(papers) % 100 == 0:
                        self._save_cache()

                except Exception as e:
                    print(f"\n⚠️  获取论文失败: {e}")
                    pbar.update(1)
                    continue

        print(f"\n✅ 成功获取 {len(papers)} 篇论文")
        self._save_cache()
        return papers

    def get_citations_with_retry(self, paper_id: str, max_retries: int = 3) -> int:
        """
        获取论文引用数（带重试和速率限制）

        Args:
            paper_id: arXiv ID
            max_retries: 最大重试次数

        Returns:
            引用数
        """
        # 检查缓存
        if paper_id in self.citation_cache:
            return self.citation_cache[paper_id]

        # 速率限制
        current_time = time.time()
        time_since_last_call = current_time - self.last_api_call
        if time_since_last_call < self.api_delay:
            time.sleep(self.api_delay - time_since_last_call)

        for attempt in range(max_retries):
            try:
                url = f"https://api.semanticscholar.org/graph/v1/paper/arXiv:{paper_id}"
                params = {"fields": "citationCount"}

                self.last_api_call = time.time()
                response = requests.get(url, params=params, timeout=10)

                if response.status_code == 200:
                    data = response.json()
                    citation_count = data.get('citationCount', 0)
                    self.citation_cache[paper_id] = citation_count
                    return citation_count
                elif response.status_code == 429:  # Too Many Requests
                    wait_time = 2 ** attempt  # 指数退避
                    time.sleep(wait_time)
                    continue
                else:
                    return 0
            except Exception as e:
                if attempt == max_retries - 1:
                    return 0
                time.sleep(1)

        return 0

    def calculate_score(self, paper: Dict, citation_weight: float = 0.7) -> float:
        """
        计算论文综合分数

        Args:
            paper: 论文信息
            citation_weight: 引用数权重 (默认0.7)

        Returns:
            综合分数
        """
        # 时间新近度分数（0-1之间）
        days_since_publish = (datetime.now() - paper['published'].replace(tzinfo=None)).days
        time_score = max(0, 1 - days_since_publish / 3650)  # 10年为满分衰减期

        # 引用数分数（归一化，使用对数缩放）
        citation_count = paper.get('citation_count', 0)
        if citation_count > 0:
            # 使用对数缩放，100引用约为0.5分，1000引用约为0.75分
            citation_score = min(1.0, (citation_count ** 0.5) / 10)
        else:
            citation_score = 0

        # 综合分数
        total_score = (citation_score * citation_weight +
                       time_score * (1 - citation_weight))

        return total_score

    def rank_papers(self, papers: List[Dict], citation_weight: float = 0.7) -> List[Dict]:
        """
        对论文进行排序（优化版）

        Args:
            papers: 论文列表
            citation_weight: 引用数权重

        Returns:
            排序后的论文列表
        """
        print("\n📈 正在获取引用数并计算分数...")
        print(f"💡 提示: 使用缓存加速，新论文需要查询API")

        # 统计需要查询的论文数
        papers_need_query = [p for p in papers if p['id'] not in self.citation_cache]
        print(
            f"📊 总论文数: {len(papers)}, 已缓存: {len(papers) - len(papers_need_query)}, 需查询: {len(papers_need_query)}")

        # 批量获取引用数（使用线程池，但限制并发数）
        completed = 0

        with ThreadPoolExecutor(max_workers=5) as executor:  # 降低并发数
            future_to_paper = {
                executor.submit(self.get_citations_with_retry, paper['id']): paper
                for paper in papers
            }

            with tqdm(total=len(papers), desc="获取引用") as pbar:
                for future in as_completed(future_to_paper):
                    paper = future_to_paper[future]
                    try:
                        paper['citation_count'] = future.result()
                    except Exception as e:
                        paper['citation_count'] = 0

                    # 计算分数
                    paper['score'] = self.calculate_score(paper, citation_weight)

                    completed += 1
                    pbar.update(1)

                    # 每50篇保存一次引用缓存
                    if completed % 50 == 0:
                        self._save_citation_cache()

        # 保存最终缓存
        self._save_citation_cache()

        # 排序
        ranked_papers = sorted(papers, key=lambda x: x['score'], reverse=True)

        print(f"✅ 排序完成，已选出Top {self.max_results}篇论文")
        return ranked_papers[:self.max_results]

    def download_pdf(self, paper: Dict) -> bool:
        """
        下载单篇论文PDF

        Args:
            paper: 论文信息

        Returns:
            是否成功
        """
        pdf_path = self.pdfs_dir / f"{paper['id']}.pdf"

        # 检查是否已下载
        if pdf_path.exists():
            return True

        try:
            response = requests.get(paper['pdf_url'], timeout=30)
            if response.status_code == 200:
                with open(pdf_path, 'wb') as f:
                    f.write(response.content)
                return True
        except Exception as e:
            return False

        return False

    def download_papers(self, papers: List[Dict], max_workers: int = 3):
        """
        批量下载论文

        Args:
            papers: 论文列表
            max_workers: 并发数
        """
        print(f"\n📥 开始下载 {len(papers)} 篇论文...")

        # 检查已下载的论文
        already_downloaded = sum(1 for p in papers
                                 if (self.pdfs_dir / f"{p['id']}.pdf").exists())

        if already_downloaded > 0:
            print(f"💡 已下载: {already_downloaded} 篇，跳过...")

        success_count = already_downloaded

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_paper = {
                executor.submit(self.download_pdf, paper): paper
                for paper in papers
            }

            with tqdm(total=len(papers), desc="下载PDF", initial=already_downloaded) as pbar:
                for future in as_completed(future_to_paper):
                    if future.result():
                        success_count += 1
                    pbar.update(1)

        print(f"✅ 成功下载 {success_count}/{len(papers)} 篇论文")

    def save_metadata(self, papers: List[Dict]):
        """
        保存论文元数据

        Args:
            papers: 论文列表
        """
        print("\n💾 正在保存元数据...")

        # 保存为JSON
        json_path = self.metadata_dir / "papers_metadata.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(papers, f, ensure_ascii=False, indent=2, default=str)

        # 保存为文本摘要
        summary_path = self.metadata_dir / "papers_summary.txt"
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(f"论文爬取报告 - {self.keyword}\n")
            f.write(f"生成时间: {datetime.now()}\n")
            f.write(f"总数: {len(papers)}\n")
            f.write("=" * 80 + "\n\n")

            for i, paper in enumerate(papers, 1):
                f.write(f"{i}. {paper['title']}\n")
                f.write(f"   ID: {paper['id']}\n")
                f.write(f"   作者: {', '.join(paper['authors'][:3])}")
                if len(paper['authors']) > 3:
                    f.write(f" 等{len(paper['authors'])}人")
                f.write(f"\n")
                f.write(f"   发布日期: {paper['published'].date()}\n")
                f.write(f"   引用数: {paper.get('citation_count', 0)}\n")
                f.write(f"   综合分数: {paper.get('score', 0):.4f}\n")
                f.write(f"   分类: {paper['primary_category']}\n")
                f.write(f"   链接: {paper['entry_url']}\n")
                f.write(f"   PDF: {paper['pdf_url']}\n")
                f.write(f"   摘要: {paper['abstract'][:200]}...\n")
                f.write("-" * 80 + "\n\n")

        # 保存为CSV
        csv_path = self.metadata_dir / "papers.csv"
        with open(csv_path, 'w', encoding='utf-8-sig') as f:
            f.write("排名,标题,作者,发布日期,引用数,分数,arXiv ID,链接\n")
            for i, paper in enumerate(papers, 1):
                authors = '; '.join(paper['authors'][:3])
                f.write(f'{i},"{paper["title"]}","{authors}",{paper["published"].date()},'
                        f'{paper.get("citation_count", 0)},{paper.get("score", 0):.4f},'
                        f'{paper["id"]},{paper["entry_url"]}\n')

        print(f"✅ 元数据已保存至: {self.metadata_dir}")
        print(f"   - JSON: {json_path.name}")
        print(f"   - 文本摘要: {summary_path.name}")
        print(f"   - CSV: {csv_path.name}")

    def run(self,
            initial_search: int = 2000,
            citation_weight: float = 0.7,
            download_pdf: bool = True):
        """
        运行爬虫主流程

        Args:
            initial_search: 初始搜索数量
            citation_weight: 引用数权重
            download_pdf: 是否下载PDF
        """
        start_time = time.time()

        print("=" * 80)
        print("🚀 arXiv 论文爬虫启动")
        print("=" * 80)

        # 1. 搜索论文
        papers = self.search_papers(max_search=initial_search)

        if not papers:
            print("❌ 未找到相关论文")
            return

        # 2. 排序筛选
        top_papers = self.rank_papers(papers, citation_weight)

        # 3. 保存元数据
        self.save_metadata(top_papers)

        # 4. 下载PDF
        if download_pdf:
            self.download_papers(top_papers)

        # 统计信息
        elapsed_time = time.time() - start_time
        print("\n" + "=" * 80)
        print(" 爬取完成!")
        print(f"  总耗时: {elapsed_time:.2f} 秒 ({elapsed_time / 60:.1f} 分钟)")
        print(f" 论文总数: {len(top_papers)}")
        print(f" 保存位置: {self.save_dir.absolute()}")
        print(f" 缓存: 论文{len(self.cached_papers)}篇, 引用数{len(self.citation_cache)}条")
        print("=" * 80)


def main():
    # 参数配置
    KEYWORD = "large language model"
    SAVE_DIR = "./arxiv_papers"
    MAX_RESULTS = 100
    INITIAL_SEARCH = 2000
    CITATION_WEIGHT = 0.7

    # 创建爬虫实例
    crawler = ArxivCrawler(
        keyword=KEYWORD,
        save_dir=SAVE_DIR,
        max_results=MAX_RESULTS
    )

    # 运行爬虫
    crawler.run(
        initial_search=INITIAL_SEARCH,
        citation_weight=CITATION_WEIGHT,
        download_pdf=True
    )


if __name__ == "__main__":
    main()

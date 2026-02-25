#!/usr/bin/env python3
"""
每日arXiv论文爬取工具 - 支持arxiv库和arxivscraper库
"""

import json
import time
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

import arxiv
import arxivscraper
from tqdm import tqdm

#  配置参数
QUERY = "AI"              # 搜索关键词
DAYS = 1                  # 时间范围: 1-7天前
MAX_RESULTS = 50          # 最大结果数
SOURCE = "api"            # 数据源: api 或 scraper
OUTPUT_FILE = None         # 输出文件名, None则自动生成
#  配置结束
CS_CATEGORIES = [
    "cs.AI", "cs.LG", "cs.CV", "cs.CL", "cs.NE", "cs.RO",
    "cs.CR", "cs.CY", "cs.DB", "cs.DC", "cs.DL", "cs.DM"
]


def calculate_date_range(days: int):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    return start_date, end_date


#  arxiv库方法
def get_query_category(query: str) -> str:
    query_lower = query.lower().strip()
    cat_map = {
        "ai": "cs.AI", "ml": "cs.LG", "machine learning": "cs.LG",
        "deep learning": "cs.LG", "neural": "cs.NE", "cv": "cs.CV",
        "computer vision": "cs.CV", "nlp": "cs.CL", "natural language": "cs.CL",
        "llm": "cs.CL", "language model": "cs.CL", "robot": "cs.RO",
        "reinforcement": "cs.LG", "gan": "cs.LG", "transformer": "cs.LG"
    }
    for kw, cat in cat_map.items():
        if kw in query_lower:
            return cat
    return "cs.AI"


def build_search_query(query: str, days: int) -> str:
    category = get_query_category(query)
    return f"cat:{category}"


def fetch_via_api(query: str, days: int, max_results: int) -> list:
    start_date, end_date = calculate_date_range(days)
    search_query = build_search_query(query, days)

    print(f"\n{'='*60}")
    print(f"arXiv API 搜索配置:")
    print(f"  关键词: {query}, 日期: {start_date.strftime('%Y-%m-%d')} ~ {end_date.strftime('%Y-%m-%d')}")
    print(f"  类别: {get_query_category(query)}")
    print(f"{'='*60}\n")

    client = arxiv.Client()
    papers = []
    total = 0
    query_lower = query.lower()
    download_max = max_results * 3
    retry_count = 0
    max_retries = 3

    print("正在从arXiv API获取论文...")
    with tqdm(total=download_max, desc="下载进度", unit="篇") as pbar:
        batch_size = 30
        for batch_start in range(0, download_max, batch_size):
            batch_search = arxiv.Search(
                query=search_query,
                max_results=min(batch_size, download_max - batch_start),
                sort_by=arxiv.SortCriterion.SubmittedDate,
                sort_order=arxiv.SortOrder.Descending
            )
            try:
                for result in client.results(batch_search):
                    pub_date = result.published.date()
                    start_date_only = start_date.date()
                    end_date_only = end_date.date()
                    if pub_date < start_date_only or pub_date > end_date_only:
                        pbar.update(1)
                        continue

                    title_lower = result.title.lower()
                    summary_lower = result.summary.lower()
                    if query_lower not in title_lower and query_lower not in summary_lower:
                        pbar.update(1)
                        continue

                    papers.append({
                        "id": result.entry_id.split("/")[-1],
                        "title": result.title,
                        "summary": result.summary,
                        "url": result.entry_id,
                        "pdf_url": result.pdf_url,
                        "published_date": result.published.strftime("%Y-%m-%d"),
                        "updated_date": result.updated.strftime("%Y-%m-%d"),
                        "categories": result.categories,
                        "primary_category": result.primary_category,
                        "source": "arxiv_api"
                    })
                    total += 1
                    pbar.update(1)
                    if total >= max_results:
                        break
                retry_count = 0
            except Exception as e:
                retry_count += 1
                if "429" in str(e) and retry_count < max_retries:
                    wait_time = retry_count * 3
                    print(f"\n⚠️ API限速,等待 {wait_time}秒后重试...")
                    time.sleep(wait_time)
                    continue
                print(f"\n下载出错: {e}")
                continue
            if total >= max_results:
                break

    print(f"\n✓ arXiv API 获取完成: {len(papers)} 篇")
    return papers


#  arxivscraper库方法
def get_relevant_categories(query: str) -> list:
    query_lower = query.lower()
    keyword_map = {
        "ai": ["cs.AI", "cs.LG"], "machine learning": ["cs.LG", "stat.ML"],
        "deep learning": ["cs.LG", "stat.ML"], "neural": ["cs.LG", "cs.NE"],
        "nlp": ["cs.CL"], "computer vision": ["cs.CV"], "llm": ["cs.CL", "cs.AI"]
    }
    categories = []
    for kw, cats in keyword_map.items():
        if kw in query_lower:
            categories.extend(cats)
    return list(set(categories)) if categories else CS_CATEGORIES[:5]


def filter_by_keyword(papers: list, keywords: str) -> list:
    kw_lower = keywords.lower()
    return [p for p in papers if kw_lower in p.get("title", "").lower() or kw_lower in p.get("abstract", "").lower()]


def scrape_category(category: str, date_from: str, date_until: str) -> list:
    try:
        scraper = arxivscraper.Scraper(category=category, date_from=date_from, date_until=date_until)
        return scraper.scrape()
    except Exception:
        return []


def fetch_via_scraper(query: str, days: int, max_results: int) -> list:
    start_date, end_date = calculate_date_range(days)
    date_from = start_date.strftime("%Y-%m-%d")
    date_until = end_date.strftime("%Y-%m-%d")
    categories = get_relevant_categories(query)

    print(f"\n{'='*60}")
    print(f"arXivScraper 搜索配置:")
    print(f"  关键词: {query}, 日期: {start_date.strftime('%Y-%m-%d')} ~ {end_date.strftime('%Y-%m-%d')}")
    print(f"  类别: {', '.join(categories[:3])}...")
    print(f"{'='*60}\n")

    all_papers = []
    print("正在从arXiv爬取论文...")

    with tqdm(total=len(categories), desc="类别进度", unit="类") as pbar:
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(scrape_category, cat, date_from, date_until): cat for cat in categories}
            for future in as_completed(futures):
                results = future.result()
                if results:
                    all_papers.extend(results)
                pbar.update(1)

    print(f"\n原始结果: {len(all_papers)} 篇")
    all_papers = filter_by_keyword(all_papers, query)
    print(f"过滤后: {len(all_papers)} 篇")

    if len(all_papers) > max_results:
        all_papers = all_papers[:max_results]

    formatted = []
    for paper in all_papers:
        pid = paper.get("id", "")
        if "arxiv.org/" in str(pid):
            pid = str(pid).split("arxiv.org/")[-1]

        authors = paper.get("authors", [])
        if isinstance(authors, str):
            authors = authors.split(", ") if authors else []

        cats = paper.get("categories", "")
        if isinstance(cats, str):
            cats = cats.split(", ") if cats else []
        elif not isinstance(cats, list):
            cats = []

        formatted.append({
            "id": pid,
            "title": paper.get("title", ""),
            "summary": paper.get("abstract", ""),
            "url": f"https://arxiv.org/abs/{pid}" if pid else "",
            "pdf_url": f"https://arxiv.org/pdf/{pid}.pdf" if pid else "",
            "published_date": str(paper.get("created", ""))[:10],
            "updated_date": str(paper.get("updated", ""))[:10],
            "categories": cats,
            "primary_category": cats[0] if cats else "",
            "source": "arxiv_scraper"
        })

    print(f"\n✓ arXivScraper 获取完成: {len(formatted)} 篇")
    return formatted


# 通用函数
def save_to_json(papers: list, output_file: str):
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)
    print(f"✓ 结果已保存到: {output_file}")



def main():
    date_str = datetime.now().strftime("%Y%m%d")
    output_file = OUTPUT_FILE or f"papers_{SOURCE}_{date_str}.json"

    print(f"\n 开始爬取arXiv论文 (使用{SOURCE}模式)...")
    print(f" 时间范围: 过去 {DAYS} 天, 关键词: {QUERY}")

    papers = fetch_via_api(QUERY, DAYS, MAX_RESULTS) if SOURCE == "api" else fetch_via_scraper(QUERY, DAYS, MAX_RESULTS)

    if not papers:
        print("\n⚠️  未找到论文")
        return

    save_to_json(papers, output_file)

    print(f"\n{'='*60}")
    print(f" 总论文数: {len(papers)}, 输出: {output_file}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
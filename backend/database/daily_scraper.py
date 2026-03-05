#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import time
import arxiv
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import List, Dict
from tqdm import tqdm

QUERY = "AI"
MAX_RESULTS = 1000
DAYS_RANGE = 1
OUTPUT_FILE = None
MAX_WORKERS = 8


@dataclass
class Paper:
    id: str
    title: str
    summary: str
    url: str
    pdf_url: str
    published_date: str
    updated_date: str
    categories: List[str]
    primary_category: str

    def to_dict(self) -> Dict:
        return {
            "id": self.id, "title": self.title, "summary": self.summary,
            "url": self.url, "pdf_url": self.pdf_url,
            "published_date": self.published_date, "updated_date": self.updated_date,
            "categories": self.categories, "primary_category": self.primary_category,
        }


class ArxivCrawler:
    def __init__(self, query: str = "AI", max_results: int = 1000,
                 days: int = 1, max_workers: int = 8):
        self.query = query
        self.max_results = max_results
        self.days = days
        self.max_workers = max_workers
        self.papers: List[Paper] = []

    def get_date_range(self):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=self.days)
        return start_date, end_date

    def _get_category(self) -> str:
        q = self.query.lower()
        cat_map = {"ai": "cs.AI", "ml": "cs.LG", "deep learning": "cs.LG",
                   "neural": "cs.NE", "cv": "cs.CV", "computer vision": "cs.CV",
                   "nlp": "cs.CL", "llm": "cs.CL"}
        for kw, cat in cat_map.items():
            if kw in q:
                return cat
        return "cs.AI"

    def _build_query(self) -> str:
        start_date, end_date = self.get_date_range()
        start_str = start_date.strftime("%Y%m%d0000")
        end_str = end_date.strftime("%Y%m%d2359")
        return f"cat:{self._get_category()} AND ({self.query.lower()}) AND submittedDate:[{start_str} TO {end_str}]"

    def fetch_papers(self) -> List[Paper]:
        client = arxiv.Client()
        metadata_list = []
        query = self._build_query()
        query_lower = self.query.lower()

        print(f"关键词: {self.query}, 类别: {self._get_category()}, 并发: {self.max_workers}")

        # 修复：进度条总数改为 max_results
        with tqdm(total=self.max_results, desc="获取论文", unit="篇", ncols=80) as pbar:
            for batch_start in range(0, self.max_results * 2, 50):
                search = arxiv.Search(
                    query=query,
                    max_results=50,
                    sort_by=arxiv.SortCriterion.SubmittedDate,
                    sort_order=arxiv.SortOrder.Descending
                )

                try:
                    for result in client.results(search):
                        pub_date = result.published.date()
                        start = self.get_date_range()[0].date()
                        end = self.get_date_range()[1].date()

                        if pub_date < start or pub_date > end:
                            pbar.update(1)
                            continue

                        title_lower = result.title.lower()
                        summary_lower = result.summary.lower()

                        if query_lower not in title_lower and query_lower not in summary_lower:
                            pbar.update(1)
                            continue

                        metadata_list.append({
                            "id": result.entry_id.split("/")[-1],
                            "title": result.title,
                            "summary": result.summary,
                            "url": result.entry_id,
                            "pdf_url": result.pdf_url,
                            "published_date": result.published.strftime("%Y-%m-%d"),
                            "updated_date": result.updated.strftime("%Y-%m-%d"),
                            "categories": result.categories,
                            "primary_category": result.primary_category,
                        })
                        pbar.update(1)

                        if len(metadata_list) >= self.max_results:
                            break

                except Exception as e:
                    if "429" in str(e):
                        time.sleep(3)
                        continue

                if len(metadata_list) >= self.max_results:
                    break

        self.papers = self._process_parallel(metadata_list)
        return self.papers

    def _process_parallel(self, metadata_list: List[Dict]) -> List[Paper]:
        papers = []

        def process(meta):
            return Paper(**meta)

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(process, m) for m in metadata_list]

            with tqdm(total=len(futures), desc="处理", unit="篇", ncols=80) as pbar:
                for future in as_completed(futures):
                    try:
                        papers.append(future.result())
                    except:
                        pass
                    pbar.update(1)

        papers.sort(key=lambda x: x.published_date, reverse=True)
        return papers

    def save_to_json(self, output_file: str):
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump([p.to_dict() for p in self.papers], f, ensure_ascii=False, indent=2)


def main():
    date_str = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")
    output_file = OUTPUT_FILE or f"papers__{date_str}.json"

    crawler = ArxivCrawler(QUERY, MAX_RESULTS, DAYS_RANGE, MAX_WORKERS)
    papers = crawler.fetch_papers()

    if papers:
        crawler.save_to_json(output_file)
        print(f"总论文数: {len(papers)}, 保存至: {output_file}")
    else:
        print("未找到论文")


if __name__ == "__main__":
    main()
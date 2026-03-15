import json
import time
import os
import arxiv
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict
from tqdm import tqdm
from dotenv import load_dotenv
from openai import OpenAI


class DailyCrawler:
    """arXiv论文爬取器 """

    def __init__(self, query: str = "人工智能"):
        """
        初始化爬取器
            query: 中文搜索关键词
            max_results: 最大结果数
            days: 爬取最近N天
            max_workers: 并发线程数
        """
        self.query = query
        self.max_results = 1000
        self.days = 1
        self.max_workers = 8
        self.papers: List[Dict] = []
        self.search_query: str = ""

    # 日期处理
    def get_date_range(self) -> tuple:
        """获取日期范围（昨天0点 到 昨天23:59）"""
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = today - timedelta(days=self.days)
        end_date = today - timedelta(microseconds=1)
        return start_date, end_date

    # LLM查询转换
    @staticmethod
    def get_query(user_input: str) -> str:
        """使用智谱GLM-4 API将中文查询转换为arXiv搜索语法"""
        load_dotenv()
        api_key = os.getenv('API_KEY')

        if not api_key:
            print("警告: 未设置API_KEY")


        client = OpenAI(
            api_key=api_key,
            base_url="https://open.bigmodel.cn/api/paas/v4/"
        )

        system_prompt = '''你是一个学术搜索助手，负责将用户的中文查询转换为 arXiv API 可用的搜索语法。
        
        任务规则：
        1. 分析用户输入的中文关键词
        2. 判断其对应的 arXiv 类别（cs.AI, cs.LG, cs.CV, cs.CL, cs.NE, cs.RO 等）
        3. 如果是通用概念（如"注意力机制"、"神经网络"等），使用 all: 语法
        4. 如果是特定类别（如"人工智能"、"机器学习"等），使用 cat: 语法
        5. 返回格式：只需返回搜索语法字符串，不要添加任何解释
        
        类别参考：
        - cs.AI：人工智能
        - cs.LG：机器学习
        - cs.CV：计算机视觉
        - cs.CL：自然语言处理
        - cs.NE：神经与计算
        - cs.RO：机器人学
        
        示例：
        输入：人工智能 → 输出：cat:cs.AI
        输入：注意力机制 → 输出：all:"attention mechanism"
        输入：机器学习 → 输出：cat:cs.LG'''

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
            print(f"LLM生成的查询: {ai_reply}")
            return ai_reply
        except Exception as e:
            print(f"LLM API调用失败: {e}")

    # 构建查询
    def get_search_query(self) -> str:
        """生成完整搜索查询"""
        print(f"正在使用LLM处理查询: {self.query}")

        base_query = self.get_query(self.query)

        start_date, end_date = self.get_date_range()
        start_str = start_date.strftime("%Y%m%d0000")
        end_str = end_date.strftime("%Y%m%d2359")

        self.search_query = f"{base_query} AND submittedDate:[{start_str} TO {end_str}]"

        print(f"完整搜索查询: {self.search_query}")
        return self.search_query

    # 爬取论文
    def fetch_papers(self) -> List[Dict]:
        """从arXiv获取论文"""
        client = arxiv.Client()
        metadata_list = []
        query = self.get_search_query()

        print(f"关键词: {self.query}, 并发: {self.max_workers}")

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

                        metadata_list.append({
                            "title": result.title,
                            "summary": result.summary,
                            "url": result.entry_id,
                            "pdf_url": result.pdf_url,
                            "published_date": result.published.strftime("%Y-%m-%d"),
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

        self.papers = self.process_parallel(metadata_list)
        return self.papers

    def process_parallel(self, metadata_list: List[Dict]) -> List[Dict]:
        """并行处理论文数据"""
        papers = []

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(self.process_single, m) for m in metadata_list]

            with tqdm(total=len(futures), desc="处理", unit="篇", ncols=80) as pbar:
                for future in as_completed(futures):
                    try:
                        papers.append(future.result())
                    except:
                        pass
                    pbar.update(1)

        papers.sort(key=lambda x: x.get("published_date", ""), reverse=True)
        return papers

    def process_single(self, meta: Dict) -> Dict:
        """处理单条论文数据"""
        return meta

    # 保存结果
    def save_to_json(self, output_file: str):
        """保存结果到JSON文件"""
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(self.papers, f, ensure_ascii=False, indent=2)
        print(f"结果已保存到: {output_file}")

    # 运行入口
    def main(self) -> List[Dict]:
        date_str = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")
        output_file = f"papers__{date_str}.json"
        papers = self.fetch_papers()

        if papers:
            self.save_to_json(output_file)
            print(f"总论文数: {len(papers)}, 保存至: {output_file}")
        else:
            print("未找到论文")

        return papers


if __name__ == "__main__":
    crawler = DailyCrawler(
        query="人工智能"
    )
    crawler.main()
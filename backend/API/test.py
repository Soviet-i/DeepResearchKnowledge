"""使用 SSE 方式调用 Dify 接口并流式打印回复。"""

import json
import os

from config import url, headers, data, DEFAULT_PDF_IDS, PDF_IDS
from file_tool import init_output_file
from sse_client import stream_post_request

# 如果为True，只会生成test.md，为False的话会生成带日期的.md
if_test = False


def write_pdfs_to_test(
    pdf_ids=None,
    pdf_db_relative_path=os.path.join("pdf_database", "pdf_data.json"),
    output_relative_path=os.path.join("input", "test.json"),
):
    """
    根据给定的 pdf_id 列表，从 pdf_database/pdf_data.json 中取出对应的
    pdf_id 和 pdf_abstract，并按 input/test.json 的格式写入（覆盖写入）。
    若未传入 pdf_ids，则使用 config.TEST_PDF_IDS。
    """
    if pdf_ids is None:
        pdf_ids = DEFAULT_PDF_IDS
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_db_path = os.path.join(base_dir, pdf_db_relative_path)
    output_path = os.path.join(base_dir, output_relative_path)

    with open(pdf_db_path, "r", encoding="utf-8") as f:
        pdf_db = json.load(f)

    # pdf_database/pdf_data.json 是一个列表，每个元素是 {"pdf_id": ..., "pdf_abstract": ...}
    index = {item.get("pdf_id"): item for item in pdf_db}

    pdfs = []
    for pid in pdf_ids:
        item = index.get(pid)
        if item:
            pdfs.append(
                {
                    "pdf_id": item.get("pdf_id"),
                    "pdf_abstract": item.get("pdf_abstract"),
                }
            )

    data_to_write = {"pdfs": pdfs}

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data_to_write, f, ensure_ascii=False, indent=4)


def add_abstract_list_from_input(
    input_relative_path=os.path.join("input", "test.json"),
):
    """
    从 input/test.json 读取内容，并把其 JSON 内容赋值到 data['inputs']['abstract_list'] 中（与 max_loop 同级）。
    该 JSON 内容需符合 abstract_list 的 Schema:
    {
        "pdfs": [
            {
                "pdf_id": "...",
                "pdf_abstract": "..."
            },
            ...
        ]
    }
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_dir, input_relative_path)

    # 默认结构，防止 JSON 为空或解析失败导致程序崩溃
    default_abstract_list = {"pdfs": []}

    if not os.path.exists(input_path):
        abstract_list = default_abstract_list
    else:
        try:
            with open(input_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    abstract_list = default_abstract_list
                else:
                    abstract_list = json.loads(content)
        except (json.JSONDecodeError, OSError):
            abstract_list = default_abstract_list

    data["inputs"]["abstract_list"] = abstract_list
    return data


if __name__ == "__main__":
    # 使用 config.py 中的默认配置发起一次请求
    # 流式输出并流式追加写入 .md 文件
    write_pdfs_to_test(PDF_IDS)  # 使用 config.中的pdf
    add_abstract_list_from_input()
    file = init_output_file(if_test, "chat_report", file_ext=".md")
    print(data)
    answer = stream_post_request(url, headers, data, output_file=file, output_format="md")
    file.close()
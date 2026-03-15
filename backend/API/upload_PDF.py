"""演示如何上传多个 PDF 并结合内容进行对话。支持配置为路径或 file_id 列表，批量处理。"""

import os
import re
from pathlib import Path

import requests

from config import (
    DEFAULT_USER_ID,
    pdf_api_key,
    pdf_chat_url,
    pdf_default_query,
    pdf_file_list,
    pdf_input_files_key,
    pdf_upload_url,
)
from sse_client import stream_post_request

# 简单判断是否为 UUID 格式的 file_id（避免把路径当 id 用）
UUID_PATTERN = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)


def is_file_id(s: str) -> bool:
    """判断字符串是否为已上传文件的 id（UUID），否则视为本地路径。"""
    return bool(UUID_PATTERN.match(s.strip()))


def upload_file(file_path: str) -> str:
    """上传单个 PDF，返回 upload_file_id。"""
    p = Path(file_path)
    if not p.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    print(f"[上传PDF] {p.name}  ({p})")
    with p.open("rb") as f:
        files = {"file": (p.name, f, "application/pdf")}
        data = {"user": DEFAULT_USER_ID}
        headers = {"Authorization": f"Bearer {pdf_api_key}"}
        resp = requests.post(pdf_upload_url, headers=headers, files=files, data=data)
    if not (200 <= resp.status_code < 300):
        raise RuntimeError(f"上传失败: {resp.status_code}, {resp.text}")
    fid = resp.json().get("id")
    print(f"[上传成功] {p.name} -> id={fid}")
    return fid


def resolve_file_ids(entries: list[str]) -> list[str]:
    """将配置列表（路径或 file_id）解析为 upload_file_id 列表。路径会先上传。"""
    ids = []
    for item in entries:
        s = (item or "").strip()
        if not s:
            continue
        if is_file_id(s):
            print(f"[使用已有ID] {s}")
            ids.append(s)
        else:
            ids.append(upload_file(s))
    return ids


def build_chat_payload(upload_ids: list[str], query: str) -> dict:
    """构造 chat-messages 请求体。顶层 files 必传；若配置了 pdf_input_files_key 则同时写入 inputs，供工作流开始节点使用。"""
    file_objs = [
        {"type": "document", "transfer_method": "local_file", "upload_file_id": fid}
        for fid in upload_ids
    ]
    inputs = {}
    if (pdf_input_files_key or "").strip():
        inputs[pdf_input_files_key.strip()] = file_objs
    return {
        "inputs": inputs,
        "query": query,
        "response_mode": "streaming",
        "conversation_id": "",
        "user": DEFAULT_USER_ID,
        "files": file_objs,
    }


if __name__ == "__main__":
    if not pdf_file_list:
        raise ValueError("PDF_FILE_LIST 不能为空，请至少配置一个路径或 file_id")
    upload_ids = resolve_file_ids(pdf_file_list)
    print(f"将使用 {len(upload_ids)} 个文件进行对话: {upload_ids}")
    data = build_chat_payload(upload_ids, pdf_default_query)
    headers = {"Authorization": f"Bearer {pdf_api_key}", "Content-Type": "application/json"}

    # 统一把摘要写入项目根目录下的 pdf_database/pdf_data.json 中
    db_dir = Path(os.path.abspath(os.curdir)) / "pdf_database"
    db_path = db_dir / "pdf_data.json"

    # 不再为每次运行生成单独的 PDF_report_xxx.json 文件，
    # 而是在 workflow_finished 时把所有摘要写入/追加到 pdf_data.json 中
    stream_post_request(
        pdf_chat_url,
        headers,
        data,
        output_file=None,
        output_format="json",
        json_path=str(db_path),
    )

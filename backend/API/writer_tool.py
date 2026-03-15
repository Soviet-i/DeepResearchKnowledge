from typing import Dict, TextIO, List
import json
import os
import re

# 定义将哪些标签中间的文件写入文档
OPEN_TAG = ("<chapter_content>")
CLOSE_TAGS = ("<\\chapter_content>", "</chapter_content>")


def write_chapter_content_only(chunk: str, state: Dict[str, object], file: TextIO) -> None:
    """state 为 {'buffer': str, 'inside': bool}，仅把标签间内容写入 file。"""
    if not file or not chunk:
        return
    buf, state["buffer"] = state["buffer"] + chunk, ""
    inside = bool(state["inside"])
    while True:
        if not inside:
            i = buf.find(OPEN_TAG)
            if i == -1:
                state["buffer"] = buf[-(len(OPEN_TAG) - 1) :] if len(buf) >= len(OPEN_TAG) else buf
                break
            buf, inside = buf[i + len(OPEN_TAG) :], True
        else:
            j, close_len = -1, 0
            for c in CLOSE_TAGS:
                p = buf.find(c)
                if p >= 0 and (j < 0 or p < j):
                    j, close_len = p, len(c)
            if j < 0:
                n = max(len(c) for c in CLOSE_TAGS) - 1
                if len(buf) > n:
                    file.write(buf[:-n])
                    file.flush()
                    state["buffer"] = buf[-n:]
                else:
                    state["buffer"] = buf
                break
            file.write(buf[:j] + "\n")
            file.flush()
            buf, inside = buf[j + close_len :], False
    state["inside"] = inside


def write_abstract(chunk: str, json_path: str) -> None:
    """
    从 chunk 中提取 <pdf_id> 和 <pdf_abstract> 标签内容，并写入 / 追加到 json 文件。

    说明：
    - <pdf_id>...</pdf_id> / <pdf_id>...<\\pdf_id> 之间的是 pdf_id
    - <pdf_abstract>...</pdf_abstract> / <pdf_abstract>...<\\pdf_abstract> 之间的是摘要
    - 一个 pdf_id 对应一个 pdf_abstract
    - 输出 JSON 结构为：[{ "pdf_id": "...", "pdf_abstract": "..." }, ...]
    - 多次写入同一个 pdf_id 时，将以「最后一次」为准进行覆盖，不会产生重复记录
    """
    if not chunk or not json_path:
        return

    # 同时兼容 </pdf_id> 和 <\pdf_id> 这两种写法
    pdf_id_pattern = re.compile(r"<pdf_id>(.*?)</pdf_id>|<pdf_id>(.*?)<\\pdf_id>", re.DOTALL)
    pdf_abs_pattern = re.compile(r"<pdf_abstract>(.*?)</pdf_abstract>|<pdf_abstract>(.*?)<\\pdf_abstract>", re.DOTALL)

    raw_ids = pdf_id_pattern.findall(chunk)
    raw_abs = pdf_abs_pattern.findall(chunk)

    pdf_ids = [(a or b).strip() for a, b in raw_ids if (a or b)]
    pdf_abstracts = [(a or b).strip() for a, b in raw_abs if (a or b)]

    # 对齐长度，避免数量不一致导致越界
    n = min(len(pdf_ids), len(pdf_abstracts))
    new_records: List[Dict[str, str]] = [
        {"pdf_id": pdf_ids[i], "pdf_abstract": pdf_abstracts[i]}
        for i in range(n)
    ]

    if not new_records:
        return

    # 确保目录存在（例如 pdf_database 目录）
    os.makedirs(os.path.dirname(json_path), exist_ok=True)

    # 读入已有数据（若文件存在），并进行去重合并
    existing: List[Dict[str, str]] = []
    if os.path.exists(json_path) and os.path.getsize(json_path) > 0:
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                loaded = json.load(f)
                if isinstance(loaded, list):
                    existing = [x for x in loaded if isinstance(x, dict)]
        except json.JSONDecodeError:
            existing = []

    merged: Dict[str, Dict[str, str]] = {}
    for item in existing:
        pid = str(item.get("pdf_id", "")).strip()
        if not pid:
            continue
        merged[pid] = {"pdf_id": pid, "pdf_abstract": str(item.get("pdf_abstract", ""))}

    for item in new_records:
        pid = str(item.get("pdf_id", "")).strip()
        if not pid:
            continue
        merged[pid] = {"pdf_id": pid, "pdf_abstract": str(item.get("pdf_abstract", ""))}

    final_list = list(merged.values())

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)

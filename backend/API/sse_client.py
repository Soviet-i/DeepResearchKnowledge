import json
from typing import Optional, Dict, Any, TextIO

import requests
from requests.exceptions import ChunkedEncodingError
from urllib3.exceptions import ProtocolError

from writer_tool import write_chapter_content_only, write_abstract


def parse_sse_line(line: Optional[bytes]) -> Optional[str]:
    """解析 SSE 流中的一行，只提取 data 部分。"""
    if not line:
        return None

    text = line.decode("utf-8").strip()
    if text.startswith("data: "):
        # 只关心包含模型输出内容的 data 行
        return text[6:]
    return None


def handle_event(
    event_data: Dict[str, Any],
    output_file: Optional[TextIO] = None,
    chapter_state: Optional[Dict[str, object]] = None,
    output_format: str = "md",
    json_state: Optional[Dict[str, str]] = None,
    json_path: Optional[str] = None,
) -> Optional[str]:
    """
    处理不同类型的事件。

    - 当 output_format == "md" 时：行为与原来一致，支持只写入 <chapter_content> 标签中的内容到 .md
    - 当 output_format == "json" 时：仅在工作流结束时，使用 write_abstract 将最终答案写入 JSON 文件
    """
    event_type = event_data.get("event")

    if event_type == "message":
        answer = event_data.get("answer", "")
        print(answer, end="", flush=True)
        if not answer:
            return None

        # md 模式：保持原有流式写入行为
        if output_format == "md" and output_file:
            if chapter_state is not None:
                write_chapter_content_only(answer, chapter_state, output_file)
            else:
                output_file.write(answer)
                output_file.flush()

        # json 模式：不立刻写文件，先把所有 message 文本累积到 json_state 中，
        # 等 workflow_finished 再统一交给 write_abstract 解析并写入 json 文件
        if output_format == "json" and json_state is not None:
            buf = json_state.get("buffer", "")
            json_state["buffer"] = buf + answer

    elif event_type == "node_finished":
        # print("节点完成")
        print(f'\n[节点完成] {event_data.get("data", {}).get("title", "")}')

    elif event_type == "workflow_finished":
        print("\n[工作流完成]")
        # 优先兼容原有结构中的 outputs.answer
        final_answer = event_data.get("data", {}).get("outputs", {}).get("answer", "") or ""

        # json 模式下，优先使用累积的所有 message 文本（通常包含我们自定义的 <pdf_id> / <pdf_abstract> 标签）
        content_for_json = final_answer
        if output_format == "json" and json_state is not None:
            buf = json_state.get("buffer", "")
            if buf:
                content_for_json = buf + final_answer

        if content_for_json and output_format == "json":
            # 优先使用显式传入的 json_path，其次尝试从 output_file.name 获取
            target_path = json_path
            if not target_path and output_file is not None:
                target_path = getattr(output_file, "name", None)

            if target_path:
                write_abstract(content_for_json, target_path)
            return content_for_json or final_answer
    elif event_type == "message_end":
        print("\n[消息结束]")
    return None


def stream_post_request(
    url: str,
    headers: Dict[str, str],
    data: Dict[str, Any],
    output_file: Optional[TextIO] = None,
    output_format: str = "md",
    json_path: Optional[str] = None,
) -> Optional[str]:
    """
    发送流式POST请求并处理SSE响应。

    - 当 output_format == "md" 且提供 output_file 时：仅将 <chapter_content> 间内容流式写入 .md 文件
    - 当 output_format == "json" 且提供 output_file 时：在工作流结束后使用 write_abstract 将最终答案写入 .json 文件
    """
    response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return None

    chapter_state: Optional[Dict[str, object]] = {"buffer": "", "inside": False} if (output_file and output_format == "md") else None
    json_state: Optional[Dict[str, str]] = {"buffer": ""} if output_format == "json" else None
    final_answer: Optional[str] = None

    try:
        for line in response.iter_lines():
            parsed = parse_sse_line(line)
            if parsed and isinstance(parsed, str) and parsed.strip():
                try:
                    event_data = json.loads(parsed)
                    result = handle_event(
                        event_data,
                        output_file=output_file,
                        chapter_state=chapter_state,
                        output_format=output_format,
                        json_state=json_state,
                        json_path=json_path,
                    )
                    if result:
                        final_answer = result
                except json.JSONDecodeError:
                    print(f"Received: {parsed}")
    except (ChunkedEncodingError, ProtocolError) as e:
        print(f"\n[流式连接中断] {e}")
        # 如果需要，可以在这里根据已经获取的内容返回 partial answer
    return final_answer

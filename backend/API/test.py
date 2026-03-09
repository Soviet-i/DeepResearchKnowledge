"""使用 SSE 方式调用 Dify 接口并流式打印回复。"""
import json
import requests
import re
import os, pathlib, datetime
from config import url, headers, data

# 如果为True，只会生成test.md，为False的话会生成带日期的.md
if_test = False

# 初始化要输出的文件
def init_output_file(use_testfile, file_name=""):
    directory = pathlib.Path(os.path.abspath(os.curdir)) / 'output'
    if(not os.path.exists(directory)):
        os.makedirs(directory)

    safe = re.sub(r'[^0-9A-Za-z\u4e00-\u9fff\-_]+', '_', (file_name or "").strip()).strip('_')
    prefix = f"{safe}_" if safe else ""
    base = "test" if use_testfile else datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    file_directory = directory / f"{prefix}{base}.md"
    return open(file_directory, 'a', encoding='utf-8')

# 仅将 <chapter_content> 与 <\chapter_content> 之间的内容流式写入 file
OPEN_TAG, CLOSE_TAGS = "<chapter_content>", ("<\\chapter_content>", "</chapter_content>")

def write_chapter_content_only(chunk, state, file):
    """state 为 {'buffer': str, 'inside': bool}，仅把标签间内容写入 file。"""
    if not file or not chunk:
        return
    buf, state["buffer"] = state["buffer"] + chunk, ""
    inside = state["inside"]
    while True:
        if not inside:
            i = buf.find(OPEN_TAG)
            if i == -1:
                state["buffer"] = buf[-(len(OPEN_TAG) - 1):] if len(buf) >= len(OPEN_TAG) else buf
                break
            buf, inside = buf[i + len(OPEN_TAG):], True
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
            buf, inside = buf[j + close_len:], False
    state["inside"] = inside


def parse_sse_line(line):
    """解析 SSE 流中的一行，只提取 data 部分。"""
    if not line:
        return None

    text = line.decode("utf-8").strip()
    if text.startswith("data: "):
        # 只关心包含模型输出内容的 data 行
        return text[6:]
    return None


# 解析返回的json，进行print流式输出；若有 output_file+chapter_state 则仅将标签间内容流式写入 .md
def handle_event(event_data, output_file=None, chapter_state=None):
    """处理不同类型的事件。提供 output_file 与 chapter_state 时，仅写入 <chapter_content> 与 <\\chapter_content> 之间的内容。"""
    event_type = event_data.get('event')

    if event_type == 'message':
        answer = event_data.get('answer', '')
        print(answer, end='', flush=True)
        if output_file and answer:
            if chapter_state is not None:
                write_chapter_content_only(answer, chapter_state, output_file)
            else:
                output_file.write(answer)
                output_file.flush()
        
    elif event_type == 'node_finished':
        # print("节点完成")
        print(f"\n[节点完成] {event_data.get('data', {}).get('title', '')}")
        
    elif event_type == 'workflow_finished':
        print("\n[工作流完成]")
        final_answer = event_data.get('data', {}).get('outputs', {}).get('answer', '')
        if final_answer:
            return final_answer
    elif event_type == 'message_end':
        print("\n[消息结束]")


# 发送POST请求并处理响应，调用parse_sse_line来爬取响应中的数据类型，然后把数据传递给handle_event进行输出
def stream_post_request(url, headers, data, output_file=None):
    """发送流式POST请求并处理SSE响应。若提供 output_file，则仅将 <chapter_content> 间内容流式写入。"""
    response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return

    chapter_state = {"buffer": "", "inside": False} if output_file else None
    final_answer = None
    for line in response.iter_lines():
        parsed = parse_sse_line(line)
        if parsed and isinstance(parsed, str) and parsed.strip():
            try:
                event_data = json.loads(parsed)
                result = handle_event(event_data, output_file, chapter_state)
                if result:
                    final_answer = result
            except json.JSONDecodeError:
                print(f"Received: {parsed}")
    return final_answer

if __name__ == "__main__":
    # 使用 config.py 中的默认配置发起一次请求
    # 流式输出并流式追加写入 .md 文件
    file = init_output_file(if_test,"chat_report")
    answer = stream_post_request(url, headers, data, output_file=file)
    file.close()  
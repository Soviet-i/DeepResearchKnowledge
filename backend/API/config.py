# ==========================
# 用户需调整的配置项（常改）
# ==========================

# 报告生成
# 智能体 API Key
REPORT_API_KEY = "app-juZqzwuwgRmaRcitqq8QGCOx"
# 报告生成提问
REPORT_DEFAULT_QUERY = "什么是RAG？"
# 报告生成的循环次数上限（max_loop一般大于5，不然智能体可能写不出完整的文献，比如漏写"结论"部分）
REPORT_LOOP_NUM = 10
# 报告生成时使用的 PDF 列表：从 pdf_database/pdf_data.json 中按 pdf_id 选取，写入 input/test.json
PDF_IDS = [
    "23e5d100-fd78-447e-afd8-edd50e44196b",
    "0eab7c47-e3c0-439c-907d-3aed554cc7c5",
    # "b738aaa0-d803-4b0f-a1e6-981c7eeae5ea",
    # "8583b930-523d-430b-b187-10fddd8d81bc",
    # "ad009669-337b-4982-acfa-873b37ee71c7",
    # "c4c8a8c6-021a-4159-953a-bb76846a66d4",
]

# PDF 上传
# PDF 总结摘要 API Key
PDF_API_KEY = "app-VaXWLYnGf6Bki5w4RDirHikD"
# PDF 总结提问
PDF_DEFAULT_QUERY = "请总结这些文献的内容。"
# 文件列表：每项为本地PDF路径或已上传的file_id。支持批量处理。
PDF_FILE_LIST = [
    r"D:\233\zotero_notes\storage\9L6TQRPA\Li 等 - 2025 - DeepAgent A General Reasoning Agent with Scalable Toolsets.pdf",
    r"D:\233\zotero_notes\storage\RUAKSCG8\Chen 等 - 2024 - Plan-on-Graph Self-Correcting Adaptive Planning of Large Language Model on Knowledge Graphs.pdf",
    r"D:\MR\Desktop\PPoGA.pdf",

    # "ad009669-337b-4982-acfa-873b37ee71c7",
    # "c4c8a8c6-021a-4159-953a-bb76846a66d4",
]
# 若要从本地路径上传，可改为例如：
# PDF_FILE_LIST = [
#     r"D:\MR\Desktop\科研文件\NeurIPS 2025 - WebThinker- Empowering Large Reasoning Models with Deep Research Capability.pdf"
# ]

# 文件变量的键名，需与智能体的键名一致，先不要修改这个。
PDF_INPUT_FILES_KEY = "PDF"

# ==========================
# 固定配置（一般不改）
# ==========================

# 默认用户标识（本地/线上都可以共用）
DEFAULT_USER_ID = "abc-123"

# 报告生成使用的接口地址（常见：
# - 线上工作流
ONLINE_WORKFLOW_RUN_URL = "https://api.dify.ai/v1/workflows/run"
# - 线上多轮对话
ONLINE_CHAT_MESSAGES_URL = "https://api.dify.ai/v1/chat-messages"

# 本地多轮对话接口常量（供参考）
LOCAL_CHAT_MESSAGES_URL = "http://localhost/v1/chat-messages"

# PDF 上传接口（本地 Dify 通常为 http://localhost/v1/files/upload）
LOCAL_PDF_UPLOAD_URL = "http://localhost/v1/files/upload"
# PDF 对话接口（本地 Dify 通常为 http://localhost/v1/chat-messages）
LOCAL_PDF_CHAT_URL = "http://localhost/v1/chat-messages"
# PDF线上接口
ONLINE_PDF_UPLOAD_URL = "https://api.dify.ai/v1/files/upload"
ONLINE_PDF_CHAT_URL = "https://api.dify.ai/v1/chat-messages"

# （主要给 test.py 使用）
url = ONLINE_CHAT_MESSAGES_URL
api_key = REPORT_API_KEY
query = REPORT_DEFAULT_QUERY
loop_num = REPORT_LOOP_NUM
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}
data = {
    "inputs": {"max_loop": loop_num},
    "query": query,
    "response_mode": "streaming",
    "conversation_id": "",
    "user": DEFAULT_USER_ID,
    "files": [],
}

# （主要给 test_PDF.py 使用）
DEFAULT_PDF_IDS = [
    "ad009669-337b-4982-acfa-873b37ee71c7",
    "c4c8a8c6-021a-4159-953a-bb76846a66d4",
]
pdf_chat_url = ONLINE_PDF_CHAT_URL
pdf_upload_url = ONLINE_PDF_UPLOAD_URL
pdf_api_key = PDF_API_KEY
pdf_default_query = PDF_DEFAULT_QUERY
pdf_file_list = PDF_FILE_LIST
pdf_input_files_key = PDF_INPUT_FILES_KEY
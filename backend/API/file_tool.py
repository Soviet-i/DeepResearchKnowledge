import os
import pathlib
import datetime
import re


def init_output_file(use_testfile: bool, file_name: str = "", file_ext: str = ".md"):
    """
    初始化输出文件。

    - 默认创建 markdown 文件（.md）
    - 通过 file_ext 可以切换为 .json 等其它后缀，用于与 write_abstract 搭配写 JSON
    """
    directory = pathlib.Path(os.path.abspath(os.curdir)) / "output"
    if not os.path.exists(directory):
        os.makedirs(directory)

    safe = re.sub(r"[^0-9A-Za-z\u4e00-\u9fff\-_]+", "_", (file_name or "").strip()).strip("_")
    prefix = f"{safe}_" if safe else ""
    base = "test" if use_testfile else datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    ext = file_ext if file_ext.startswith(".") else f".{file_ext}"
    file_directory = directory / f"{prefix}{base}{ext}"
    return open(file_directory, "a", encoding="utf-8")


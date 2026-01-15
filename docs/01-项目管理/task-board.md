协作成员与分支验收指南



本文档用于指导新增协作成员、创建个人分支、提交验收指标，以及将可运行分支合并到 `main`。



&nbsp;一、在 GitHub 远程仓库添加协作成员



> 需仓库管理员/拥有者权限



1\. 打开 GitHub 仓库主页。

2\. 进入 Settings → Collaborators and teams。

3\. 点击 Add people，输入对方 GitHub 用户名或邮箱。

4\. 选择权限（建议：普通协作者使用 Write 权限）。

5\. 发送邀请，对方接受即可加入。



&nbsp;二、协作者创建个人分支（以本地 Git 为例）



bash

1\) 克隆仓库（首次）

git clone <repo-url>

cd RedSeeker



2\) 基于 main 创建个人分支（推荐：姓名/模块）

git checkout main

git pull



git checkout -b <name>/<module>



3\) 提交改动并推送

git add .

git commit -m "<module>: 简要描述"



git push -u origin <name>/<module>





> 分支命名建议：姓名/模块，例如 yang/recommend、niu/frontend。



三、合并到 main 的流程



1\. 协作者在自己的分支上提交代码并推送。

2\. 发起 Pull Request（目标分支：main）。

3\. 由负责人或指定 reviewer 根据 验收指标 进行检查。

4\. 确认可运行后执行合并：

&nbsp;  - 推荐使用 Squash and merge 或 Merge commit。

5\. 合并后删除远程分支（保持仓库整洁）。



---



如需额外标准，可在后续迭代中补充到本指南。


# 介绍
这是深知的智能体部分。综述生成程序参考了WebThinker的"搜索-思考-写作"策略；PDF预处理程序为综述生成程序提供摘要数据。
# Quick Start
### 根据多篇论文生成综述
python test.py
### PDF预处理
python upload_PDF.py
# 详细说明
1. 综述生成程序会从pdf_data.json中选取数篇论文(可在config.py中修改)，整合到test.json中发送给智能体。运行后，会在ouput目录下生成.md报告。(报告是流式生成的，模型输出会实时追加到报告中)
2. PDF预处理运行后，会修改pdf_database目录下的pdf_data.json文件，将新的pdf摘要记录在.json数据库中(综述生成会用到)
3. 配置请在config.py中修改，里面有详细的注释说明
4. 我的智能体暂时部署在线上，方便其它同学快速通过代码调用API来使用，会消耗我的token额度，所以请不要高强度地使用API。（智能体部署在Dify上，Dify部署在Docker上，如果另一位同学要本地部署智能体的话要配很多的环境，还要注册多种API，很不方便）
5. 智能体使用的主模型为Kimi-k2.5，辅助模型为Qwen2.5-Instruct-32B
## ![](https://file+.vscode-resource.vscode-cdn.net/d%3A/workdir/js-project/glyph-code-tools/screenshot-20251231-182944.png?version%3D1767177528555)

## AI驱动的需求到代码生成平台

通过对话收集需求 → 智能分解任务 → 自动生成代码的完整开发工作流

## 项目概述

本工具是一个AI辅助编程Web工具，核心逻辑是：

*   智能对话收集用户需求
*   自动分解需求为具体开发任务
*   执行任务生成可用代码
*   迭代优化基于反馈调整实现

## 核心特性

*   智能需求收集
*   自然语言对话接口，理解模糊需求
*   多轮问答澄清需求细节
*   自动识别技术约束和业务目标

## 智能任务分解

*   将复杂需求拆解为可执行开发任务
*   自动评估任务优先级和依赖关系
*   生成详细的任务清单和开发路线图

## 自动代码生成

*   基于分解的任务生成对应代码
*   支持多种编程语言和框架
*   保持代码风格一致性

## 迭代优化

*   根据用户反馈调整实现
*   支持增量式功能添加
*   代码重构和优化建议

## 本地部署

```
1. 克隆仓库
git clone https://github.com/GlyphCode/glyph-code-tools.git
cd glyph-code-tools

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run start

# 5. 在浏览器中打开
open http://localhost:4200
```

## 首次使用指南

*   开始对话：点击"开始新项目"按钮
*   描述需求：用自然语言描述您想构建的功能
*   澄清细节：回答AI的提问以明确需求
*   确认需求
*   任务分解：查看自动生成的任务分解
*   生成代码：AI开始执行任务并生成代码
*   在线调试：编译部署并在线修改代码
*   下载使用：将生成的代码集成到您的项目

## 技术栈

*   前端：angular + TypeScript
*   后端：go
*   AI引擎：qwen3-max
*   数据库：mysql / es
*   部署：Docker + Kubernetes

## 支持与反馈

\[支持邮箱\]（GlyphCode@163.com）  
[问题报告](https://github.com/GlyphCode/glyph-code-tools/issues)
# nanobot 项目分析

## 项目概述

**nanobot** 是一个受 OpenClaw 启发的超轻量级个人 AI 助手项目。该项目的核心特点是使用仅约 **4,000 行代码**实现了完整的 AI 代理功能，比 Clawdbot 的 43 万行代码减少了 **99%**。

- **项目地址**: https://github.com/HKUDS/nanobot
- **最新版本**: v0.1.3.post6
- **核心代码量**: 约 3,510 行（实际统计）

---

## 一、核心功能 (Core Features)

### 1.1 主要功能模块

#### 📈 **24/7 实时市场分析**
- 持续监控市场动态
- 提供实时洞察和趋势分析
- 发现关键信息点

#### 🚀 **全栈软件工程师**
- 代码开发能力
- 部署和扩展支持
- 完整的软件开发生命周期管理

#### 📅 **智能日程管理器**
- 自动化任务调度
- 定时任务执行（Cron 支持）
- 智能提醒和组织

#### 📚 **个人知识助手**
- 学习和记忆功能
- 推理能力
- 长期上下文保持

### 1.2 核心特性

🪶 **超轻量级**
- 核心代理代码仅约 4,000 行
- 比传统 AI 助手小 99%
- 极低的资源占用

🔬 **研究友好**
- 代码清晰易读
- 容易理解、修改和扩展
- 适合学术研究和实验

⚡️ **极速性能**
- 快速启动
- 低资源使用
- 快速迭代开发

💎 **易于使用**
- 一键部署
- 2 分钟内即可运行
- 简单的配置流程

---

## 二、核心技术栈 (Technical Stack)

### 2.1 编程语言与框架

#### **Python 生态**
- **核心语言**: Python
- **依赖管理**: pip, uv (推荐)
- **打包发布**: PyPI (nanobot-ai)

### 2.2 大语言模型集成

#### **多 Provider 架构**
nanobot 支持多种 LLM 提供商，通过统一的 Provider Registry 管理：

1. **OpenRouter** (推荐 - 全球用户)
   - 访问所有主流模型
   - 包括 Claude Opus 4.5, GPT-4 等

2. **本地模型支持**
   - vLLM 集成
   - 支持任何 OpenAI 兼容服务器
   - 可运行 Llama, Qwen 等开源模型

3. **直接 API 支持**
   - Anthropic (Claude)
   - OpenAI (GPT)
   - DeepSeek
   - Groq (包含 Whisper 语音转录)
   - Google Gemini
   - MiniMax
   - Zhipu (智谱 GLM)
   - Moonshot (Kimi)
   - Qwen (通灵千问)

4. **API 网关**
   - AiHubMix
   - OpenRouter

### 2.3 通信渠道集成

#### **多平台支持**
- **Telegram** (推荐 - 最简单)
- **Discord** (Bot token + intents)
- **WhatsApp** (扫码登录)
- **Feishu/飞书** (WebSocket 长连接)
- **Mochat** (WebSocket)
- **DingTalk/钉钉** (Stream Mode)
- **Slack** (Socket Mode)
- **Email** (IMAP/SMTP)
- **QQ** (私聊支持)

所有渠道都支持 **无需公网 IP** 的部署方式（WebSocket/长连接模式）。

### 2.4 技术特性

#### **LiteLLM 集成**
- 统一的 LLM 接口抽象
- 自动模型名称前缀处理
- 环境变量自动配置

#### **工具系统**
- Shell 命令执行
- 文件读写编辑
- Spawn 子代理
- 自定义技能系统

#### **持久化存储**
- 会话管理
- 记忆系统
- 配置文件 (~/.nanobot/config.json)

#### **任务调度**
- Cron 表达式支持
- 自然语言任务调度
- 后台任务执行（subagent）

---

## 三、架构设计 (Architecture)

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Chat Channels                        │
│  Telegram | Discord | WhatsApp | Feishu | Email | ...  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Gateway / Bus                         │
│              Message Routing & Distribution             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Agent Core Loop                        │
│         LLM ↔ Tool Execution ↔ Context Building        │
└─────┬──────────────────────────────────┬────────────────┘
      │                                  │
      ▼                                  ▼
┌──────────────┐                  ┌──────────────┐
│  Tools       │                  │  Memory &    │
│  - Shell     │                  │  Session     │
│  - File Ops  │                  │  Management  │
│  - Skills    │                  │              │
│  - Spawn     │                  │              │
└──────────────┘                  └──────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────┐
│              Provider Registry                          │
│    OpenRouter | Anthropic | OpenAI | vLLM | ...        │
└─────────────────────────────────────────────────────────┘
```

### 3.2 项目目录结构

```
nanobot/
├── agent/          # 🧠 核心代理逻辑
│   ├── loop.py     #    代理循环 (LLM ↔ 工具执行)
│   ├── context.py  #    提示词构建器
│   ├── memory.py   #    持久化记忆
│   ├── skills.py   #    技能加载器
│   ├── subagent.py #    后台任务执行
│   └── tools/      #    内置工具 (包括 spawn)
├── skills/         # 🎯 内置技能 (github, weather, tmux...)
├── channels/       # 📱 聊天渠道集成
├── bus/            # 🚌 消息路由
├── cron/           # ⏰ 定时任务
├── heartbeat/      # 💓 主动唤醒
├── providers/      # 🤖 LLM 提供商 (OpenRouter 等)
├── session/        # 💬 会话管理
├── config/         # ⚙️ 配置管理
└── cli/            # 🖥️ 命令行接口
```

### 3.3 核心组件详解

#### **1. Agent Core (代理核心)**

**loop.py - 代理循环**
- 实现 LLM 和工具执行的循环交互
- 管理对话上下文
- 处理工具调用和结果

**context.py - 上下文构建**
- 构建发送给 LLM 的提示词
- 管理系统提示和用户消息
- 组织工具描述和历史记录

**memory.py - 记忆系统**
- 持久化重要对话信息
- 跨会话记忆保持
- 知识积累

**subagent.py - 子代理**
- 后台任务并行执行
- 独立的代理实例
- 支持长时间运行的任务

#### **2. Tools (工具系统)**

提供代理可以调用的各种能力：
- **Shell**: 执行命令行命令
- **File Operations**: 文件读写、列表、编辑
- **Spawn**: 创建子代理
- **Skills**: 可扩展的技能系统

#### **3. Channels (通信渠道)**

统一的接口抽象：
- 消息接收和发送
- 认证和权限控制 (allowFrom)
- 多种连接模式 (WebSocket, HTTP, IMAP/SMTP)

#### **4. Bus (消息总线)**

- 在通道和代理之间路由消息
- 会话管理
- 消息队列和分发

#### **5. Provider Registry (提供商注册表)**

**核心设计理念**：
- 单一数据源 (Single Source of Truth)
- 添加新提供商只需 2 步
- 无需修改 if-elif 链
- 自动处理环境变量、模型前缀、配置匹配

**ProviderSpec 结构**：
```python
ProviderSpec(
    name="provider_name",           # 配置字段名
    keywords=("keyword1", "key2"),  # 模型名关键词
    env_key="PROVIDER_API_KEY",     # 环境变量
    display_name="Provider Name",   # 显示名称
    litellm_prefix="prefix",        # 模型前缀
    skip_prefixes=("prefix/",),     # 跳过前缀
    # 可选参数
    env_extras=(),                  # 额外环境变量
    model_overrides=(),             # 模型参数覆盖
    is_gateway=False,               # 是否为网关
)
```

#### **6. Session (会话管理)**

- 维护用户会话状态
- 对话历史记录
- 上下文持续性

#### **7. Cron (定时任务)**

- 支持 Cron 表达式
- 自然语言调度
- 周期性任务执行

#### **8. Heartbeat (心跳唤醒)**

- 主动任务触发
- 保持代理活跃
- 定期检查和提醒

### 3.4 数据流

#### **典型交互流程**：

```
1. 用户通过 Telegram 发送消息
   ↓
2. Telegram Channel 接收消息
   ↓
3. Bus 将消息路由到 Agent
   ↓
4. Agent Loop 处理：
   a. Context Builder 构建提示词
   b. 调用 LLM (通过 Provider)
   c. LLM 返回工具调用
   d. 执行工具（Shell/File/Spawn/Skills）
   e. 将工具结果反馈给 LLM
   f. 循环直到得到最终回复
   ↓
5. 回复通过 Bus 返回到 Channel
   ↓
6. Telegram 发送消息给用户
```

### 3.5 安全设计

#### **沙箱机制**
- `restrictToWorkspace`: 限制所有工具在工作空间目录内
- 防止路径遍历攻击
- 防止越界访问

#### **访问控制**
- `allowFrom`: 白名单机制
- 按用户 ID 限制访问
- 空列表 = 允许所有，非空 = 仅允许列表内用户

---

## 四、快速开始

### 4.1 安装

**从源码安装**（推荐，获取最新功能）：
```bash
git clone https://github.com/HKUDS/nanobot.git
cd nanobot
pip install -e .
```

**使用 uv 安装**（稳定，快速）：
```bash
uv tool install nanobot-ai
```

**从 PyPI 安装**（稳定）：
```bash
pip install nanobot-ai
```

### 4.2 配置

1. **初始化**：
```bash
nanobot onboard
```

2. **配置文件** (~/.nanobot/config.json)：
```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"
    }
  }
}
```

3. **开始使用**：
```bash
nanobot agent -m "What is 2+2?"
```

### 4.3 Docker 部署

```bash
# 构建镜像
docker build -t nanobot .

# 初始化配置
docker run -v ~/.nanobot:/root/.nanobot --rm nanobot onboard

# 运行网关
docker run -v ~/.nanobot:/root/.nanobot -p 18790:18790 nanobot gateway
```

---

## 五、技术亮点

### 5.1 极简设计哲学

- **代码量控制**：核心功能 ~4,000 行，易于理解和维护
- **模块化架构**：清晰的职责分离
- **可扩展性**：通过 Skills 和 Provider Registry 轻松扩展

### 5.2 Provider 架构创新

- **注册表模式**：避免硬编码的条件判断
- **自动配置**：环境变量、模型前缀自动处理
- **网关检测**：智能识别 API 网关（通过 key 前缀或 base URL）

### 5.3 无公网 IP 部署

- **WebSocket 长连接**：Feishu, QQ
- **Stream Mode**：DingTalk
- **Socket Mode**：Slack
- **轮询模式**：Email (IMAP)

完全避免了 webhook 的公网 IP 要求，降低部署门槛。

### 5.4 多模态支持

- **语音转录**：集成 Groq Whisper
- **Telegram 语音消息**：自动转录
- 未来支持图像和视频

### 5.5 Agent 社交网络

- **Moltbook**: 自动加入代理社区
- **ClawdChat**: 代理通信平台
- 只需发送一条消息即可加入

---

## 六、与其他项目对比

### nanobot vs Clawdbot

| 特性 | nanobot | Clawdbot |
|------|---------|----------|
| 代码量 | ~4,000 行 | 430,000+ 行 |
| 复杂度 | 极简 | 复杂 |
| 学习曲线 | 平缓 | 陡峭 |
| 适用场景 | 个人助手、研究 | 企业级应用 |
| 扩展性 | 高（简单架构） | 高（完整框架） |

### 核心优势

1. **研究友好**：代码少、易读，适合学术研究和实验
2. **快速迭代**：小代码库意味着快速修改和测试
3. **资源占用低**：适合个人部署，降低成本
4. **易于理解**：新手友好，快速上手

---

## 七、未来发展路线

### 已完成功能
- ✅ 多 LLM 提供商支持
- ✅ 本地模型集成 (vLLM)
- ✅ 9+ 通信渠道
- ✅ 定时任务（Cron）
- ✅ 技能系统
- ✅ 语音转录（Groq Whisper）
- ✅ Docker 支持

### 开发中功能
- 🚧 多模态能力增强（图像、视频）
- 🚧 长期记忆优化
- 🚧 更好的推理能力
- 🚧 更多集成（日历等）
- 🚧 自我改进机制

---

## 八、总结

**nanobot** 是一个充分体现"Less is More"哲学的 AI 代理项目。通过精心设计的架构和极简的代码实现，它证明了不需要庞大的代码库也能构建功能完整的 AI 助手。

### 核心价值

1. **教育价值**：作为学习 AI 代理架构的优秀范例
2. **研究价值**：适合快速原型开发和实验
3. **实用价值**：个人 AI 助手的完整解决方案
4. **参考价值**：展示了如何设计可扩展的插件系统

### 适用人群

- 🎓 **学生和研究者**：学习 AI 代理设计
- 👨‍💻 **开发者**：快速搭建个人 AI 助手
- 🔬 **实验者**：测试新想法和算法
- 📚 **爱好者**：了解现代 AI 应用架构

---

## 相关链接

- 📦 **GitHub**: https://github.com/HKUDS/nanobot
- 📘 **PyPI**: https://pypi.org/project/nanobot-ai/
- 💬 **讨论**: https://github.com/HKUDS/nanobot/discussions
- 🐛 **问题反馈**: https://github.com/HKUDS/nanobot/issues

---

*本文档最后更新: 2026-02-11*

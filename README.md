<div align="center">
  <h1>nano-claw</h1>
  <p>
    <strong>Ultra-Lightweight Personal AI Assistant</strong><br>
    <strong>超轻量级个人 AI 助手</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/typescript-5.x-blue" alt="TypeScript">
    <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="Node.js">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</div>

---

**English** | [中文](#中文文档)

## About

**nano-claw** is a TypeScript + Node.js implementation of [nanobot](https://github.com/HKUDS/nanobot), an ultra-lightweight personal AI assistant inspired by [OpenClaw](https://github.com/openclaw/openclaw).

🪶 **Ultra-Lightweight**: Minimal core code, 99% smaller than heavy frameworks

🔬 **Research-Ready**: Clean, readable code that's easy to understand and extend

⚡️ **Lightning Fast**: Minimal footprint for faster startup and lower resource usage

💎 **Easy-to-Use**: Simple configuration and intuitive CLI

## Architecture

```
nano-claw/
├── src/
│   ├── agent/          # 🧠 Core agent logic
│   │   ├── loop.ts     #    Agent loop (LLM ↔ tool execution)
│   │   ├── context.ts  #    Prompt builder
│   │   ├── memory.ts   #    Persistent memory
│   │   ├── skills.ts   #    Skills loader
│   │   ├── subagent.ts #    Background task execution
│   │   └── tools/      #    Built-in tools
│   ├── skills/         # 🎯 Bundled skills (github, weather, etc.)
│   ├── channels/       # 📱 Chat channel integrations
│   ├── bus/            # 🚌 Message routing
│   ├── cron/           # ⏰ Scheduled tasks
│   ├── heartbeat/      # 💓 Proactive wake-up
│   ├── providers/      # 🤖 LLM providers (OpenRouter, etc.)
│   ├── session/        # 💬 Session management
│   ├── config/         # ⚙️ Configuration
│   └── cli/            # 🖥️ Command-line interface
└── package.json
```

## Features

### Core Agent
- **Agent Loop**: LLM and tool execution loop
- **Context Builder**: Construct prompt context
- **Memory**: Persistent conversation memory
- **Skills Loader**: Dynamic skill loading from Markdown files
- **Subagent**: Background task management
- **Tools**: Built-in tools (shell, file operations, etc.)

### LLM Providers
Support for multiple LLM providers:
- OpenRouter (recommended, access to all models)
- Anthropic (Claude)
- OpenAI (GPT)
- DeepSeek
- Groq
- Gemini
- MiniMax
- Dashscope (Qwen)
- Moonshot (Kimi)
- Zhipu (GLM)
- vLLM (local models)

### Chat Channels
Support for multiple chat platforms:
- Telegram
- Discord
- WhatsApp
- Feishu (飞书)
- Slack
- Email
- QQ
- DingTalk (钉钉)
- Mochat

### Other Features
- **Message Bus**: Message routing and distribution
- **Cron Tasks**: Schedule tasks with cron expressions
- **Heartbeat**: Proactive wake-up mechanism
- **Session Management**: Multi-session support
- **Configuration**: JSON configuration files

## Installation

```bash
# Clone the repository
git clone https://github.com/hustcc/nano-claw.git
cd nano-claw

# Install dependencies
npm install

# Build the project
npm run build

# Link for global usage (optional)
npm link
```

## Quick Start

**1. Initialize**

```bash
nano-claw onboard
```

**2. Configure** (`~/.nano-claw/config.json`)

For OpenRouter (recommended):
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

**3. Chat**

```bash
nano-claw agent -m "What is 2+2?"
```

## CLI Commands

- `nano-claw onboard` - Initialize configuration
- `nano-claw agent -m "..."` - Chat with agent
- `nano-claw agent` - Interactive mode
- `nano-claw gateway` - Start gateway server
- `nano-claw status` - Show system status
- `nano-claw channels login` - Login to channels (e.g., WhatsApp)
- `nano-claw cron add/list/remove` - Manage scheduled tasks

## Development

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## Configuration

Configuration file location: `~/.nano-claw/config.json`

See the [Configuration Guide](docs/configuration.md) for detailed options.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

- Original Python project: [HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- Inspired by: [OpenClaw](https://github.com/openclaw/openclaw)

---

## 中文文档

## 关于

**nano-claw** 是 [nanobot](https://github.com/HKUDS/nanobot) 的 TypeScript + Node.js 实现版本，一个受 [OpenClaw](https://github.com/openclaw/openclaw) 启发的超轻量级个人 AI 助手。

🪶 **超轻量级**：最小化核心代码，比重型框架小 99%

🔬 **研究友好**：代码清晰易读，易于理解和扩展

⚡️ **超快启动**：最小占用空间，启动更快，资源占用更低

💎 **简单易用**：简单配置，直观的命令行界面

## 架构

```
nano-claw/
├── src/
│   ├── agent/          # 🧠 核心 agent 逻辑
│   │   ├── loop.ts     #    Agent 循环 (LLM ↔ 工具执行)
│   │   ├── context.ts  #    提示词构建器
│   │   ├── memory.ts   #    持久化内存
│   │   ├── skills.ts   #    技能加载器
│   │   ├── subagent.ts #    后台任务执行
│   │   └── tools/      #    内置工具
│   ├── skills/         # 🎯 捆绑技能 (github, weather 等)
│   ├── channels/       # 📱 聊天渠道集成
│   ├── bus/            # 🚌 消息路由
│   ├── cron/           # ⏰ 定时任务
│   ├── heartbeat/      # 💓 主动唤醒
│   ├── providers/      # 🤖 LLM 提供商 (OpenRouter 等)
│   ├── session/        # 💬 会话管理
│   ├── config/         # ⚙️ 配置
│   └── cli/            # 🖥️ 命令行
└── package.json
```

## 功能特性

### 核心 Agent
- **Agent 循环**：LLM 与工具执行的循环
- **上下文构建器**：构建提示词上下文
- **内存系统**：持久化对话记忆
- **技能加载器**：从 Markdown 文件动态加载技能
- **子 Agent**：后台任务管理
- **工具集**：内置工具（shell、文件操作等）

### LLM 提供商
支持多个 LLM 提供商：
- OpenRouter（推荐，可访问所有模型）
- Anthropic (Claude)
- OpenAI (GPT)
- DeepSeek
- Groq
- Gemini
- MiniMax
- Dashscope (通义千问)
- Moonshot (Kimi)
- Zhipu (智谱 GLM)
- vLLM（本地模型）

### 聊天渠道
支持多个聊天平台：
- Telegram
- Discord
- WhatsApp
- Feishu (飞书)
- Slack
- Email (邮件)
- QQ
- DingTalk (钉钉)
- Mochat

### 其他功能
- **消息总线**：消息路由和分发
- **定时任务**：使用 Cron 表达式调度任务
- **心跳机制**：主动唤醒机制
- **会话管理**：多会话支持
- **配置系统**：JSON 配置文件

## 安装

```bash
# 克隆仓库
git clone https://github.com/hustcc/nano-claw.git
cd nano-claw

# 安装依赖
npm install

# 构建项目
npm run build

# 全局链接（可选）
npm link
```

## 快速开始

**1. 初始化**

```bash
nano-claw onboard
```

**2. 配置** (`~/.nano-claw/config.json`)

使用 OpenRouter（推荐）：
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

**3. 开始对话**

```bash
nano-claw agent -m "2+2等于多少？"
```

## 命令行接口

- `nano-claw onboard` - 初始化配置
- `nano-claw agent -m "..."` - 与 agent 对话
- `nano-claw agent` - 交互模式
- `nano-claw gateway` - 启动网关服务器
- `nano-claw status` - 显示系统状态
- `nano-claw channels login` - 登录渠道（如 WhatsApp）
- `nano-claw cron add/list/remove` - 管理定时任务

## 开发

```bash
# 监视模式（代码变化时自动重新构建）
npm run dev

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm run test
```

## 配置

配置文件位置：`~/.nano-claw/config.json`

详细配置选项请参见[配置指南](docs/configuration.md)。

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- 原始 Python 项目：[HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- 灵感来源：[OpenClaw](https://github.com/openclaw/openclaw)

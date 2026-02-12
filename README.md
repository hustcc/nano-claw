<div align="center">
  <h1>🤖 nano-claw</h1>
  
  <p align="center">
    <strong>Ultra-Lightweight Personal AI Assistant</strong>
  </p>
  
  <p align="center">
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-configuration">Configuration</a> •
    <a href="#-contributing">Contributing</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/typescript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</div>

<br>

## ✨ Why nano-claw?

**nano-claw** is a TypeScript + Node.js implementation of [nanobot](https://github.com/HKUDS/nanobot), an ultra-lightweight personal AI assistant inspired by [OpenClaw](https://github.com/openclaw/openclaw).

<table>
<tr>
<td width="25%">🪶 <b>Ultra-Lightweight</b></td>
<td>Just ~2,500 lines of core TypeScript code</td>
</tr>
<tr>
<td>🔬 <b>Research-Ready</b></td>
<td>Clean, readable code that's easy to understand and extend</td>
</tr>
<tr>
<td>⚡️ <b>Lightning Fast</b></td>
<td>Minimal footprint for faster startup and lower resource usage</td>
</tr>
<tr>
<td>💎 <b>Easy-to-Use</b></td>
<td>Simple configuration and intuitive CLI</td>
</tr>
</table>

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

<br>


<br>

## 🎯 Features

### 🧠 Core Agent

<table>
<tr>
<td><b>Agent Loop</b></td>
<td>LLM and tool execution loop</td>
</tr>
<tr>
<td><b>Context Builder</b></td>
<td>Construct prompt context</td>
</tr>
<tr>
<td><b>Memory</b></td>
<td>Persistent conversation memory</td>
</tr>
<tr>
<td><b>Skills Loader</b></td>
<td>Dynamic skill loading from Markdown files</td>
</tr>
<tr>
<td><b>Subagent</b></td>
<td>Background task management</td>
</tr>
<tr>
<td><b>Tools</b></td>
<td>Built-in tools (shell, file operations, etc.)</td>
</tr>
</table>

### 🤖 LLM Providers

Support for **11+ LLM providers** with flexible configuration:

<table>
<tr>
<td>• OpenRouter (recommended)</td>
<td>• Anthropic (Claude)</td>
<td>• OpenAI (GPT)</td>
</tr>
<tr>
<td>• DeepSeek</td>
<td>• Groq</td>
<td>• Gemini</td>
</tr>
<tr>
<td>• MiniMax</td>
<td>• <b>AiHubMix</b> ✨ NEW</td>
<td>• Dashscope (Qwen)</td>
</tr>
<tr>
<td>• Moonshot (Kimi)</td>
<td>• Zhipu (GLM)</td>
<td>• vLLM (local models)</td>
</tr>
</table>

### 📱 Chat Channels

Multi-platform support with seamless integration:

**Fully Implemented:**
- ✅ **Telegram** - Full bot integration
- ✅ **Discord** - Rich messaging support  
- ✅ **DingTalk / 钉钉** - Enterprise chat

**Configuration Ready:**
- 📋 WhatsApp
- 📋 Feishu / 飞书
- 📋 Slack
- 📋 Email
- 📋 QQ
- 📋 Mochat

> **💡 Tip**: Additional channel adapters can be added by extending the `BaseChannel` class.

### 🎨 Advanced Features

- 🌐 **Gateway Server** - Central hub for channel management ✨ NEW
- 🚌 **Message Bus** - Event-driven message routing ✨ NEW
- ⏰ **Cron Tasks** - Schedule tasks with cron expressions
- 💓 **Heartbeat** - Proactive wake-up mechanism ✨ NEW
- 💬 **Session Management** - Multi-user, multi-channel session support ✨ ENHANCED
- 🔄 **Subagent Tasks** - Background task execution ✨ NEW
- ⚙️ **Configuration** - JSON configuration files with Zod validation


<br>

## 🚀 Quick Start

Get started with nano-claw in just 3 steps:

### 1️⃣ Initialize

```bash
nano-claw onboard
```

### 2️⃣ Configure

Edit your configuration file at `~/.nano-claw/config.json`:

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

### 3️⃣ Chat

```bash
nano-claw agent -m "What is 2+2?"
```

Or start an interactive session:

```bash
nano-claw agent
```

<br>

## 📦 Installation

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


<br>

## 🔧 CLI Commands

| Command | Description |
|---------|-------------|
| `nano-claw onboard` | Initialize configuration |
| `nano-claw agent -m "..."` | Chat with agent (single message) |
| `nano-claw agent` | Interactive mode |
| `nano-claw gateway` | Start gateway server for channels ✨ NEW |
| `nano-claw status` | Show system status |
| `nano-claw channels login` | Login to channels (e.g., WhatsApp) |
| `nano-claw cron add/list/remove` | Manage scheduled tasks |

<br>

## 👨‍💻 Development

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

<br>

## ⚙️ Configuration

Configuration file location: `~/.nano-claw/config.json`

See **[CONFIGURATION.md](documentation/CONFIGURATION.md)** for detailed configuration options including:

- 🤖 All 11 LLM providers setup
- 🎛️ Agent behavior customization
- 🔒 Tool execution security
- 💬 Chat channel integrations
- 🌍 Environment variables

<br>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

<br>

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/hustcc">@hustcc</a></sub>
</div>

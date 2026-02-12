<div align="center">
  <h1>nano-claw</h1>
  <p>
    🦞 Claw is a Ultra-Lightweight Personal AI Assistant you run on your own devices.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/nano-claw"><img src="https://img.shields.io/npm/v/nano-claw" alt="npm version"></a>
    <img src="https://img.shields.io/badge/typescript-5.x-blue" alt="TypeScript">
    <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="Node.js">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </p>
</div>

## 📖 About

**nano-claw** is a TypeScript + Node.js implementation of [nanobot](https://github.com/HKUDS/nanobot), an ultra-lightweight personal AI assistant inspired by [OpenClaw](https://github.com/openclaw/openclaw).

- 🪶 **Ultra-Lightweight**: Just ~4,500 lines of core TypeScript code
- 🔬 **Research-Ready**: Clean, readable code that's easy to understand and extend
- ⚡️ **Lightning Fast**: Minimal footprint for faster startup and lower resource usage
- 💎 **Easy-to-Use**: Simple configuration and intuitive CLI

## 🏗️ Architecture

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

## ✨ Features

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
- **AiHubMix** (API gateway, all models) ✨ NEW
- Dashscope (Qwen)
- Moonshot (Kimi)
- Zhipu (GLM)
- vLLM (local models)

### Chat Channels

Support for multiple chat platforms:

- **Telegram** ✅ Implemented
- **Discord** ✅ Implemented
- **DingTalk / 钉钉** ✅ Implemented
- WhatsApp (config ready)
- Feishu / 飞书 (config ready)
- Slack (config ready)
- Email (config ready)
- QQ (config ready)
- Mochat (config ready)

> **Note**: Telegram, Discord, and DingTalk channel adapters are fully implemented. Additional channel adapters can be added by extending the `BaseChannel` class.

### Other Features

- **Gateway Server**: Central hub for channel management ✨ NEW
- **Message Bus**: Event-driven message routing ✨ NEW
- **Cron Tasks**: Schedule tasks with cron expressions
- **Heartbeat**: Proactive wake-up mechanism ✨ NEW
- **Session Management**: Multi-user, multi-channel session support ✨ ENHANCED
- **Subagent Tasks**: Background task execution ✨ NEW
- **Configuration**: JSON configuration files with Zod validation

## 📦 Installation

```bash
npm install -g nano-claw

pnpm install -g nano-claw

yarn global add nano-claw
```

## 🚀 Quick Start

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

## 🔧 CLI Commands

- `nano-claw onboard` - Initialize configuration
- `nano-claw agent -m "..."` - Chat with agent (single message)
- `nano-claw agent` - Interactive mode
- `nano-claw gateway` - Start gateway server for channels ✨ NEW
- `nano-claw status` - Show system status
- `nano-claw channels login` - Login to channels (e.g., WhatsApp)
- `nano-claw cron add/list/remove` - Manage scheduled tasks

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

## 📚 Examples & Guides

Comprehensive examples to help you get started and master nano-claw:

- **[Examples Directory](examples/)** - Complete guide to all examples
- **[Basic Usage](examples/basic-usage.md)** - Getting started for beginners
- **[Integration Examples](examples/integration-examples.md)** - Telegram, Discord, local models
- **[Advanced Features](examples/advanced-features.md)** - Custom skills, cron, subagents
- **[Use Case Scenarios](examples/use-case-scenarios.md)** - Real-world examples
- **[Code Recipes](examples/code-recipes.md)** - Configuration patterns and troubleshooting

## ⚙️ Configuration

Configuration file location: `~/.nano-claw/config.json`

See [CONFIGURATION.md](documentation/CONFIGURATION.md) for detailed configuration options including:
- All 11 LLM providers setup
- Agent behavior customization
- Tool execution security
- Chat channel integrations
- Environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

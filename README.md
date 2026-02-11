<div align="center">
  <h1>nano-claw</h1>
  <p>
    <strong>Ultra-Lightweight Personal AI Assistant</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/typescript-5.x-blue" alt="TypeScript">
    <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="Node.js">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
    <img src="https://img.shields.io/badge/code-2508%20lines-brightgreen" alt="Lines of Code">
  </p>
</div>

---

## About

**nano-claw** is a TypeScript + Node.js implementation of [nanobot](https://github.com/HKUDS/nanobot), an ultra-lightweight personal AI assistant inspired by [OpenClaw](https://github.com/openclaw/openclaw).

🪶 **Ultra-Lightweight**: Just ~2,500 lines of core TypeScript code

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

# nanobot Project Analysis

## Project Overview

**nanobot** is an ultra-lightweight personal AI assistant inspired by OpenClaw. The project's core characteristic is implementing complete AI agent functionality in just **~4,000 lines of code** - a **99% reduction** compared to Clawdbot's 430k+ lines.

- **Repository**: https://github.com/HKUDS/nanobot
- **Latest Version**: v0.1.3.post6
- **Core Code Size**: ~3,510 lines (actual count)

---

## I. Core Functionality

### 1.1 Main Feature Modules

#### 📈 **24/7 Real-Time Market Analysis**
- Continuous market monitoring
- Real-time insights and trend analysis
- Key information discovery

#### 🚀 **Full-Stack Software Engineer**
- Code development capabilities
- Deployment and scaling support
- Complete software development lifecycle management

#### 📅 **Smart Daily Routine Manager**
- Automated task scheduling
- Scheduled task execution (Cron support)
- Intelligent reminders and organization

#### 📚 **Personal Knowledge Assistant**
- Learning and memory functions
- Reasoning capabilities
- Long-term context retention

### 1.2 Key Features

🪶 **Ultra-Lightweight**
- Core agent code is only ~4,000 lines
- 99% smaller than traditional AI assistants
- Minimal resource footprint

🔬 **Research-Ready**
- Clean, readable code
- Easy to understand, modify, and extend
- Suitable for academic research and experimentation

⚡️ **Lightning Fast**
- Quick startup
- Low resource usage
- Fast iteration development

💎 **Easy-to-Use**
- One-click deployment
- Running in 2 minutes
- Simple configuration process

---

## II. Technical Stack

### 2.1 Programming Language & Framework

#### **Python Ecosystem**
- **Core Language**: Python
- **Dependency Management**: pip, uv (recommended)
- **Package Distribution**: PyPI (nanobot-ai)

### 2.2 Large Language Model Integration

#### **Multi-Provider Architecture**
nanobot supports multiple LLM providers through a unified Provider Registry:

1. **OpenRouter** (Recommended - Global Users)
   - Access to all major models
   - Including Claude Opus 4.5, GPT-4, etc.

2. **Local Model Support**
   - vLLM integration
   - Support for any OpenAI-compatible server
   - Can run open-source models like Llama, Qwen

3. **Direct API Support**
   - Anthropic (Claude)
   - OpenAI (GPT)
   - DeepSeek
   - Groq (with Whisper voice transcription)
   - Google Gemini
   - MiniMax
   - Zhipu (GLM)
   - Moonshot (Kimi)
   - Qwen (DashScope)

4. **API Gateways**
   - AiHubMix
   - OpenRouter

### 2.3 Communication Channel Integration

#### **Multi-Platform Support**
- **Telegram** (Recommended - Easiest)
- **Discord** (Bot token + intents)
- **WhatsApp** (QR code login)
- **Feishu** (WebSocket long connection)
- **Mochat** (WebSocket)
- **DingTalk** (Stream Mode)
- **Slack** (Socket Mode)
- **Email** (IMAP/SMTP)
- **QQ** (Private messages)

All channels support **deployment without public IP** (WebSocket/long connection mode).

### 2.4 Technical Features

#### **LiteLLM Integration**
- Unified LLM interface abstraction
- Automatic model name prefix handling
- Automatic environment variable configuration

#### **Tool System**
- Shell command execution
- File read/write/edit operations
- Spawn sub-agents
- Custom skills system

#### **Persistent Storage**
- Session management
- Memory system
- Configuration file (~/.nanobot/config.json)

#### **Task Scheduling**
- Cron expression support
- Natural language task scheduling
- Background task execution (subagent)

---

## III. Architecture Design

### 3.1 Overall Architecture

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

### 3.2 Project Directory Structure

```
nanobot/
├── agent/          # 🧠 Core agent logic
│   ├── loop.py     #    Agent loop (LLM ↔ tool execution)
│   ├── context.py  #    Prompt builder
│   ├── memory.py   #    Persistent memory
│   ├── skills.py   #    Skills loader
│   ├── subagent.py #    Background task execution
│   └── tools/      #    Built-in tools (incl. spawn)
├── skills/         # 🎯 Bundled skills (github, weather, tmux...)
├── channels/       # 📱 Chat channel integrations
├── bus/            # 🚌 Message routing
├── cron/           # ⏰ Scheduled tasks
├── heartbeat/      # 💓 Proactive wake-up
├── providers/      # 🤖 LLM providers (OpenRouter, etc.)
├── session/        # 💬 Conversation sessions
├── config/         # ⚙️ Configuration
└── cli/            # 🖥️ Commands
```

### 3.3 Core Component Details

#### **1. Agent Core**

**loop.py - Agent Loop**
- Implements LLM and tool execution loop interaction
- Manages conversation context
- Handles tool calls and results

**context.py - Context Building**
- Constructs prompts sent to LLM
- Manages system prompts and user messages
- Organizes tool descriptions and history

**memory.py - Memory System**
- Persists important conversation information
- Cross-session memory retention
- Knowledge accumulation

**subagent.py - Sub-Agent**
- Parallel background task execution
- Independent agent instances
- Support for long-running tasks

#### **2. Tools System**

Provides various capabilities the agent can invoke:
- **Shell**: Execute command-line commands
- **File Operations**: File read/write, list, edit
- **Spawn**: Create sub-agents
- **Skills**: Extensible skills system

#### **3. Channels (Communication Channels)**

Unified interface abstraction:
- Message receiving and sending
- Authentication and permission control (allowFrom)
- Multiple connection modes (WebSocket, HTTP, IMAP/SMTP)

#### **4. Bus (Message Bus)**

- Routes messages between channels and agents
- Session management
- Message queuing and distribution

#### **5. Provider Registry**

**Core Design Philosophy**:
- Single Source of Truth
- Adding new provider takes only 2 steps
- No need to modify if-elif chains
- Automatic handling of environment variables, model prefixes, config matching

**ProviderSpec Structure**:
```python
ProviderSpec(
    name="provider_name",           # Config field name
    keywords=("keyword1", "key2"),  # Model name keywords
    env_key="PROVIDER_API_KEY",     # Environment variable
    display_name="Provider Name",   # Display name
    litellm_prefix="prefix",        # Model prefix
    skip_prefixes=("prefix/",),     # Skip prefixes
    # Optional parameters
    env_extras=(),                  # Extra env vars
    model_overrides=(),             # Model param overrides
    is_gateway=False,               # Is gateway?
)
```

#### **6. Session (Session Management)**

- Maintains user session state
- Conversation history
- Context continuity

#### **7. Cron (Scheduled Tasks)**

- Cron expression support
- Natural language scheduling
- Periodic task execution

#### **8. Heartbeat**

- Proactive task triggering
- Keeps agent active
- Regular checks and reminders

### 3.4 Data Flow

#### **Typical Interaction Flow**:

```
1. User sends message via Telegram
   ↓
2. Telegram Channel receives message
   ↓
3. Bus routes message to Agent
   ↓
4. Agent Loop processes:
   a. Context Builder constructs prompt
   b. Call LLM (via Provider)
   c. LLM returns tool calls
   d. Execute tools (Shell/File/Spawn/Skills)
   e. Feed tool results back to LLM
   f. Loop until final response
   ↓
5. Response returns to Channel via Bus
   ↓
6. Telegram sends message to user
```

### 3.5 Security Design

#### **Sandbox Mechanism**
- `restrictToWorkspace`: Restricts all tools to workspace directory
- Prevents path traversal attacks
- Prevents out-of-scope access

#### **Access Control**
- `allowFrom`: Whitelist mechanism
- Restrict access by user ID
- Empty list = allow all, non-empty = only listed users

---

## IV. Quick Start

### 4.1 Installation

**Install from source** (recommended, latest features):
```bash
git clone https://github.com/HKUDS/nanobot.git
cd nanobot
pip install -e .
```

**Install with uv** (stable, fast):
```bash
uv tool install nanobot-ai
```

**Install from PyPI** (stable):
```bash
pip install nanobot-ai
```

### 4.2 Configuration

1. **Initialize**:
```bash
nanobot onboard
```

2. **Config file** (~/.nanobot/config.json):
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

3. **Start using**:
```bash
nanobot agent -m "What is 2+2?"
```

### 4.3 Docker Deployment

```bash
# Build image
docker build -t nanobot .

# Initialize config
docker run -v ~/.nanobot:/root/.nanobot --rm nanobot onboard

# Run gateway
docker run -v ~/.nanobot:/root/.nanobot -p 18790:18790 nanobot gateway
```

---

## V. Technical Highlights

### 5.1 Minimalist Design Philosophy

- **Code Size Control**: Core functionality in ~4,000 lines, easy to understand and maintain
- **Modular Architecture**: Clear separation of concerns
- **Extensibility**: Easy to extend via Skills and Provider Registry

### 5.2 Provider Architecture Innovation

- **Registry Pattern**: Avoids hardcoded conditional logic
- **Auto Configuration**: Automatic handling of env vars, model prefixes
- **Gateway Detection**: Smart identification of API gateways (via key prefix or base URL)

### 5.3 No Public IP Deployment

- **WebSocket Long Connection**: Feishu, QQ
- **Stream Mode**: DingTalk
- **Socket Mode**: Slack
- **Polling Mode**: Email (IMAP)

Completely avoids webhook's public IP requirement, lowering deployment barrier.

### 5.4 Multi-Modal Support

- **Voice Transcription**: Integrated Groq Whisper
- **Telegram Voice Messages**: Automatic transcription
- Future support for images and video

### 5.5 Agent Social Network

- **Moltbook**: Automatic agent community joining
- **ClawdChat**: Agent communication platform
- Join with just one message

---

## VI. Comparison with Other Projects

### nanobot vs Clawdbot

| Feature | nanobot | Clawdbot |
|---------|---------|----------|
| Code Size | ~4,000 lines | 430,000+ lines |
| Complexity | Minimal | Complex |
| Learning Curve | Gentle | Steep |
| Use Cases | Personal assistant, research | Enterprise applications |
| Extensibility | High (simple architecture) | High (complete framework) |

### Core Advantages

1. **Research-Friendly**: Small codebase, readable, suitable for academic research
2. **Fast Iteration**: Small codebase means quick modifications and testing
3. **Low Resource Usage**: Suitable for personal deployment, lower costs
4. **Easy to Understand**: Beginner-friendly, quick to get started

---

## VII. Future Roadmap

### Completed Features
- ✅ Multi-LLM provider support
- ✅ Local model integration (vLLM)
- ✅ 9+ communication channels
- ✅ Scheduled tasks (Cron)
- ✅ Skills system
- ✅ Voice transcription (Groq Whisper)
- ✅ Docker support

### Features in Development
- 🚧 Enhanced multi-modal capabilities (images, video)
- 🚧 Long-term memory optimization
- 🚧 Better reasoning capabilities
- 🚧 More integrations (calendar, etc.)
- 🚧 Self-improvement mechanism

---

## VIII. Summary

**nanobot** is an AI agent project that fully embodies the "Less is More" philosophy. Through carefully designed architecture and minimal code implementation, it proves that you don't need a massive codebase to build a fully functional AI assistant.

### Core Value

1. **Educational Value**: Excellent example for learning AI agent architecture
2. **Research Value**: Suitable for rapid prototyping and experimentation
3. **Practical Value**: Complete solution for personal AI assistants
4. **Reference Value**: Demonstrates how to design extensible plugin systems

### Target Audience

- 🎓 **Students and Researchers**: Learning AI agent design
- 👨‍💻 **Developers**: Quickly build personal AI assistants
- 🔬 **Experimenters**: Testing new ideas and algorithms
- 📚 **Enthusiasts**: Understanding modern AI application architecture

---

## Related Links

- 📦 **GitHub**: https://github.com/HKUDS/nanobot
- 📘 **PyPI**: https://pypi.org/project/nanobot-ai/
- 💬 **Discussions**: https://github.com/HKUDS/nanobot/discussions
- 🐛 **Issues**: https://github.com/HKUDS/nanobot/issues

---

*Last Updated: 2026-02-11*

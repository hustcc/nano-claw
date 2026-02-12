# nano-claw Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         nano-claw                               │
│                   Ultra-Lightweight AI Assistant                │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────┐
                          │   CLI    │
                          │ Commands │
                          └────┬─────┘
                               │
                ┌──────────────┼──────────────┬─────────┐
                │              │              │         │
          ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼────┐   │
          │  onboard  │  │   agent   │  │ status  │   │
          └───────────┘  └─────┬─────┘  └─────────┘   │
                               │                       │
                        ┌──────▼──────┐         ┌──────▼──────┐
                        │ Agent Loop  │         │   Gateway   │
                        │ (Main Core) │         │   Server    │
                        └──────┬──────┘         └──────┬──────┘
                               │                       │
      ┌────────────────────────┼───────────────────────┼─────────────┐
      │                        │                       │             │
┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐ ┌───▼─────┐
│  Context  │          │   Memory    │         │   Skills    │ │   Bus   │
│  Builder  │          │   System    │         │   Loader    │ │ Message │
└─────┬─────┘          └──────┬──────┘         └──────┬──────┘ └───┬─────┘
      │                       │                        │            │
      └───────────────────────┼────────────────────────┼────────────┘
                              │                        │
┌─────────────────────────────┼────────────────────────┼─────────────────┐
│                             │                        │                 │
│                    ┌────────▼─────────┐      ┌───────▼────────┐       │
│                    │  Provider Manager│      │  Session Mgr   │       │
│                    └────────┬─────────┘      └───────┬────────┘       │
│                             │                        │                 │
│    ┌────────────────────────┼────────────────────────┼─────────┐      │
│    │                        │                        │         │      │
│  ┌─▼────────┐        ┌──────▼──────┐        ┌───────▼──────┐  │      │
│  │OpenRouter│        │  Anthropic  │        │  AiHubMix    │  │      │
│  │ Provider │        │  Provider   │        │  Provider    │  │      │
│  └──────────┘        └─────────────┘        └──────────────┘  │      │
│       │                     │                       │          │      │
│       └─────────────────────┼───────────────────────┘          │      │
│                             │                                  │      │
│                    ┌────────▼─────────┐                        │      │
│                    │    LLM APIs      │                        │      │
│                    │(External Services)│                       │      │
│                    └──────────────────┘                        │      │
│                                                                 │      │
│                         ┌──────────────┐                       │      │
│                         │ Tool Registry│                       │      │
│                         └──────┬───────┘                       │      │
│                                │                               │      │
│       ┌────────────────────────┼────────────────────────┐     │      │
│       │                        │                        │     │      │
│ ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐     │
│ │  Shell    │          │  Read File  │         │ Write File  │     │
│ │   Tool    │          │    Tool     │         │    Tool     │     │
└─┴───────────┴──────────┴─────────────┴─────────┴─────────────┴─────┘

                    ┌─────────────────────────────┐
                    │    Channel Integrations     │
                    │ (Telegram, Discord, etc.)   │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Channel Manager   │
                    └─────────┬───────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
      ┌─────▼──────┐    ┌─────▼──────┐   ┌─────▼──────┐
      │  Telegram  │    │  Discord   │   │  WhatsApp  │
      │  Channel   │    │  Channel   │   │  Channel   │
      └────────────┘    └────────────┘   └────────────┘

                    ┌─────────────────────────────┐
                    │   Background Processing     │
                    └──────────┬──────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
      ┌─────▼──────┐     ┌─────▼──────┐    ┌─────▼──────┐
      │ Subagent   │     │ Heartbeat  │    │   Cron     │
      │   Tasks    │     │  Monitor   │    │ Scheduler  │
      └────────────┘     └────────────┘    └────────────┘
    └───────────┘          └─────────────┘         └─────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      Configuration Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ~/.nano-claw/                                                  │
│  ├── config.json          ← Configuration (Zod validated)      │
│  ├── memory/              ← Conversation history               │
│  │   ├── default.json                                          │
│  │   └── session-*.json                                        │
│  ├── skills/              ← Custom skills (Markdown)           │
│  │   ├── weather.md                                            │
│  │   └── github.md                                             │
│  └── logs/                ← Application logs                   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                         Data Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User Input (CLI)                                           │
│         ↓                                                       │
│  2. Agent Loop processes message                               │
│         ↓                                                       │
│  3. Context Builder creates prompt (system + history + skills) │
│         ↓                                                       │
│  4. Provider Manager selects LLM provider                      │
│         ↓                                                       │
│  5. LLM generates response                                     │
│         ↓                                                       │
│  6. If tool calls → Execute tools                              │
│         ↓                                                       │
│  7. Loop back to LLM with tool results                         │
│         ↓                                                       │
│  8. Final response to user                                     │
│         ↓                                                       │
│  9. Memory system saves conversation                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      Extension Points                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • Add new LLM Provider: src/providers/registry.ts             │
│  • Add new Tool: src/agent/tools/                              │
│  • Add new Skill: ~/.nano-claw/skills/*.md                     │
│  • Add new CLI Command: src/cli/commands/                      │
│  • Add new Channel: src/channels/ (future)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      Technology Stack                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Runtime:      Node.js >= 18                                   │
│  Language:     TypeScript 5.x                                  │
│  Build:        tsc (TypeScript Compiler)                       │
│  Module:       ESM (ES Modules)                                │
│  Validation:   Zod                                             │
│  CLI:          Commander.js                                    │
│  Logging:      Pino                                            │
│  HTTP:         Axios                                           │
│  Formatting:   Chalk, cli-table3                               │
│  Linting:      ESLint + Prettier                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    Key Design Patterns                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • Registry Pattern: Providers & Tools                         │
│  • Builder Pattern: Context Builder                            │
│  • Strategy Pattern: Provider Selection                        │
│  • Factory Pattern: Provider Instantiation                     │
│  • Repository Pattern: Memory Storage                          │
│  • Command Pattern: CLI Commands                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Agent Loop
- Orchestrates conversation flow
- Manages tool execution cycle
- Handles max iterations
- Integrates all components

### Context Builder
- Constructs system prompts
- Adds skills documentation
- Formats tool definitions
- Truncates long contexts

### Memory System
- Persists conversations
- Loads historical messages
- Manages message limits
- Session isolation

### Skills Loader
- Discovers skill files
- Parses Markdown skills
- Provides skill context
- Dynamic reloading

### Provider Manager
- Auto-detects providers
- Routes to correct provider
- Handles provider errors
- Manages provider cache

### Tool Registry
- Registers available tools
- Executes tool functions
- Validates tool calls
- Returns structured results

### Configuration
- Loads user config
- Validates with Zod
- Merges env variables
- Provides defaults

## Security Layers

1. **Input Validation**: Zod schemas
2. **Command Whitelisting**: Tool restrictions
3. **Workspace Isolation**: Optional sandboxing
4. **Error Handling**: Comprehensive try-catch
5. **Secure IDs**: crypto.randomUUID()
6. **Type Safety**: TypeScript strict mode

## New Components (v0.1.0+)

### Gateway Server
- Central hub for channel integrations
- Routes messages between channels and agent
- Manages channel lifecycle
- Coordinates with message bus
- Handles graceful shutdown

### Message Bus
- Event-driven message routing
- Pub/sub pattern for scalability
- Channel-specific and global handlers
- Error isolation per handler
- Supports async message processing

### Session Manager
- Multi-user session management
- Persists session metadata
- Tracks user activity across channels
- Session cleanup and garbage collection
- Channel-aware session isolation

### Subagent Tasks
- Background task execution
- Configurable concurrency limits
- Task queue management
- Status tracking (pending/running/completed/failed)
- Timeout and cancellation support

### Heartbeat Monitor
- Proactive wake-up mechanism
- Configurable interval beats
- Custom beat handlers
- Status monitoring
- Can be enabled/disabled via config

### Channel Infrastructure
- Base channel interface
- Channel registration system
- Message format standardization
- Connection status tracking
- Extensible for new channel types

## Gateway Data Flow

```
Channel Message → Message Bus → Gateway → Agent Loop → Response
                      ↓                        ↑
                 Subscribers              Session Manager
```

1. User sends message via channel (Telegram, Discord, etc.)
2. Channel adapter receives message
3. Message published to message bus
4. Gateway subscribes to all messages
5. Gateway creates/retrieves session
6. Agent Loop processes message
7. Response sent back through channel

## Adding a New Channel

1. Create channel adapter extending `BaseChannel`
2. Implement required methods:
   - `initialize()`: Setup channel connection
   - `start()`: Begin listening for messages
   - `stop()`: Cleanup and disconnect
   - `sendMessage()`: Send response to user
   - `isConnected()`: Check connection status
3. Register channel with ChannelManager
4. Add configuration schema in `config/schema.ts`
5. Channel automatically integrates with gateway

## Configuration Structure

```json
{
  "providers": {
    "openrouter": { "apiKey": "..." },
    "aihubmix": { "apiKey": "..." }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "...",
      "allowFrom": ["user_id"]
    }
  }
}
```

## File System Layout

```
~/.nano-claw/
├── config.json          ← Main configuration
├── memory/              ← Conversation histories
│   ├── default.json
│   └── user-123.json
├── sessions/            ← Session metadata (NEW)
│   ├── session-1.json
│   └── user-telegram-456.json
├── skills/              ← Custom skills
│   └── custom.md
├── cron.json           ← Scheduled tasks
└── logs/               ← Application logs
```

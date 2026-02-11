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
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼────┐
              │  onboard  │  │   agent   │  │ status  │
              └───────────┘  └─────┬─────┘  └─────────┘
                                   │
                            ┌──────▼──────┐
                            │ Agent Loop  │
                            │ (Main Core) │
                            └──────┬──────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
    ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
    │  Context  │          │   Memory    │         │   Skills    │
    │  Builder  │          │   System    │         │   Loader    │
    └─────┬─────┘          └──────┬──────┘         └──────┬──────┘
          │                       │                        │
          └───────────────────────┼────────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │  Provider Manager │
                        └─────────┬─────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────▼──────┐        ┌──────▼──────┐        ┌──────▼──────┐
    │ OpenRouter │        │  Anthropic  │        │   OpenAI    │
    │  Provider  │        │  Provider   │        │  Provider   │
    └────────────┘        └─────────────┘        └─────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │    LLM APIs       │
                        │ (External Services)│
                        └───────────────────┘

                            ┌──────────────┐
                            │ Tool Registry│
                            └──────┬───────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
    ┌─────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
    │  Shell    │          │  Read File  │         │ Write File  │
    │   Tool    │          │    Tool     │         │    Tool     │
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

# Contributing to nano-claw

Thank you for your interest in contributing to nano-claw! This document provides guidelines for contributing to the project.

## Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/hustcc/nano-claw.git
cd nano-claw
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Run in development mode**
```bash
npm run dev  # Watch mode
```

## Project Structure

```
nano-claw/
├── src/
│   ├── agent/          # Core agent logic
│   │   ├── loop.ts     # Main agent loop
│   │   ├── context.ts  # Context builder
│   │   ├── memory.ts   # Conversation memory
│   │   ├── skills.ts   # Skills loader
│   │   └── tools/      # Built-in tools
│   ├── providers/      # LLM providers
│   ├── config/         # Configuration system
│   ├── cli/            # CLI commands
│   └── utils/          # Utility functions
├── dist/               # Compiled output
├── package.json
└── tsconfig.json
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` for public APIs
- Use `type` for unions and complex types
- Always specify return types for public functions
- Use async/await over Promises
- Use ESM imports (`.js` extensions in imports)

### Code Style

- Use Prettier for formatting (run `npm run format`)
- Use ESLint for linting (run `npm run lint`)
- Follow existing naming conventions:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case

### Comments

- Use JSDoc comments for public APIs
- Include both English and Chinese for critical parts
- Keep comments concise and meaningful

## Adding a New LLM Provider

1. **Add provider spec to registry** (`src/providers/registry.ts`):
```typescript
{
  name: 'myprovider',
  keywords: ['myprovider', 'mymodel'],
  envKey: 'MYPROVIDER_API_KEY',
  displayName: 'My Provider',
  litellmPrefix: 'myprovider',
  skipPrefixes: ['myprovider/'],
}
```

2. **Add config schema** (`src/config/schema.ts`):
```typescript
myprovider: ProviderConfigSchema.optional(),
```

3. **Implement provider class** (if custom logic needed) in `src/providers/base.ts`

4. **Update provider manager** (`src/providers/index.ts`) to instantiate your provider

## Adding a New Tool

1. **Create tool class** extending `BaseTool` in `src/agent/tools/`:
```typescript
export class MyTool extends BaseTool {
  name = 'my_tool';
  description = 'What this tool does';

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: {
            // Define parameters
          },
          required: [],
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    // Implementation
    return this.success('Result');
  }
}
```

2. **Register the tool** in `src/agent/loop.ts`:
```typescript
this.toolRegistry.register(new MyTool());
```

## Adding a Chat Channel

1. **Add channel config schema** in `src/config/schema.ts`

2. **Create channel implementation** in `src/channels/`

3. **Update gateway** to handle the new channel

## Testing

```bash
# Run tests
npm test

# Test CLI locally
npm run build
node dist/cli/index.js --help
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run linting and formatting: `npm run lint && npm run format`
5. Build and test: `npm run build && npm test`
6. Commit with clear messages
7. Push to your fork
8. Create a Pull Request

### Commit Messages

Use conventional commits format:
- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation update`
- `refactor: code refactoring`
- `test: add tests`
- `chore: maintenance tasks`

## Questions?

- Open an issue for bugs or feature requests
- Join discussions for questions and ideas

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

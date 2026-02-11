# Quick Start Guide

Get started with nano-claw in 5 minutes!

## Prerequisites

- Node.js >= 18.0.0
- An API key from a supported LLM provider (recommended: OpenRouter)

## Installation

### From Source (Current)

```bash
# Clone the repository
git clone https://github.com/hustcc/nano-claw.git
cd nano-claw

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Link for global usage
npm link
```

### From npm (Coming Soon)

```bash
npm install -g nano-claw
```

## Configuration

### 1. Initialize

```bash
nano-claw onboard
```

This creates:
- `~/.nano-claw/` - Home directory
- `~/.nano-claw/config.json` - Configuration file
- `~/.nano-claw/memory/` - Conversation history
- `~/.nano-claw/skills/` - Custom skills

### 2. Add Your API Key

Edit `~/.nano-claw/config.json`:

**For OpenRouter (Recommended - Access to all models):**

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"
    }
  }
}
```

**For Anthropic (Claude Direct):**

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "claude-opus-4-5"
    }
  }
}
```

**For OpenAI (GPT Direct):**

```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-4-turbo"
    }
  }
}
```

### 3. Get API Keys

- **OpenRouter**: https://openrouter.ai/keys (Recommended)
- **Anthropic**: https://console.anthropic.com
- **OpenAI**: https://platform.openai.com
- **DeepSeek**: https://platform.deepseek.com
- **Groq**: https://console.groq.com

## Usage

### Check Status

```bash
nano-claw status
```

Shows:
- Configured providers
- Agent settings
- Tools configuration
- Channel status

### Single Message

```bash
nano-claw agent -m "What is TypeScript?"
```

### Interactive Chat

```bash
nano-claw agent
```

Commands in interactive mode:
- Type your message and press Enter
- `clear` - Clear conversation history
- `exit` or `quit` - Exit

### Custom Session

```bash
nano-claw agent --session my-project
```

Each session has its own conversation history.

## Examples

### Simple Question

```bash
$ nano-claw agent -m "What is 2+2?"

🤖 Agent: Processing your request...

2 + 2 = 4
```

### Using Tools

```bash
$ nano-claw agent -m "Create a file called hello.txt with content 'Hello World'"

🤖 Agent: Processing your request...

I'll create that file for you.

[Tool: write_file executed]

✓ File written successfully: hello.txt
```

### Code Assistance

```bash
$ nano-claw agent -m "Write a TypeScript function to calculate factorial"

🤖 Agent: Processing your request...

Here's a TypeScript function to calculate factorial:

\`\`\`typescript
function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Example usage:
console.log(factorial(5)); // Output: 120
\`\`\`

This uses recursion. For large numbers, you might prefer an iterative approach.
```

## Advanced Configuration

### Multiple Providers

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    },
    "anthropic": {
      "apiKey": "sk-ant-xxx"
    },
    "openai": {
      "apiKey": "sk-xxx"
    }
  }
}
```

nano-claw will automatically select the best provider based on the model name.

### Agent Settings

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "systemPrompt": "You are a helpful coding assistant."
    }
  }
}
```

### Tool Restrictions

```json
{
  "tools": {
    "restrictToWorkspace": true,
    "allowedCommands": ["ls", "cat", "grep"],
    "deniedCommands": ["rm", "sudo"]
  }
}
```

## Adding Skills

Create a Markdown file in `~/.nano-claw/skills/`:

**~/.nano-claw/skills/my-skill.md:**

```markdown
# My Custom Skill

This skill helps with custom tasks.

## Capabilities

- Feature 1
- Feature 2

## Usage

Ask me to...
```

nano-claw will automatically load it on the next run.

## Environment Variables

Set API keys via environment variables (optional):

```bash
export OPENROUTER_API_KEY="sk-or-v1-xxx"
export ANTHROPIC_API_KEY="sk-ant-xxx"
export OPENAI_API_KEY="sk-xxx"

nano-claw agent -m "Hello!"
```

## Troubleshooting

### "Configuration file not found"

Run `nano-claw onboard` to create the configuration.

### "No provider configured"

Add at least one provider's API key to `~/.nano-claw/config.json`.

### "Provider API error"

- Check your API key is correct
- Verify you have API credits
- Check your internet connection

### Build errors

```bash
npm run clean
npm install
npm run build
```

## Next Steps

- [Configuration Guide](CONFIGURATION.md) - Complete configuration reference
- [Full Documentation](README.md)
- [Architecture](ARCHITECTURE.md)
- [Examples](examples/)
- [Contributing Guide](CONTRIBUTING.md)
- [Original nanobot Project](https://github.com/HKUDS/nanobot)

## Getting Help

- 📖 Check the documentation
- 🐛 Report issues on GitHub
- 💬 Join discussions
- ⭐ Star the project if you find it useful!

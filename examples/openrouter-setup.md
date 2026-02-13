# Example: Using nano-claw with OpenRouter

This example shows how to set up and use nano-claw with OpenRouter as your LLM provider.

## Step 1: Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up or log in
3. Go to Keys section
4. Create a new API key

## Step 2: Initialize nano-claw

```bash
nano-claw onboard
```

This creates the configuration directory at `~/.nano-claw/`

## Step 3: Configure OpenRouter

Edit `~/.nano-claw/config.json`:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE",
      "apiBase": "https://openrouter.ai/api/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  },
  "tools": {
    "restrictToWorkspace": false
  }
}
```

## Step 4: Test Your Setup

```bash
# Check status
nano-claw status

# Send a single message
nano-claw agent -m "Hello! Tell me a joke."

# Start interactive mode
nano-claw agent
```

## Available Models via OpenRouter

OpenRouter gives you access to many models:

- `anthropic/claude-opus-4-5` - Claude Opus (recommended)
- `anthropic/claude-sonnet-4` - Claude Sonnet
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `openai/gpt-4o` - GPT-4o
- `google/gemini-pro` - Gemini Pro
- `meta-llama/llama-3.1-70b-instruct` - Llama 3.1
- And many more...

## Interactive Mode Commands

In interactive mode (`nano-claw agent`):

- Type your message and press Enter
- Type `clear` to clear conversation history
- Type `exit` or `quit` to exit

## Example Conversation

```text
$ nano-claw agent

🐈 nano-claw Interactive Mode

Type your message and press Enter. Type "exit" or "quit" to end.

You: What is TypeScript?

🤖 Agent: 
TypeScript is a strongly-typed programming language that builds on JavaScript.
It was developed by Microsoft and adds optional static typing to JavaScript.

Key features:
- Type safety at compile time
- Better IDE support and autocomplete
- Interfaces and advanced types
- Compiles to clean JavaScript
- Compatible with existing JavaScript code

Would you like to know more about TypeScript features?

You: exit

👋 Goodbye!
```

## Using Environment Variables

Alternatively, you can set your API key via environment variable:

```bash
export OPENROUTER_API_KEY="sk-or-v1-YOUR_KEY_HERE"
nano-claw agent -m "Hello!"
```

## Next Steps

- Add custom skills to `~/.nano-claw/skills/`
- Configure other LLM providers
- Set up chat channels (Telegram, Discord, etc.)
- Schedule tasks with cron

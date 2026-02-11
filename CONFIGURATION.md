# Configuration Guide

Complete guide to configuring nano-claw for your needs.

## Configuration File

The configuration file is located at `~/.nano-claw/config.json`. It uses JSON format with the following main sections:

- **providers**: LLM API provider settings
- **agents**: Agent behavior and model settings
- **tools**: Tool execution settings
- **channels**: Chat channel integrations

## Providers Configuration

### Supported Providers

nano-claw supports 11 LLM providers:

1. **OpenRouter** (Recommended - Gateway to all models)
2. **Anthropic** (Claude)
3. **OpenAI** (GPT)
4. **DeepSeek**
5. **Groq**
6. **Gemini** (Google)
7. **MiniMax**
8. **Dashscope** (Qwen/Alibaba)
9. **Moonshot** (Kimi)
10. **Zhipu** (GLM)
11. **vLLM** (Local models)

### Provider Schema

Each provider can be configured with:

```json
{
  "providers": {
    "provider_name": {
      "apiKey": "your-api-key",      // API key for authentication
      "apiBase": "https://...",      // Optional: Custom API base URL
      "enabled": true                // Optional: Enable/disable provider
    }
  }
}
```

### Examples

**OpenRouter (Recommended):**

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://openrouter.ai/keys

**Anthropic (Claude):**

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://console.anthropic.com

**OpenAI (GPT):**

```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://platform.openai.com

**DeepSeek:**

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://platform.deepseek.com

**Groq:**

```json
{
  "providers": {
    "groq": {
      "apiKey": "YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://console.groq.com

**Gemini (Google):**

```json
{
  "providers": {
    "gemini": {
      "apiKey": "YOUR_KEY_HERE"
    }
  }
}
```

Get your key: https://makersuite.google.com/app/apikey

**vLLM (Local Models):**

```json
{
  "providers": {
    "vllm": {
      "apiBase": "http://localhost:8000/v1"
    }
  }
}
```

### Multiple Providers

You can configure multiple providers. The agent will automatically select the appropriate provider based on the model name:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-..."
    },
    "anthropic": {
      "apiKey": "sk-ant-..."
    },
    "openai": {
      "apiKey": "sk-..."
    }
  }
}
```

## Agent Configuration

Configure agent behavior and defaults:

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",  // Model to use
      "temperature": 0.7,                    // Creativity (0.0-2.0)
      "maxTokens": 4096,                     // Max response length
      "systemPrompt": "You are a helpful assistant..."  // Optional custom prompt
    }
  }
}
```

### Parameters

- **model**: Model identifier (e.g., `anthropic/claude-opus-4-5`, `gpt-4-turbo`)
- **temperature**: Controls randomness (0.0 = deterministic, 2.0 = very creative)
- **maxTokens**: Maximum tokens in response (default: 4096)
- **systemPrompt**: Custom system prompt to guide agent behavior

### Popular Models

**Via OpenRouter:**
- `anthropic/claude-opus-4-5` - Most capable
- `anthropic/claude-sonnet-4-5` - Balanced
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `google/gemini-pro-1.5` - Gemini Pro
- `meta-llama/llama-3.1-405b` - Llama 3.1

**Direct Access:**
- `claude-opus-4-5` - Anthropic direct
- `gpt-4-turbo` - OpenAI direct
- `deepseek-chat` - DeepSeek
- `gemma2-9b-it` - Groq

## Tools Configuration

Configure tool execution behavior:

```json
{
  "tools": {
    "restrictToWorkspace": false,         // Restrict file operations to current directory
    "allowedCommands": ["git", "npm"],    // Whitelist specific commands
    "deniedCommands": ["rm -rf", "sudo"]  // Blacklist dangerous commands
  }
}
```

### Parameters

- **restrictToWorkspace**: When `true`, file operations are restricted to the current working directory
- **allowedCommands**: List of allowed shell commands (when set, only these commands can run)
- **deniedCommands**: List of forbidden shell commands (these commands will be blocked)

### Security Best Practices

For production use:

```json
{
  "tools": {
    "restrictToWorkspace": true,
    "deniedCommands": [
      "rm -rf",
      "sudo",
      "chmod",
      "chown",
      "mkfs",
      "dd",
      ":(){ :|:& };:"
    ]
  }
}
```

For development with specific tools:

```json
{
  "tools": {
    "allowedCommands": [
      "git",
      "npm",
      "node",
      "tsc",
      "eslint",
      "prettier"
    ]
  }
}
```

## Channels Configuration

Configure chat platform integrations. Most channels are deferred in the current MVP version, but the configuration structure is prepared for future implementation.

### Telegram

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allowFrom": ["username1", "username2"]  // Optional: Whitelist users
    }
  }
}
```

### Discord

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allowFrom": ["user_id1", "user_id2"]  // Optional: Whitelist users
    }
  }
}
```

### Slack

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-...",
      "appToken": "xapp-...",
      "groupPolicy": "mention"  // "mention", "open", or "allowlist"
    }
  }
}
```

### Email

```json
{
  "channels": {
    "email": {
      "enabled": true,
      "consentGranted": true,
      "imapHost": "imap.gmail.com",
      "imapPort": 993,
      "imapUsername": "your-email@gmail.com",
      "imapPassword": "your-app-password",
      "smtpHost": "smtp.gmail.com",
      "smtpPort": 587,
      "smtpUsername": "your-email@gmail.com",
      "smtpPassword": "your-app-password",
      "fromAddress": "your-email@gmail.com",
      "allowFrom": ["trusted@example.com"]
    }
  }
}
```

### Feishu (飞书)

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "YOUR_APP_ID",
      "appSecret": "YOUR_APP_SECRET",
      "encryptKey": "YOUR_ENCRYPT_KEY",
      "verificationToken": "YOUR_TOKEN",
      "allowFrom": ["user_id1", "user_id2"]
    }
  }
}
```

### Other Channels

Similar configuration patterns exist for:
- **WhatsApp**
- **QQ**
- **DingTalk** (钉钉)
- **Mochat**

See `src/config/schema.ts` for complete schema definitions.

## Environment Variables

You can override configuration using environment variables:

```bash
# Provider API Keys
export OPENROUTER_API_KEY="sk-or-v1-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export DEEPSEEK_API_KEY="..."
export GROQ_API_KEY="..."
export GEMINI_API_KEY="..."

# Logging
export LOG_LEVEL="debug"  # debug, info, warn, error
export NODE_ENV="production"  # production, development
```

Environment variables take precedence over config file settings.

## Complete Example

Here's a complete configuration example:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    },
    "anthropic": {
      "apiKey": "sk-ant-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "systemPrompt": "You are a helpful AI assistant specialized in software development."
    }
  },
  "tools": {
    "restrictToWorkspace": false,
    "deniedCommands": [
      "rm -rf /",
      "sudo",
      "mkfs"
    ]
  },
  "channels": {
    "telegram": {
      "enabled": false
    },
    "discord": {
      "enabled": false
    }
  }
}
```

## Validation

The configuration is validated using Zod schemas. Invalid configurations will produce clear error messages:

```bash
nano-claw status
# Error: Invalid configuration: temperature must be between 0 and 2
```

## Configuration Files Location

- **Config**: `~/.nano-claw/config.json`
- **Memory**: `~/.nano-claw/memory/`
- **Skills**: `~/.nano-claw/skills/`
- **Cron Jobs**: `~/.nano-claw/cron.json`
- **Logs**: `~/.nano-claw/logs/`

## Tips

1. **Start Simple**: Begin with just one provider (OpenRouter recommended)
2. **Test Configuration**: Run `nano-claw status` to verify your setup
3. **Use Environment Variables**: For sensitive data in shared environments
4. **Backup Config**: Keep a backup of your working configuration
5. **Check Logs**: Logs are stored in `~/.nano-claw/logs/` for troubleshooting

## Troubleshooting

### "Configuration file not found"

Run `nano-claw onboard` to initialize the configuration.

### "Invalid API key"

Check that your API key is correct and has proper permissions.

### "Model not found"

Verify the model name is correct for your provider. Use `nano-claw status` to see available models.

### "Permission denied"

Check file permissions on `~/.nano-claw/` directory:

```bash
chmod 700 ~/.nano-claw
chmod 600 ~/.nano-claw/config.json
```

## Next Steps

- Read [QUICKSTART.md](QUICKSTART.md) for getting started
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guide

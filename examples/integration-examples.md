# Integration Examples

Learn how to integrate nano-claw with various chat platforms and services.

## Table of Contents

- [Telegram Integration](#telegram-integration)
- [Discord Integration](#discord-integration)
- [Multiple Provider Setup](#multiple-provider-setup)
- [Local Model Integration (vLLM)](#local-model-integration-vllm)

---

## Telegram Integration

Set up nano-claw as a Telegram bot to chat with your AI assistant on the go.

### Prerequisites

- A Telegram account
- nano-claw installed and configured
- Basic nano-claw configuration (API key set up)

### Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat and send `/newbot`
3. Follow the prompts to choose a name and username for your bot
4. BotFather will provide you with a token like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**Example conversation with BotFather:**
```text
You: /newbot
BotFather: Alright, a new bot. How are we going to call it? Please choose a name for your bot.

You: My nano-claw Bot
BotFather: Good. Now let's choose a username for your bot. It must end in `bot`.

You: my_nanoclaw_bot
BotFather: Done! Congratulations on your new bot. You will find it at t.me/my_nanoclaw_bot.
You can now add a description...

Here is your token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Step 2: Configure Telegram in nano-claw

Edit `~/.nano-claw/config.json` and add the Telegram configuration:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      "allowFrom": ["your_telegram_username"]
    }
  }
}
```

**Configuration Options:**
- `enabled`: Set to `true` to activate the Telegram channel
- `token`: Your bot token from BotFather
- `allowFrom`: (Optional) Array of Telegram usernames that can use the bot. Leave empty for public access.

### Step 3: Start the Gateway Server

The gateway server manages all chat channel connections:

```bash
nano-claw gateway
```

**Expected Output:**
```text
🚀 Starting nano-claw Gateway Server...

✓ Telegram channel initialized
  Bot Username: @my_nanoclaw_bot
  Allowed Users: your_telegram_username

🌐 Gateway server running
Press Ctrl+C to stop
```

### Step 4: Chat with Your Bot

1. Open Telegram
2. Search for your bot by username (e.g., `@my_nanoclaw_bot`)
3. Start a conversation with `/start`
4. Send any message to chat with nano-claw!

**Example Conversation:**
```text
You: /start
Bot: Hello! I'm your nano-claw assistant. How can I help you today?

You: What's the weather like today?
Bot: I don't have real-time internet access, but I can help you find weather 
information. What's your location?

You: Can you write a Python function for me?
Bot: Of course! What should the function do?

You: Calculate the sum of a list of numbers
Bot: Here's a Python function that calculates the sum of a list:

```python
def sum_list(numbers: list[float]) -> float:
    """Calculate the sum of numbers in a list."""
    return sum(numbers)

# Example usage:
my_numbers = [1, 2, 3, 4, 5]
result = sum_list(my_numbers)
print(result)  # Output: 15
```
```

### Security Tips

- **Use `allowFrom`**: Restrict bot access to specific users
- **Keep Token Secret**: Never commit your bot token to version control
- **Use Environment Variables**: Store the token in an environment variable:

```bash
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
nano-claw gateway
```

---

## Discord Integration

Connect nano-claw to Discord to create a server assistant.

### Prerequisites

- A Discord account
- Administrator access to a Discord server
- nano-claw installed and configured

### Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "nano-claw Bot")
4. Click "Create"

### Step 2: Create a Bot User

1. In your application, go to the "Bot" section
2. Click "Add Bot"
3. Confirm by clicking "Yes, do it!"
4. Under "Token", click "Copy" to copy your bot token
5. Enable these **Privileged Gateway Intents**:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### Step 3: Invite Bot to Your Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Read Message History
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### Step 4: Configure Discord in nano-claw

Edit `~/.nano-claw/config.json`:

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
  },
  "channels": {
    "discord": {
      "enabled": true,
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "allowFrom": ["USER_ID_1", "USER_ID_2"]
    }
  }
}
```

**Getting User IDs:**
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on a user and select "Copy ID"

### Step 5: Start the Gateway Server

```bash
nano-claw gateway
```

**Expected Output:**
```text
🚀 Starting nano-claw Gateway Server...

✓ Discord channel initialized
  Bot: nano-claw Bot#1234
  Servers: 1

🌐 Gateway server running
Press Ctrl+C to stop
```

### Step 6: Use the Bot

In your Discord server:
- **Mention the bot**: `@nano-claw help me with something`
- **Direct message**: Send a DM to the bot

**Example Interaction:**
```text
User: @nano-claw What is TypeScript?

nano-claw Bot: TypeScript is a strongly-typed programming language 
that builds on JavaScript. It adds optional static typing, which 
helps catch errors during development and provides better IDE support.

User: @nano-claw Can you create a simple Express server example?

nano-claw Bot: Sure! Here's a simple Express server in TypeScript:
...
```

---

## Multiple Provider Setup

Use multiple LLM providers for redundancy and flexibility.

### Configuration

Configure multiple providers in `~/.nano-claw/config.json`:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    },
    "anthropic": {
      "apiKey": "sk-ant-YOUR_KEY_HERE"
    },
    "openai": {
      "apiKey": "sk-YOUR_KEY_HERE"
    },
    "groq": {
      "apiKey": "gsk_YOUR_KEY_HERE"
    },
    "deepseek": {
      "apiKey": "YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  }
}
```

### Usage

nano-claw automatically selects the correct provider based on the model name:

```bash
# Uses OpenRouter
nano-claw agent -m "Hello" --model "anthropic/claude-opus-4-5"

# Uses Anthropic directly
nano-claw agent -m "Hello" --model "claude-opus-4-5"

# Uses OpenAI
nano-claw agent -m "Hello" --model "gpt-4-turbo"

# Uses Groq
nano-claw agent -m "Hello" --model "mixtral-8x7b-32768"
```

### Provider Selection Logic

| Model Name Pattern | Provider Used |
|-------------------|---------------|
| `anthropic/*` | OpenRouter |
| `openai/*` | OpenRouter |
| `claude-*` | Anthropic |
| `gpt-*` | OpenAI |
| `mixtral-*` | Groq |
| `deepseek-*` | DeepSeek |

### Benefits

- **Redundancy**: Fallback if one provider is down
- **Cost Optimization**: Use cheaper models for simple tasks
- **Feature Access**: Access provider-specific models
- **Testing**: Compare different models easily

---

## Local Model Integration (vLLM)

Run nano-claw with local LLM models using vLLM for complete privacy and control.

### Prerequisites

- Python 3.8+
- CUDA-compatible GPU (recommended)
- Sufficient VRAM (depends on model size)
- Docker (optional, for easier setup)

### Option 1: Using Docker

#### Step 1: Start vLLM Server

```bash
docker run --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model mistralai/Mistral-7B-Instruct-v0.2
```

**For larger models:**
```bash
# Llama 3 8B
docker run --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model meta-llama/Meta-Llama-3-8B-Instruct

# Mixtral 8x7B (requires ~90GB VRAM)
docker run --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model mistralai/Mixtral-8x7B-Instruct-v0.1
```

### Option 2: Manual Installation

#### Step 1: Install vLLM

```bash
pip install vllm
```

#### Step 2: Start vLLM Server

```bash
python -m vllm.entrypoints.openai.api_server \
  --model mistralai/Mistral-7B-Instruct-v0.2 \
  --port 8000
```

### Configure nano-claw

Edit `~/.nano-claw/config.json`:

```json
{
  "providers": {
    "vllm": {
      "apiBase": "http://localhost:8000/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "mistralai/Mistral-7B-Instruct-v0.2",
      "temperature": 0.7,
      "maxTokens": 2048
    }
  }
}
```

### Usage

```bash
# Check if vLLM is running
curl http://localhost:8000/v1/models

# Use with nano-claw
nano-claw agent -m "Hello! Can you introduce yourself?"
```

**Expected Output:**
```text
🤖 Agent: Hello! I'm an AI assistant running on your local machine using the 
Mistral-7B model. I can help you with various tasks while keeping all your data 
private and secure. How can I assist you today?
```

### Performance Tips

1. **GPU Selection**: Use specific GPUs if you have multiple
   ```bash
   CUDA_VISIBLE_DEVICES=0 python -m vllm.entrypoints.openai.api_server ...
   ```

2. **Batch Size**: Adjust for better throughput
   ```bash
   python -m vllm.entrypoints.openai.api_server \
     --model mistralai/Mistral-7B-Instruct-v0.2 \
     --max-num-seqs 256
   ```

3. **Quantization**: Use quantized models for less VRAM
   ```bash
   python -m vllm.entrypoints.openai.api_server \
     --model TheBloke/Mistral-7B-Instruct-v0.2-GPTQ \
     --quantization gptq
   ```

### Available Local Models

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| Mistral-7B | 7B | ~16GB | General use |
| Llama-3-8B | 8B | ~18GB | Reasoning |
| Mixtral-8x7B | 47B | ~90GB | Complex tasks |
| CodeLlama-7B | 7B | ~16GB | Coding |
| Phi-2 | 2.7B | ~8GB | Fast responses |

### Benefits of Local Models

- ✅ **Complete Privacy**: All data stays on your machine
- ✅ **No API Costs**: Free inference after initial setup
- ✅ **No Rate Limits**: Use as much as you want
- ✅ **Offline Operation**: Works without internet
- ✅ **Customization**: Fine-tune models for your needs

### Troubleshooting

**Out of Memory Error:**
- Use a smaller model
- Enable quantization
- Reduce max sequence length
- Close other GPU applications

**Slow Response:**
- Check GPU utilization: `nvidia-smi`
- Increase batch size
- Use a smaller model
- Consider using CPU offloading

---

## Combined Setup Example

Use everything together for maximum flexibility:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    },
    "anthropic": {
      "apiKey": "sk-ant-xxx"
    },
    "vllm": {
      "apiBase": "http://localhost:8000/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "TELEGRAM_TOKEN"
    },
    "discord": {
      "enabled": true,
      "token": "DISCORD_TOKEN"
    }
  }
}
```

This setup allows you to:
- Chat via Telegram and Discord
- Use cloud models for complex tasks
- Fall back to local models for privacy-sensitive tasks
- Have full redundancy and flexibility

---

## Next Steps

- [Advanced Features](./advanced-features.md) - Custom skills and automation
- [Use Case Scenarios](./use-case-scenarios.md) - Real-world examples
- [Configuration Guide](../documentation/CONFIGURATION.md) - Complete reference
- [Basic Usage](./basic-usage.md) - Getting started guide

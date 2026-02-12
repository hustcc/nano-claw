# Code Recipes and Configuration Patterns

Common configuration patterns, code snippets, and solutions to frequent problems.

## Table of Contents

- [Configuration Recipes](#configuration-recipes)
- [Troubleshooting Solutions](#troubleshooting-solutions)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)
- [Testing Strategies](#testing-strategies)

---

## Configuration Recipes

### Recipe 1: Minimal Setup (Quick Start)

**Goal:** Get started with nano-claw in under 2 minutes.

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

**Usage:**
```bash
nano-claw onboard
# Edit ~/.nano-claw/config.json with above content
nano-claw agent -m "Hello!"
```

---

### Recipe 2: Multi-Provider Redundancy

**Goal:** Configure multiple providers for fallback and cost optimization.

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE",
      "enabled": true
    },
    "anthropic": {
      "apiKey": "sk-ant-YOUR_KEY_HERE",
      "enabled": true
    },
    "groq": {
      "apiKey": "gsk_YOUR_KEY_HERE",
      "enabled": true
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096
    },
    "fastModel": {
      "model": "mixtral-8x7b-32768",
      "temperature": 0.5,
      "maxTokens": 2048
    }
  }
}
```

**Usage:**
```bash
# Use default (Claude Opus via OpenRouter)
nano-claw agent -m "Complex task requiring reasoning"

# Use fast model (Mixtral via Groq)
nano-claw agent --model "mixtral-8x7b-32768" -m "Simple question"
```

**Cost Optimization Strategy:**
- Use Claude Opus for complex reasoning tasks
- Use Mixtral (Groq) for simple tasks (much cheaper/free)
- Use GPT-4 for tasks requiring latest knowledge

---

### Recipe 3: Secure Production Setup

**Goal:** Production-ready configuration with security and tool restrictions.

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "${OPENROUTER_API_KEY}",
      "enabled": true
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "systemPrompt": "You are a helpful assistant. Always confirm before executing destructive operations."
    }
  },
  "tools": {
    "restrictToWorkspace": true,
    "deniedCommands": [
      "rm -rf",
      "rm -rf /",
      "sudo",
      "chmod 777",
      "mkfs",
      "dd",
      ":(){ :|:& };:",
      "curl | bash",
      "wget | bash"
    ],
    "allowedCommands": [
      "git",
      "npm",
      "node",
      "python",
      "tsc",
      "eslint",
      "prettier",
      "docker ps",
      "docker logs"
    ]
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}",
      "allowFrom": ["${TELEGRAM_USERNAME}"]
    }
  }
}
```

**Environment Setup:**
```bash
# .env file
OPENROUTER_API_KEY=sk-or-v1-xxx
TELEGRAM_BOT_TOKEN=123456789:ABCxxx
TELEGRAM_USERNAME=your_username

# Load environment variables
export $(cat .env | xargs)

# Start nano-claw
nano-claw gateway
```

**Security Features:**
- ✅ API keys from environment (not in config file)
- ✅ Restricted to workspace directory
- ✅ Blocked dangerous commands
- ✅ Whitelisted safe commands
- ✅ Limited Telegram access to specific users
- ✅ Explicit confirmation for destructive operations

---

### Recipe 4: Development Environment

**Goal:** Configuration optimized for software development workflows.

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
      "maxTokens": 4096,
      "systemPrompt": "You are an expert software development assistant. You help with coding, debugging, architecture decisions, and code reviews. Always provide well-commented code examples."
    }
  },
  "tools": {
    "restrictToWorkspace": false,
    "allowedCommands": [
      "git",
      "npm",
      "yarn",
      "pnpm",
      "node",
      "python",
      "pip",
      "go",
      "cargo",
      "tsc",
      "eslint",
      "prettier",
      "jest",
      "vitest",
      "docker",
      "docker-compose",
      "kubectl",
      "terraform"
    ]
  }
}
```

**Custom Skills:** Add development-focused skills to `~/.nano-claw/skills/`:

**`~/.nano-claw/skills/code-review.md`:**
```markdown
# Code Review Assistant

## Review Checklist

- Code style and formatting
- Error handling
- Type safety
- Performance concerns
- Security vulnerabilities
- Test coverage
- Documentation
- Code duplication

## Common Issues

### TypeScript
- Missing type annotations
- Using `any` type
- Not handling null/undefined
- Ignoring strict mode violations

### JavaScript/Node.js
- Not handling async errors
- Memory leaks (event listeners)
- Not validating input
- Hardcoded secrets

### React
- Missing key props
- Infinite render loops
- Not cleaning up effects
- Prop drilling issues
```

---

### Recipe 5: Personal Productivity Setup

**Goal:** Configuration for personal task management and daily assistance.

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
      "temperature": 0.8,
      "systemPrompt": "You are a helpful personal assistant. Help with task planning, time management, note-taking, and general productivity. Be encouraging and positive."
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TELEGRAM_TOKEN"
    }
  }
}
```

**Automated Daily Tasks:**
```bash
# Morning briefing
nano-claw cron add "0 8 * * 1-5" "Give me a morning briefing: today's date, a motivational quote, and remind me to check my calendar"

# Lunch break reminder
nano-claw cron add "0 12 * * 1-5" "Remind me to take a lunch break"

# End of day summary
nano-claw cron add "0 17 * * 1-5" "Help me wrap up the day: what should I document, what's pending for tomorrow?"

# Weekly planning
nano-claw cron add "0 9 * * 1" "Let's plan the week ahead. Ask me about my priorities."
```

**Custom Skills:** `~/.nano-claw/skills/productivity.md`
```markdown
# Productivity Assistant

## Time Management

### Pomodoro Technique
- 25 minutes focused work
- 5 minutes break
- After 4 pomodoros: 15-30 min break

### Time Blocking
- Morning: Deep work (9-12)
- Afternoon: Meetings (1-3)
- Late afternoon: Admin (3-5)

## Task Prioritization

### Eisenhower Matrix
1. Urgent + Important → Do now
2. Important + Not Urgent → Schedule
3. Urgent + Not Important → Delegate
4. Neither → Eliminate

## Daily Template

Morning:
- [ ] Review calendar
- [ ] Identify MIT (Most Important Task)
- [ ] Check emails (15 min limit)

Midday:
- [ ] Complete MIT
- [ ] Take lunch break
- [ ] Quick planning for afternoon

Evening:
- [ ] Review accomplishments
- [ ] Plan tomorrow
- [ ] Clear workspace
```

---

### Recipe 6: Chat Platform Integration

**Goal:** Set up nano-claw as a team assistant on multiple platforms.

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-YOUR_KEY_HERE"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4",
      "temperature": 0.7,
      "maxTokens": 2048
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}",
      "allowFrom": ["user1", "user2", "user3"]
    },
    "discord": {
      "enabled": true,
      "token": "${DISCORD_BOT_TOKEN}",
      "allowFrom": ["USER_ID_1", "USER_ID_2"]
    }
  },
  "tools": {
    "restrictToWorkspace": true,
    "deniedCommands": ["rm", "sudo", "chmod"]
  }
}
```

**Start Gateway Server:**
```bash
# With environment variables
export TELEGRAM_BOT_TOKEN="your_token"
export DISCORD_BOT_TOKEN="your_token"
nano-claw gateway
```

**Use Cases:**
- Team members can ask questions via Telegram/Discord
- Get code help without leaving chat apps
- Automated notifications from cron tasks
- Shared knowledge base through custom skills

---

### Recipe 7: Local-Only (Privacy-First)

**Goal:** Run completely offline with local models.

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
  },
  "tools": {
    "restrictToWorkspace": true
  }
}
```

**Setup vLLM Server:**
```bash
# Start vLLM with local model
docker run --gpus all \
  -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model mistralai/Mistral-7B-Instruct-v0.2

# Use nano-claw
nano-claw agent -m "Hello!"
```

**Benefits:**
- ✅ Complete privacy (no data leaves your machine)
- ✅ No API costs
- ✅ No rate limits
- ✅ Works offline
- ✅ Full control over model

**Limitations:**
- ⚠️ Requires GPU with sufficient VRAM
- ⚠️ Slower than cloud models
- ⚠️ Lower quality than top-tier models (GPT-4, Claude Opus)

---

## Troubleshooting Solutions

### Problem 1: "Configuration file not found"

**Symptom:**
```bash
$ nano-claw agent -m "Hello"
Error: Configuration file not found at ~/.nano-claw/config.json
```

**Solution:**
```bash
# Initialize configuration
nano-claw onboard

# Verify file exists
ls -la ~/.nano-claw/config.json

# If still missing, create manually
mkdir -p ~/.nano-claw
cat > ~/.nano-claw/config.json << 'EOF'
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
EOF
```

---

### Problem 2: "Provider API Error: 401 Unauthorized"

**Symptom:**
```bash
$ nano-claw agent -m "Hello"
Error: Provider API Error: 401 Unauthorized
```

**Solutions:**

**Check 1: Verify API key is correct**
```bash
# View current config (redacted)
nano-claw status

# Check API key format
cat ~/.nano-claw/config.json | jq '.providers.openrouter.apiKey'
```

**Check 2: Test API key directly**
```bash
# Test OpenRouter API key
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer sk-or-v1-YOUR_KEY_HERE"

# Should return list of models, not 401
```

**Check 3: Verify account has credits**
- Go to https://openrouter.ai/credits
- Check your credit balance
- Add credits if needed

**Check 4: Use environment variable instead**
```bash
export OPENROUTER_API_KEY="sk-or-v1-YOUR_KEY_HERE"
nano-claw agent -m "Hello"
```

---

### Problem 3: "Model not found"

**Symptom:**
```bash
$ nano-claw agent --model "gpt-5" -m "Hello"
Error: Model 'gpt-5' not found
```

**Solution:**

**Check available models:**
```bash
# For OpenRouter
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_KEY" | jq '.data[].id'

# Common working models:
# - anthropic/claude-opus-4-5
# - anthropic/claude-sonnet-4
# - openai/gpt-4-turbo
# - openai/gpt-4o
# - meta-llama/llama-3.1-70b-instruct
```

**Fix config:**
```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"  // Use valid model name
    }
  }
}
```

---

### Problem 4: Infinite Loop / High API Usage

**Symptom:**
- Unexpected high API costs
- Many requests to LLM provider
- Slow performance

**Diagnostic:**
```bash
# Check session files for size
ls -lh ~/.nano-claw/memory/

# Large session files indicate too much context
# If any file is > 1MB, there might be an issue
```

**Solution 1: Clear session memory**
```bash
# Clear specific session
rm ~/.nano-claw/memory/your-session.json

# Or clear all sessions
rm ~/.nano-claw/memory/*.json
```

**Solution 2: Reduce max tokens**
```json
{
  "agents": {
    "defaults": {
      "maxTokens": 2048  // Reduce from 4096
    }
  }
}
```

**Solution 3: Use cheaper model for testing**
```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4"  // Cheaper than opus
    }
  }
}
```

---

### Problem 5: Tool Execution Permission Denied

**Symptom:**
```bash
$ nano-claw agent -m "List files in /etc"
Error: Permission denied: Access to /etc is restricted
```

**Solution:**

**Option 1: Disable workspace restriction**
```json
{
  "tools": {
    "restrictToWorkspace": false
  }
}
```

**Option 2: Change working directory**
```bash
# Run from allowed directory
cd ~/my-project
nano-claw agent -m "List files here"
```

**Option 3: Use allowed commands**
```bash
# If command is in allowedCommands list
nano-claw agent -m "Run: git status"
```

---

### Problem 6: Telegram/Discord Bot Not Responding

**Symptom:**
- Bot appears online but doesn't respond
- Messages are ignored

**Diagnostics:**

**Check 1: Gateway server running?**
```bash
ps aux | grep "nano-claw gateway"
```

**Check 2: Check logs**
```bash
tail -f ~/.nano-claw/logs/gateway.log
```

**Check 3: Test bot token**
```bash
# Telegram
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# Should return bot info, not error
```

**Solutions:**

**Restart gateway:**
```bash
# Find and kill gateway process
pkill -f "nano-claw gateway"

# Start fresh
nano-claw gateway
```

**Verify allowFrom list:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "allowFrom": []  // Empty = allow all, or add your username
    }
  }
}
```

**Check bot permissions (Discord):**
- Ensure bot has "Read Messages" and "Send Messages" permissions
- Check bot role is high enough in server hierarchy

---

## Security Best Practices

### Practice 1: Never Commit Secrets

**Bad:**
```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-12345abcde"  // ❌ DON'T do this in Git
    }
  }
}
```

**Good:**
```json
{
  "providers": {
    "openrouter": {
      "apiKey": "${OPENROUTER_API_KEY}"  // ✅ Use env variable
    }
  }
}
```

**Even Better:**
```bash
# .env (add to .gitignore!)
OPENROUTER_API_KEY=sk-or-v1-12345abcde

# .gitignore
.env
*.json
config.json

# Load and use
export $(cat .env | xargs)
nano-claw agent -m "Hello"
```

---

### Practice 2: Restrict Tool Access

**Bad:**
```json
{
  "tools": {
    "restrictToWorkspace": false,
    "allowedCommands": [],  // Allow everything
    "deniedCommands": []
  }
}
```

**Good:**
```json
{
  "tools": {
    "restrictToWorkspace": true,  // Limit to current directory
    "deniedCommands": [
      "rm -rf",
      "rm -rf /",
      "sudo",
      "chmod 777",
      "mkfs",
      "dd",
      "curl | bash",
      "wget | sh"
    ]
  }
}
```

**Best:**
```json
{
  "tools": {
    "restrictToWorkspace": true,
    "allowedCommands": [  // Whitelist only needed commands
      "git",
      "npm",
      "node",
      "cat",
      "ls",
      "grep"
    ]
  }
}
```

---

### Practice 3: Limit Channel Access

**Bad:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TOKEN",
      "allowFrom": []  // ❌ Anyone can use your bot
    }
  }
}
```

**Good:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "${TELEGRAM_BOT_TOKEN}",
      "allowFrom": ["your_username", "teammate1", "teammate2"]  // ✅ Whitelist
    }
  }
}
```

---

### Practice 4: Use Appropriate Permissions

**File Permissions:**
```bash
# Config file should be readable only by you
chmod 600 ~/.nano-claw/config.json

# Directory should be accessible only by you
chmod 700 ~/.nano-claw

# Verify
ls -la ~/.nano-claw/
```

---

### Practice 5: Regular Security Audits

**Checklist:**
```bash
# 1. Review config file
cat ~/.nano-claw/config.json

# 2. Check for secrets in Git
git log -p | grep -i "apikey\|secret\|password\|token"

# 3. Review allowed/denied commands
jq '.tools' ~/.nano-claw/config.json

# 4. Check who can access via channels
jq '.channels' ~/.nano-claw/config.json

# 5. Review cron tasks
nano-claw cron list
```

---

## Performance Optimization

### Optimization 1: Choose Right Model for Task

**Strategy:**
- Use **Claude Opus** for complex reasoning, architecture decisions
- Use **Claude Sonnet** for balanced performance/cost
- Use **GPT-4 Turbo** for latest knowledge
- Use **Mixtral** (via Groq) for simple, fast tasks

**Configuration:**
```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4"  // Balanced default
    }
  }
}
```

**Usage:**
```bash
# Complex task - use Opus
nano-claw agent --model "anthropic/claude-opus-4-5" \
  -m "Design a scalable microservices architecture"

# Simple task - use Mixtral (fast & cheap)
nano-claw agent --model "mixtral-8x7b-32768" \
  -m "What is 2+2?"
```

---

### Optimization 2: Manage Context Window

**Problem:** Large context = slower responses & higher costs

**Solutions:**

**1. Use separate sessions:**
```bash
# Different topics in different sessions
nano-claw agent --session work -m "Work question"
nano-claw agent --session personal -m "Personal question"
```

**2. Clear context when changing topics:**
```bash
nano-claw agent -m "clear"  # Clear current session
```

**3. Reduce max tokens:**
```json
{
  "agents": {
    "defaults": {
      "maxTokens": 2048  // Instead of 4096
    }
  }
}
```

---

### Optimization 3: Batch Similar Tasks

**Instead of:**
```bash
nano-claw agent -m "Analyze file1.ts"
nano-claw agent -m "Analyze file2.ts"
nano-claw agent -m "Analyze file3.ts"
```

**Do this:**
```bash
nano-claw agent -m "Analyze these files: file1.ts, file2.ts, file3.ts. 
Provide a summary of issues found in each."
```

**Benefits:**
- Fewer API calls
- Shared context across files
- Better comparative analysis

---

### Optimization 4: Use Subagents for Parallel Tasks

**Sequential (slow):**
```bash
nano-claw agent -m "Research topic A, then topic B, then topic C"
```

**Parallel (fast):**
```bash
nano-claw agent -m "Research topics A, B, and C in parallel using subagents"
```

---

## Testing Strategies

### Strategy 1: Test Configuration

**Test Script:** `test-config.sh`
```bash
#!/bin/bash

echo "Testing nano-claw configuration..."

# Test 1: Config file exists
if [ ! -f ~/.nano-claw/config.json ]; then
  echo "❌ Config file not found"
  exit 1
fi
echo "✓ Config file exists"

# Test 2: Valid JSON
if ! jq empty ~/.nano-claw/config.json 2>/dev/null; then
  echo "❌ Invalid JSON in config"
  exit 1
fi
echo "✓ Valid JSON"

# Test 3: API key configured
if ! jq -e '.providers.openrouter.apiKey' ~/.nano-claw/config.json > /dev/null; then
  echo "❌ API key not configured"
  exit 1
fi
echo "✓ API key configured"

# Test 4: Simple query
if nano-claw agent -m "test" > /dev/null 2>&1; then
  echo "✓ Basic query works"
else
  echo "❌ Basic query failed"
  exit 1
fi

echo "✅ All tests passed!"
```

**Usage:**
```bash
chmod +x test-config.sh
./test-config.sh
```

---

### Strategy 2: Test API Connectivity

```bash
# Test OpenRouter
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-4-5",
    "messages": [{"role": "user", "content": "test"}]
  }'

# Should return a response, not 401
```

---

### Strategy 3: Integration Tests

**Test Telegram Bot:**
```bash
# Send test message to bot
curl https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=Test message from nano-claw"
```

**Test Discord Bot:**
```javascript
// test-discord.js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log('✓ Discord bot connected');
  client.destroy();
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

---

## Next Steps

- [Basic Usage](./basic-usage.md) - Getting started
- [Integration Examples](./integration-examples.md) - Chat platforms
- [Advanced Features](./advanced-features.md) - Custom skills and automation
- [Use Case Scenarios](./use-case-scenarios.md) - Real-world examples
- [Configuration Guide](../documentation/CONFIGURATION.md) - Complete reference

## Contributing

Have a useful recipe or pattern? Contribute it!
- Fork the repository
- Add your recipe to this file
- Submit a pull request
- Help others solve common problems

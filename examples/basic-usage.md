# Basic Usage Examples

This guide provides practical examples for getting started with nano-claw. Perfect for beginners!

## Prerequisites

- Node.js >= 18.0.0
- An API key from a supported LLM provider (we recommend OpenRouter)
- nano-claw installed (`npm install -g nano-claw`)

## Example 1: Your First Chat

### Step 1: Initialize nano-claw

```bash
# Initialize configuration
nano-claw onboard
```

This creates the configuration directory at `~/.nano-claw/` with the following structure:
```
~/.nano-claw/
├── config.json    # Configuration file
├── memory/        # Conversation history
├── skills/        # Custom skills
└── logs/          # Application logs
```

### Step 2: Configure Your API Key

Edit `~/.nano-claw/config.json` and add your API key:

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

### Step 3: Send Your First Message

```bash
nano-claw agent -m "Hello! Can you introduce yourself?"
```

**Expected Output:**
```
🤖 Agent: Processing your request...

Hello! I'm nano-claw, an ultra-lightweight AI assistant designed to help you with 
various tasks. I can:

- Answer questions and provide information
- Help with coding tasks
- Execute shell commands
- Manage files
- And much more!

What can I help you with today?
```

## Example 2: Simple Calculator

Ask nano-claw to perform calculations:

```bash
nano-claw agent -m "What is 1234 * 5678?"
```

**Expected Output:**
```
🤖 Agent: 1234 × 5678 = 7,006,652
```

## Example 3: Getting Information

Request information on any topic:

```bash
nano-claw agent -m "Explain what TypeScript is in 3 sentences"
```

**Expected Output:**
```
🤖 Agent: TypeScript is a strongly-typed programming language that builds on JavaScript,
developed by Microsoft. It adds optional static typing to JavaScript, which helps catch
errors during development and provides better tooling support. TypeScript code compiles
down to clean, readable JavaScript that can run anywhere JavaScript runs.
```

## Example 4: Interactive Mode

Start a continuous conversation:

```bash
nano-claw agent
```

**Session Example:**
````
🐈 nano-claw Interactive Mode

Type your message and press Enter. Type "exit" or "quit" to end.

You: What's the weather like today?

🤖 Agent: I don't have real-time internet access to check current weather.
However, if you tell me your location, I can help you find weather information
or suggest ways to check it.

You: Can you help me write a Python function?

🤖 Agent: Of course! What kind of function would you like me to help you create?
Please describe what you need it to do.

You: A function that reverses a string

🤖 Agent: Here's a simple Python function that reverses a string:

```python
def reverse_string(text: str) -> str:
    """
    Reverse a string.
    
    Args:
        text: The string to reverse
        
    Returns:
        The reversed string
    """
    return text[::-1]
```

# Example usage
original = "Hello, World!"
reversed_text = reverse_string(original)
print(f"Original: {original}")
print(f"Reversed: {reversed_text}")
# Output: !dlroW ,olleH

This uses Python's slicing notation [start:stop:step] with a step of -1 to reverse the string.

You: exit

👋 Goodbye!
````

## Example 5: Using Different Sessions

Separate conversations by session:

```bash
# Work session
nano-claw agent --session work -m "Help me review this code"

# Personal session
nano-claw agent --session personal -m "Plan my weekend activities"

# Project-specific session
nano-claw agent --session my-project -m "What tasks are left?"
```

Each session maintains its own conversation history and context.

## Example 6: File Operations

Create and read files using nano-claw:

```bash
nano-claw agent -m "Create a file called notes.txt with the content 'Hello from nano-claw!'"
```

**Expected Output:**
```
🤖 Agent: I'll create that file for you.

[Tool: write_file executed]
Path: notes.txt
Content: Hello from nano-claw!

✓ File created successfully: notes.txt
```

## Example 7: Shell Commands

Execute shell commands (use with caution!):

```bash
nano-claw agent -m "List all TypeScript files in the current directory"
```

**Expected Output:**
```
🤖 Agent: I'll list the TypeScript files for you.

[Tool: execute_shell executed]
Command: find . -name "*.ts" -type f

Files found:
./src/index.ts
./src/agent/loop.ts
./src/agent/context.ts
./src/utils/logger.ts
```

## Example 8: Code Generation

Request code snippets:

```bash
nano-claw agent -m "Write a TypeScript function to calculate the factorial of a number"
```

**Expected Output:**

````
🤖 Agent: Here's a TypeScript function to calculate factorial:

```typescript
/**
 * Calculate the factorial of a number using recursion
 * @param n - The number to calculate factorial for
 * @returns The factorial of n
 * @throws Error if n is negative
 */
function factorial(n: number): number {
  // Handle edge cases
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Recursive calculation
  return n * factorial(n - 1);
}

// Example usage:
console.log(factorial(5));  // Output: 120
console.log(factorial(0));  // Output: 1
console.log(factorial(10)); // Output: 3628800

// Iterative version (more efficient for large numbers):
function factorialIterative(n: number): number {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}
```

The recursive version is elegant but can hit stack limits with large numbers.
The iterative version is more efficient for production use.
````

## Example 9: Checking Status

View your current configuration:

```bash
nano-claw status
```

**Expected Output:**
```
📊 nano-claw Status

✓ Configuration loaded from: /home/user/.nano-claw/config.json

Providers:
  ✓ openrouter - Configured

Agent Settings:
  Model: anthropic/claude-opus-4-5
  Temperature: 0.7
  Max Tokens: 4096

Tools:
  Restrict to Workspace: false
  Allowed Commands: (all)
  Denied Commands: (none)

Channels:
  Telegram: ✗ Not configured
  Discord: ✗ Not configured
  
Memory:
  Sessions: 3
  Total Messages: 47
```

## Example 10: Using Environment Variables

Set API keys via environment variables:

```bash
# Set the API key
export OPENROUTER_API_KEY="sk-or-v1-YOUR_KEY_HERE"

# Now you can use nano-claw without modifying config.json
nano-claw agent -m "Hello!"
```

This is useful for:
- CI/CD environments
- Shared development machines
- Temporary API key changes
- Testing different providers

## Tips for Beginners

1. **Start Simple**: Begin with basic questions and gradually explore more features
2. **Use Sessions**: Organize different conversations by topic using `--session`
3. **Check Status Often**: Use `nano-claw status` to verify your setup
4. **Read Error Messages**: nano-claw provides helpful error messages
5. **Explore Interactive Mode**: Interactive mode is great for back-and-forth conversations
6. **Review Configuration**: Check `~/.nano-claw/config.json` to understand your settings

## Common Commands Reference

```bash
# Initialize configuration
nano-claw onboard

# Single message
nano-claw agent -m "Your message here"

# Interactive mode
nano-claw agent

# Session-specific chat
nano-claw agent --session my-session

# Check status
nano-claw status

# Start gateway server (for chat channels)
nano-claw gateway

# Manage cron tasks
nano-claw cron list
nano-claw cron add "0 9 * * *" "Daily briefing"
nano-claw cron remove <id>
```

## Next Steps

- [Integration Examples](./integration-examples.md) - Connect to chat platforms
- [Advanced Features](./advanced-features.md) - Custom skills, cron tasks, and more
- [Use Case Scenarios](./use-case-scenarios.md) - Real-world examples
- [Configuration Guide](../documentation/CONFIGURATION.md) - Complete configuration reference

## Getting Help

If you encounter issues:
1. Run `nano-claw status` to check your configuration
2. Check the logs at `~/.nano-claw/logs/`
3. Review the [Troubleshooting](../documentation/CONFIGURATION.md#troubleshooting) section
4. Open an issue on GitHub

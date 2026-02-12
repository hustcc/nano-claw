# nano-claw Examples

Comprehensive examples and guides to help you get the most out of nano-claw.

## 📚 Getting Started

New to nano-claw? Start here:

### [Basic Usage Examples](./basic-usage.md)
Perfect for beginners! Learn the fundamentals of nano-claw.

**Covers:**
- Your first chat with nano-claw
- Simple calculations and questions
- Interactive mode
- File operations
- Shell commands
- Code generation
- Session management

**Time to complete:** 15-20 minutes

---

## 🔌 Integration Guides

Connect nano-claw to your favorite platforms:

### [Integration Examples](./integration-examples.md)
Step-by-step guides for integrating nano-claw with chat platforms and services.

**Covers:**
- **Telegram Bot Integration** - Chat with nano-claw on your phone
- **Discord Bot Integration** - Add nano-claw to your Discord server
- **Multiple Provider Setup** - Configure multiple LLM providers
- **Local Model Integration (vLLM)** - Run completely private and offline

**Time to complete:** 30-45 minutes per integration

---

## 🚀 Advanced Features

Unlock the full power of nano-claw:

### [Advanced Features Examples](./advanced-features.md)
Deep dive into nano-claw's powerful capabilities.

**Covers:**
- **Custom Skill Development** - Create domain-specific knowledge
  - Database query assistant example
  - DevOps assistant example
- **Scheduled Tasks (Cron)** - Automate recurring tasks
  - Daily briefings
  - System health checks
  - Weekly reports
- **Memory & Context Management** - Understand how nano-claw remembers
  - Session-based conversations
  - Context window optimization
- **Subagent Usage** - Background and parallel task execution
  - File analysis
  - Parallel research
  - Monitoring tasks

**Time to complete:** 1-2 hours

---

## 💼 Use Case Scenarios

Real-world examples and complete workflows:

### [Use Case Scenarios](./use-case-scenarios.md)
See how others use nano-claw in production.

**Scenarios:**
1. **Developer Assistant**
   - Debugging help
   - Code generation
   - Architecture discussions

2. **Personal Productivity Assistant**
   - Daily planning
   - Task management
   - Note-taking

3. **Code Review Assistant**
   - Pull request reviews
   - Best practices enforcement
   - Security checks

4. **Research Assistant**
   - Technology comparisons
   - Information gathering
   - Documentation research

5. **DevOps Automation**
   - Deployment workflows
   - System monitoring
   - Incident response

6. **Learning & Education**
   - Interactive tutorials
   - Skill development
   - Code practice

**Time to complete:** Browse as needed

---

## 🧪 Configuration & Recipes

Practical configurations and solutions:

### [Code Recipes and Configuration Patterns](./code-recipes.md)
Common patterns, configurations, and troubleshooting solutions.

**Covers:**
- **Configuration Recipes**
  - Minimal setup (quick start)
  - Multi-provider redundancy
  - Secure production setup
  - Development environment
  - Personal productivity setup
  - Chat platform integration
  - Local-only (privacy-first)

- **Troubleshooting Solutions**
  - Configuration file not found
  - API authentication errors
  - Model not found
  - Infinite loops / high usage
  - Permission denied errors
  - Bot not responding

- **Security Best Practices**
  - Secret management
  - Tool access restrictions
  - Channel access control
  - File permissions
  - Security audits

- **Performance Optimization**
  - Model selection strategies
  - Context window management
  - Batch processing
  - Parallel execution

- **Testing Strategies**
  - Configuration testing
  - API connectivity tests
  - Integration tests

**Time to complete:** Reference as needed

---

## 🎯 Quick Reference

### By Experience Level

**Beginner (New to nano-claw)**
1. [Basic Usage](./basic-usage.md) - Start here!
2. [OpenRouter Setup](./openrouter-setup.md) - Configure your first provider
3. [Configuration Guide](../documentation/CONFIGURATION.md) - Understand the config

**Intermediate (Familiar with basics)**
1. [Integration Examples](./integration-examples.md) - Connect to platforms
2. [Advanced Features](./advanced-features.md) - Custom skills and automation
3. [Use Case Scenarios](./use-case-scenarios.md) - See real workflows

**Advanced (Power user)**
1. [Code Recipes](./code-recipes.md) - Advanced patterns
2. [Architecture](../documentation/ARCHITECTURE.md) - Understand internals
3. [Contributing](../CONTRIBUTING.md) - Extend nano-claw

---

### By Goal

**"I want to chat with an AI"**
→ [Basic Usage Examples](./basic-usage.md)

**"I want to use nano-claw on Telegram/Discord"**
→ [Integration Examples](./integration-examples.md)

**"I want to add custom knowledge to nano-claw"**
→ [Custom Skill Development](./advanced-features.md#custom-skill-development)

**"I want to automate daily tasks"**
→ [Scheduled Tasks](./advanced-features.md#scheduled-tasks-cron)

**"I want nano-claw to help me code"**
→ [Developer Assistant](./use-case-scenarios.md#developer-assistant)

**"I'm getting errors"**
→ [Troubleshooting Solutions](./code-recipes.md#troubleshooting-solutions)

**"I want maximum privacy"**
→ [Local Model Integration](./integration-examples.md#local-model-integration-vllm)

**"I need production-ready config"**
→ [Secure Production Setup](./code-recipes.md#recipe-3-secure-production-setup)

---

## 🛠️ Skills Examples

Pre-built skill examples for common tasks:

### [GitHub Integration Skill](./skills/github.md)
Interact with GitHub repositories, issues, and pull requests.

**Features:**
- Search repositories
- View repository information
- List issues and PRs
- Read file contents
- Check commit history

**Usage:** "Show me the README from the nano-claw repo"

---

### [Weather Information Skill](./skills/weather.md)
Get current weather information for any location.

**Features:**
- Current weather lookup
- Location-based queries

**Usage:** "What's the weather in San Francisco?"

---

## 📖 Additional Documentation

- [Quick Start Guide](../documentation/QUICKSTART.md) - 5-minute setup
- [Configuration Guide](../documentation/CONFIGURATION.md) - Complete config reference
- [Architecture](../documentation/ARCHITECTURE.md) - System design
- [Contributing Guide](../CONTRIBUTING.md) - Development guide
- [Main README](../README.md) - Project overview

---

## 🎓 Learning Path

Recommended order for learning nano-claw:

### Week 1: Basics
- Day 1-2: [Basic Usage](./basic-usage.md)
- Day 3-4: [Configuration Guide](../documentation/CONFIGURATION.md)
- Day 5: Experiment with different models and prompts

### Week 2: Integration
- Day 1-2: Choose an integration ([Telegram](./integration-examples.md#telegram-integration) or [Discord](./integration-examples.md#discord-integration))
- Day 3-4: [Custom Skills](./advanced-features.md#custom-skill-development)
- Day 5: Create your first custom skill

### Week 3: Automation
- Day 1-2: [Scheduled Tasks](./advanced-features.md#scheduled-tasks-cron)
- Day 3-4: [Memory Management](./advanced-features.md#memory-and-context-management)
- Day 5: Set up automated daily workflows

### Week 4: Advanced
- Day 1-2: [Subagents](./advanced-features.md#subagent-usage)
- Day 3-4: [Production Setup](./code-recipes.md#recipe-3-secure-production-setup)
- Day 5: Implement a complete use case

---

## 🤝 Community Examples

Share your examples! We'd love to see how you're using nano-claw:

**How to contribute:**
1. Fork the repository
2. Add your example to the appropriate file
3. Submit a pull request
4. Help others learn from your experience!

**What makes a good example:**
- Clear problem statement
- Step-by-step instructions
- Code with comments
- Expected output
- Common pitfalls to avoid

---

## 💡 Tips for Success

1. **Start Simple** - Begin with basic usage before diving into advanced features
2. **Experiment** - Try different models, prompts, and configurations
3. **Use Sessions** - Organize conversations by topic for better context
4. **Read Error Messages** - nano-claw provides helpful error messages
5. **Check Status** - Use `nano-claw status` to verify your setup
6. **Review Logs** - Logs at `~/.nano-claw/logs/` help with troubleshooting
7. **Backup Config** - Keep a backup of your working configuration
8. **Join Community** - Share experiences and learn from others

---

## 🐛 Found an Issue?

If you find errors or have suggestions for improving these examples:

1. Check [Troubleshooting](./code-recipes.md#troubleshooting-solutions)
2. Review [Configuration Guide](../documentation/CONFIGURATION.md)
3. Open an issue on GitHub with:
   - What you were trying to do
   - What happened
   - What you expected
   - Your configuration (without sensitive data)

---

## 📝 License

All examples are provided under the same license as nano-claw (MIT License).

Feel free to use, modify, and share these examples!

---

## ⭐ Show Your Support

If these examples helped you:
- Star the repository on GitHub
- Share nano-claw with others
- Contribute your own examples
- Provide feedback on what's helpful

Happy coding with nano-claw! 🦞

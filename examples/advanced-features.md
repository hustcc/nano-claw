# Advanced Features Examples

Explore advanced features of nano-claw including custom skills, scheduled tasks, memory management, and subagent execution.

## Table of Contents

- [Custom Skill Development](#custom-skill-development)
- [Scheduled Tasks (Cron)](#scheduled-tasks-cron)
- [Memory and Context Management](#memory-and-context-management)
- [Subagent Usage](#subagent-usage)

---

## Custom Skill Development

Create custom skills to extend nano-claw's capabilities with domain-specific knowledge.

### Understanding Skills

Skills are Markdown files that provide the agent with:
- Domain knowledge
- Usage instructions
- Capabilities and examples
- API documentation or references

Skills are automatically loaded from `~/.nano-claw/skills/` at startup.

### Example 1: Database Query Assistant Skill

Create a skill to help with SQL queries.

**File: `~/.nano-claw/skills/database.md`**

```markdown
# Database Query Assistant

This skill helps with SQL database operations and query optimization.

## Capabilities

- Write SQL queries (SELECT, INSERT, UPDATE, DELETE)
- Optimize slow queries
- Design database schemas
- Explain query execution plans
- Convert natural language to SQL

## Supported Databases

- PostgreSQL
- MySQL
- SQLite
- Microsoft SQL Server
- MongoDB (NoSQL queries)

## Usage Examples

### Simple SELECT Query
"Show me all users who registered in the last 30 days"

```sql
SELECT * FROM users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### JOIN Query
"Get all orders with customer names"

```sql
SELECT o.order_id, o.order_date, c.name, c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
ORDER BY o.order_date DESC;
```

### Aggregation
"Count users by country"

```sql
SELECT country, COUNT(*) as user_count
FROM users
GROUP BY country
ORDER BY user_count DESC;
```

## Query Optimization Tips

1. **Use indexes**: Create indexes on frequently queried columns
2. **Limit results**: Use LIMIT for large datasets
3. **Avoid SELECT ***: Specify only needed columns
4. **Use JOINs wisely**: Consider query plan and table sizes
5. **Analyze queries**: Use EXPLAIN to understand execution plans

## Common Patterns

### Pagination
```sql
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;  -- Page 1
```

### Full-Text Search (PostgreSQL)
```sql
SELECT * FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('search & terms');
```

### Subqueries
```sql
SELECT * FROM orders
WHERE customer_id IN (
  SELECT customer_id FROM customers WHERE country = 'USA'
);
```

## Schema Design Principles

- Normalize data to reduce redundancy
- Use appropriate data types
- Add foreign key constraints
- Create indexes on foreign keys
- Use meaningful table and column names
```

**Usage:**
```bash
nano-claw agent -m "Write a SQL query to find the top 5 customers by total order amount"
```

**Expected Response:**
```text
🤖 Agent: Here's a SQL query to find the top 5 customers by total order amount:

```sql
SELECT 
    c.customer_id,
    c.name,
    c.email,
    SUM(o.amount) as total_order_amount,
    COUNT(o.order_id) as order_count
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email
ORDER BY total_order_amount DESC
LIMIT 5;
```

This query:
1. Joins customers with their orders
2. Calculates total order amount per customer
3. Counts number of orders
4. Orders by total amount (highest first)
5. Limits to top 5 customers
```

### Example 2: DevOps Assistant Skill

**File: `~/.nano-claw/skills/devops.md`**

```markdown
# DevOps Assistant

Helper for common DevOps tasks, infrastructure management, and automation.

## Capabilities

- Docker commands and Dockerfile creation
- Kubernetes manifest generation
- CI/CD pipeline configuration
- Infrastructure as Code (Terraform, CloudFormation)
- System monitoring and logging
- Security best practices

## Docker Commands

### Build and Run
```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 8080:8080 --name myapp myapp:latest

# View logs
docker logs -f myapp

# Execute commands in container
docker exec -it myapp bash
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## Kubernetes Basics

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

## CI/CD Patterns

### GitHub Actions
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
      - name: Deploy
        run: npm run deploy
```

## Monitoring Commands

```bash
# System resources
top
htop
df -h
free -m

# Docker stats
docker stats

# Kubernetes resources
kubectl top nodes
kubectl top pods

# Logs
tail -f /var/log/app.log
journalctl -u myapp -f
```

## Security Best Practices

1. Use official base images
2. Scan images for vulnerabilities
3. Don't run containers as root
4. Use secrets management
5. Enable network policies
6. Keep systems updated
```

---

## Scheduled Tasks (Cron)

Automate recurring tasks using cron expressions.

### Understanding Cron Expressions

Cron format: `minute hour day month weekday`

```text
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (Sunday = 0 or 7)
│ │ │ │ │
* * * * *
```

### Common Patterns

| Pattern | Description |
|---------|-------------|
| `0 9 * * *` | Every day at 9:00 AM |
| `*/15 * * * *` | Every 15 minutes |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 0 1 * *` | First day of every month |
| `0 */2 * * *` | Every 2 hours |

### Example 1: Daily Morning Briefing

```bash
# Add a cron task for daily briefing
nano-claw cron add "0 9 * * *" "Give me a morning briefing with today's date and a motivational quote"
```

**What happens:**
- Every day at 9:00 AM, nano-claw will automatically execute the task
- Results can be sent to configured channels (Telegram, Discord, etc.)

### Example 2: Hourly System Health Check

```bash
# Add hourly health check
nano-claw cron add "0 * * * *" "Check system health: disk space, memory usage, and running processes"
```

### Example 3: Weekly Report

```bash
# Weekly report every Monday at 10 AM
nano-claw cron add "0 10 * * 1" "Generate a weekly summary report"
```

### Managing Cron Tasks

**List all cron tasks:**
```bash
nano-claw cron list
```

**Expected Output:**
```text
📅 Scheduled Cron Tasks

ID: 1
Schedule: 0 9 * * * (Every day at 9:00 AM)
Task: Give me a morning briefing with today's date and a motivational quote
Status: Active
Next run: 2024-01-15 09:00:00

ID: 2
Schedule: 0 * * * * (Every hour)
Task: Check system health: disk space, memory usage, and running processes
Status: Active
Next run: 2024-01-14 15:00:00

Total: 2 tasks
```

**Remove a cron task:**
```bash
nano-claw cron remove 1
```

### Advanced Cron Examples

**Backup reminder:**
```bash
nano-claw cron add "0 18 * * 5" "Remind me to backup important files. List the files in ~/Documents"
```

**Git repository check:**
```bash
nano-claw cron add "0 12 * * *" "Check if there are any uncommitted changes in ~/projects"
```

**Weather update:**
```bash
nano-claw cron add "0 7 * * *" "What's the weather forecast for today in San Francisco?"
```

### Cron with Channels

When channels are configured, cron task results are sent to your chat platform:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_TOKEN"
    }
  }
}
```

Now your daily briefing will appear in Telegram automatically!

---

## Memory and Context Management

Understand how nano-claw maintains conversation context and manage memory effectively.

### How Memory Works

nano-claw stores conversation history in `~/.nano-claw/memory/`:

```text
~/.nano-claw/memory/
├── default.json           # Default session
├── work.json             # Custom session "work"
├── personal.json         # Custom session "personal"
└── my-project.json       # Custom session "my-project"
```

Each session file contains:
- Message history
- Context from previous conversations
- Tool execution results

### Example 1: Session-Based Conversations

**Work Session:**
```bash
nano-claw agent --session work -m "Review the API design document"
# ... conversation about work ...
nano-claw agent --session work -m "What were we discussing earlier?"
```

**Expected Response:**
```text
🤖 Agent: We were discussing the API design document review. Would you 
like me to continue with that topic or help you with something else?
```

**Personal Session:**
```bash
nano-claw agent --session personal -m "Help me plan my weekend"
# ... conversation about personal plans ...
```

Each session maintains separate context!

### Example 2: Managing Context Window

For long conversations, clear context when switching topics:

```bash
# Start conversation
nano-claw agent --session work -m "Help me with Python code"

# ... many messages later ...

# Clear context for new topic
nano-claw agent --session work -m "clear"
nano-claw agent --session work -m "Now help me with DevOps"
```

### Example 3: Viewing Memory

Check what nano-claw remembers:

```bash
# View default session memory
cat ~/.nano-claw/memory/default.json | jq
```

**Sample Output:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is TypeScript?",
      "timestamp": "2024-01-14T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "TypeScript is a strongly-typed programming language...",
      "timestamp": "2024-01-14T10:30:05Z"
    }
  ],
  "metadata": {
    "created": "2024-01-14T10:30:00Z",
    "updated": "2024-01-14T10:35:00Z",
    "messageCount": 12
  }
}
```

### Example 4: Context-Aware Assistance

nano-claw uses context to provide better assistance:

**First message:**
```bash
nano-claw agent -m "I'm building a REST API with Express"
```

**Follow-up messages (context-aware):**
```bash
nano-claw agent -m "How do I add authentication?"
# Agent knows you're using Express

nano-claw agent -m "Show me error handling"
# Agent provides Express-specific error handling

nano-claw agent -m "How do I test it?"
# Agent suggests Express testing tools
```

### Memory Best Practices

1. **Use Sessions**: Separate different projects/topics
2. **Clear When Needed**: Clear context when switching major topics
3. **Keep Sessions Focused**: One topic per session for better context
4. **Review Memory**: Occasionally check what's stored
5. **Backup Important Sessions**: Copy session files you want to keep

---

## Subagent Usage

Subagents allow nano-claw to execute background tasks without blocking the main conversation.

### What are Subagents?

Subagents are background workers that can:
- Execute long-running tasks
- Process data asynchronously
- Perform scheduled operations
- Handle parallel workflows

### Example 1: Background File Analysis

**Request:**
```bash
nano-claw agent -m "Analyze all TypeScript files in ./src and create a summary report. Do this in the background."
```

**Response:**
```text
🤖 Agent: I'll start analyzing the TypeScript files in the background.

[Subagent Task Started]
Task ID: subagent-001
Status: Running

I'll notify you when the analysis is complete. You can continue working on other things.
```

**When complete:**
```text
[Subagent Task Completed: subagent-001]

Analysis Summary:
- Total files: 47
- Total lines: 5,234
- Components: 23
- Utilities: 12
- Tests: 12

Full report saved to: analysis-report.md
```

### Example 2: Parallel Research

Execute multiple research tasks simultaneously:

```bash
nano-claw agent -m "Research the following topics in parallel: 
1. Latest TypeScript features
2. Node.js performance best practices
3. Testing strategies for microservices
Compile a summary when all are done."
```

**Response:**
```text
🤖 Agent: I'll research these topics in parallel.

[Subagent Task Started: research-1]
Topic: Latest TypeScript features

[Subagent Task Started: research-2]
Topic: Node.js performance best practices

[Subagent Task Started: research-3]
Topic: Testing strategies for microservices

I'll compile the summary when all research is complete.
```

### Example 3: Monitoring Task

Start a continuous monitoring task:

```bash
nano-claw agent -m "Monitor the ./logs directory and alert me if any errors appear in the last 5 minutes. Check every minute."
```

This creates a subagent that:
- Runs in the background
- Checks logs every minute
- Alerts when errors are found
- Continues until stopped

### Example 4: Batch Processing

Process multiple items in parallel:

```bash
nano-claw agent -m "I have 100 images in ./images. Resize them all to 800x600. Use subagents to process them in parallel."
```

**Response:**
```text
🤖 Agent: I'll process the images using parallel subagents.

[Starting batch processing]
- Created 10 subagents
- Each handling 10 images
- Estimated time: 2-3 minutes

Progress: 
[████████████████░░░░] 80% (80/100 images)
```

### Subagent Configuration

Control subagent behavior in config:

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"
    },
    "subagents": {
      "maxConcurrent": 5,
      "timeout": 300000,
      "model": "anthropic/claude-sonnet-4"
    }
  }
}
```

**Options:**
- `maxConcurrent`: Maximum parallel subagents (default: 5)
- `timeout`: Task timeout in milliseconds (default: 5 minutes)
- `model`: Model to use for subagents (can be cheaper/faster than main agent)

### Subagent Best Practices

1. **Use for Long Tasks**: Don't block main conversation
2. **Parallel Processing**: Speed up batch operations
3. **Resource Management**: Limit concurrent subagents
4. **Cheaper Models**: Use faster models for simple subagent tasks
5. **Error Handling**: Subagents should handle failures gracefully

---

## Combining Advanced Features

### Example: Automated Daily Workflow

Combine cron, custom skills, and subagents:

**Setup:**

1. Create custom skill: `~/.nano-claw/skills/project-management.md`
2. Add cron task: `nano-claw cron add "0 9 * * 1-5" "Daily standup"`
3. Configure channels for notifications

**Custom Skill:**
```markdown
# Project Management Assistant

## Daily Standup Template

- Review yesterday's completed tasks
- List today's priorities
- Identify any blockers
- Check deadline status

## Task Management

Track tasks using categories:
- TODO: Not started
- IN_PROGRESS: Currently working
- BLOCKED: Waiting on something
- DONE: Completed
```

**Result:**
Every weekday at 9 AM:
1. Cron triggers the task
2. Agent uses project management skill
3. Creates standup summary
4. Uses subagent to check Git commits
5. Sends notification via Telegram/Discord

---

## Next Steps

- [Use Case Scenarios](./use-case-scenarios.md) - Real-world examples
- [Code Recipes](./code-recipes.md) - Configuration and code patterns
- [Basic Usage](./basic-usage.md) - Getting started guide
- [Integration Examples](./integration-examples.md) - Chat platforms

## Resources

- [Configuration Guide](../documentation/CONFIGURATION.md)
- [Architecture Overview](../documentation/ARCHITECTURE.md)
- [Contributing Guide](../CONTRIBUTING.md)

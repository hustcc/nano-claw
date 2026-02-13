# Use Case Scenarios

Real-world examples of how to use nano-claw for different purposes.

## Table of Contents

- [Developer Assistant](#developer-assistant)
- [Personal Productivity Assistant](#personal-productivity-assistant)
- [Code Review Assistant](#code-review-assistant)
- [Research Assistant](#research-assistant)
- [DevOps Automation](#devops-automation)
- [Learning and Education](#learning-and-education)

---

## Developer Assistant

Use nano-claw as your coding companion for daily development tasks.

### Scenario 1: Debugging Help

**Situation:** You have a bug in your TypeScript code.

```bash
nano-claw agent --session debug
```

**Conversation:**
```text
You: I'm getting a "Cannot read property 'map' of undefined" error. Here's my code:

```typescript
function processUsers(users) {
  return users.map(user => user.name);
}

const result = processUsers();
console.log(result);
```

🤖 Agent: The error occurs because you're calling `processUsers()` without 
passing an array argument. The `users` parameter is `undefined`, and you 
can't call `.map()` on undefined.

Here's the fix with proper type safety:

```typescript
function processUsers(users: Array<{ name: string }>): string[] {
  return users.map(user => user.name);
}

// Pass an array when calling
const result = processUsers([
  { name: 'Alice' },
  { name: 'Bob' }
]);
console.log(result); // ['Alice', 'Bob']
```

To make it more robust:

```typescript
function processUsers(users?: Array<{ name: string }>): string[] {
  // Handle undefined/null with default value
  return (users || []).map(user => user.name);
}

// Now this is safe
const result = processUsers();
console.log(result); // []
```

Key improvements:
1. Added TypeScript types for type safety
2. Used optional parameter with default handling
3. Returns empty array if no users provided
```

### Scenario 2: Code Generation

**Situation:** You need to quickly scaffold a new feature.

```text
You: Create a TypeScript Express route handler for user registration with 
email validation, password hashing, and database insertion.

🤖 Agent: Here's a complete user registration route handler:

```typescript
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from './database';

const router = Router();

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

// User registration endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name } = validatedData;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );

    const newUser = result.rows[0];

    // Return success response (don't include password hash!)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.created_at
      }
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    // Handle database errors
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
```

Install required packages:
```bash
npm install express bcrypt zod pg
npm install --save-dev @types/express @types/bcrypt @types/pg
```

Database table schema:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

Usage in your Express app:
```typescript
import express from 'express';
import registerRouter from './routes/register';

const app = express();
app.use(express.json());
app.use('/api/auth', registerRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Test with curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```
```

### Scenario 3: Architecture Discussion

```text
You: I'm building a microservices architecture. Should I use REST or gRPC 
for inter-service communication?

🤖 Agent: Great question! The choice depends on your requirements. Let me 
break down both options:

**REST (HTTP/JSON)**

Pros:
✅ Simple and widely understood
✅ Great tooling and debugging (curl, Postman, browser)
✅ Human-readable (JSON)
✅ Works well with web frontends
✅ No special tooling needed
✅ Easy to cache (HTTP caching)

Cons:
❌ Slower than gRPC (JSON parsing overhead)
❌ Larger payload sizes
❌ No built-in streaming
❌ Weak typing (relies on documentation/OpenAPI)

**gRPC (Protocol Buffers)**

Pros:
✅ 5-10x faster than REST
✅ Smaller payload (binary)
✅ Strong typing (Protocol Buffers)
✅ Built-in streaming (bidirectional)
✅ Multiple languages supported
✅ Automatic code generation

Cons:
❌ Steeper learning curve
❌ Harder to debug (binary format)
❌ Requires special tooling
❌ Less browser-friendly
❌ More complex setup

**My Recommendation:**

Use **REST** if:
- Your services are few and simple
- You need browser compatibility
- Team is not familiar with gRPC
- Debugging ease is critical
- External API exposure

Use **gRPC** if:
- High performance is critical
- Many inter-service calls
- Need streaming capabilities
- Internal services only
- Team comfortable with it

**Hybrid Approach (Best of Both Worlds):**

```typescript
// External API: REST
app.use('/api/v1', restRouter);

// Internal services: gRPC
const grpcServer = new grpc.Server();
grpcServer.addService(
  UserServiceService, 
  userServiceImplementation
);
```

This gives you:
- Simple REST for external consumers
- Fast gRPC for internal communication
- Flexibility to optimize where needed

Would you like me to show you how to implement either approach?
```

---

## Personal Productivity Assistant

Use nano-claw to boost your personal productivity.

### Scenario 1: Daily Planning

**Morning Routine:**

```bash
# Add to cron for automatic daily briefing
nano-claw cron add "0 8 * * *" "Give me my daily briefing"
```

**Custom Skill:** `~/.nano-claw/skills/productivity.md`

```markdown
# Productivity Assistant

## Daily Briefing Template

1. Today's date and day of week
2. A motivational quote
3. Reminder to check calendar
4. Weather info (if available)
5. Task focus suggestion

## Time Management

Use the Pomodoro Technique:
- 25 min focused work
- 5 min break
- After 4 pomodoros: 15-30 min break

## Priority Matrix

Categorize tasks:
- Urgent + Important: Do first
- Important + Not Urgent: Schedule
- Urgent + Not Important: Delegate
- Neither: Eliminate
```

**Example Conversation:**

```text
🤖 Agent: Good morning! Here's your daily briefing:

📅 Monday, January 15, 2024

💡 Quote of the day:
"The secret of getting ahead is getting started." - Mark Twain

📋 Reminders:
- Check your calendar for today's meetings
- Review your priority tasks
- Drink water and take breaks

🎯 Focus suggestion:
Start with your most important task (MIT) before checking emails.

Have a productive day!
```

### Scenario 2: Task Management

```text
You: I have these tasks today: write documentation, code review, fix bug #123, 
team meeting at 2pm, and deploy to staging. Help me prioritize.

🤖 Agent: Let me help you prioritize using the Eisenhower Matrix:

**1. URGENT & IMPORTANT - Do First:**
🔴 Fix bug #123 (assuming it's blocking)
   ⏰ Estimated: 1-2 hours
   💡 Do this first thing

🔴 Deploy to staging (if blocking others)
   ⏰ Estimated: 30 mins
   💡 Do after bug fix or before meeting

**2. IMPORTANT & NOT URGENT - Schedule:**
🟡 Code review
   ⏰ Estimated: 1 hour
   💡 Schedule after meeting

🟡 Write documentation
   ⏰ Estimated: 2-3 hours
   💡 Schedule for tomorrow or late today

**3. SCHEDULED:**
🔵 Team meeting at 2pm
   ⏰ Duration: 1 hour (estimated)
   💡 Prepare agenda beforehand

**Recommended Schedule:**

8:00 AM - 10:00 AM: Fix bug #123
10:00 AM - 10:30 AM: Break + Deploy to staging
10:30 AM - 12:00 PM: Start documentation (if time)
12:00 PM - 1:00 PM: Lunch
1:00 PM - 2:00 PM: Prepare for meeting / Buffer time
2:00 PM - 3:00 PM: Team meeting
3:00 PM - 4:00 PM: Code review
4:00 PM - 5:00 PM: Continue documentation or wrap up

This gives you buffer time and doesn't overpack your day. Sound good?
```

### Scenario 3: Note Taking and Organization

```text
You: Take notes while I brainstorm ideas for my new project

🤖 Agent: Ready to take notes! Go ahead with your ideas.

You: It's a task management app, but focused on developers. Features: 
integrate with GitHub, track time, estimate complexity, suggest break times.

🤖 Agent: Got it! Here are your organized notes:

# New Project: Developer Task Manager

## Core Concept
Task management app specifically designed for developers

## Key Features

### 1. GitHub Integration
- Import issues as tasks
- Track PR progress
- Link commits to tasks
- Sync task status with GitHub

### 2. Time Tracking
- Track actual time spent
- Compare with estimates
- Generate time reports
- Identify time sinks

### 3. Complexity Estimation
- Story points or T-shirt sizing
- Historical data analysis
- Suggest similar past tasks
- Improve estimation accuracy

### 4. Health & Breaks
- Pomodoro timer integration
- Break reminders
- Track work patterns
- Suggest optimal break times

## Questions to Consider
- Target users: Solo developers or teams?
- Pricing model: Free, freemium, or paid?
- Platform: Web, desktop, mobile, or all?
- Integration: Only GitHub or other platforms?

Would you like to explore any of these features in detail?
```

---

## Code Review Assistant

Use nano-claw to review code and provide feedback.

### Scenario: Pull Request Review

**Setup:** Create a dedicated session for code reviews

```bash
nano-claw agent --session code-review
```

**Conversation:**

```text
You: Review this React component for me:

```typescript
import React, { useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);
  
  fetch('https://api.example.com/users')
    .then(res => res.json())
    .then(data => setUsers(data));
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

🤖 Agent: I've reviewed your React component. Here are my findings:

## 🔴 Critical Issues

**1. Infinite Loop (Critical Bug)**
```typescript
// ❌ PROBLEM: fetch runs on every render
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => setUsers(data));
```

The fetch call is not in a useEffect, so it runs on every render. When 
setUsers is called, it triggers a re-render, which triggers another fetch, 
creating an infinite loop.

**Fix:**
```typescript
useEffect(() => {
  fetch('https://api.example.com/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []); // Run only once on mount
```

## 🟡 Important Issues

**2. Missing Error Handling**
```typescript
// ✅ ADD ERROR HANDLING
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch('https://api.example.com/users')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(data => setUsers(data))
    .catch(err => setError(err.message));
}, []);
```

**3. Missing Loading State**
```typescript
// ✅ ADD LOADING STATE
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  fetch('https://api.example.com/users')
    .then(res => res.json())
    .then(data => {
      setUsers(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);
```

**4. Missing TypeScript Types**
```typescript
// ✅ ADD PROPER TYPES
interface User {
  id: number;
  name: string;
  email: string;
}

const [users, setUsers] = useState<User[]>([]);
```

## 💡 Suggestions

**5. Use Modern Async/Await**
```typescript
useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.example.com/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  fetchUsers();
}, []);
```

**6. Add Cleanup for Aborted Requests**
```typescript
useEffect(() => {
  const abortController = new AbortController();
  
  const fetchUsers = async () => {
    try {
      const res = await fetch('https://api.example.com/users', {
        signal: abortController.signal
      });
      // ... rest of code
    } catch (err) {
      if (err.name === 'AbortError') return; // Ignore aborted requests
      setError(err.message);
    }
  };
  
  fetchUsers();
  
  return () => abortController.abort(); // Cleanup
}, []);
```

## ✅ Complete Improved Version

```typescript
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('https://api.example.com/users', {
          signal: abortController.signal
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
    
    return () => abortController.abort();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  if (users.length === 0) {
    return <div className="empty">No users found</div>;
  }
  
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

## Summary

- 🔴 1 Critical Bug: Infinite loop
- 🟡 4 Important Issues: Error handling, loading, types, cleanup
- ✅ Improved Version: Production-ready with all fixes

Would you like me to explain any of these improvements in detail?
```

---

## Research Assistant

Use nano-claw to help with research and information gathering.

### Scenario: Technology Comparison

```text
You: I need to choose between PostgreSQL and MongoDB for my new project. 
Can you help me compare them?

🤖 Agent: I'll help you compare PostgreSQL and MongoDB. Let me create a 
comprehensive comparison:

# PostgreSQL vs MongoDB Comparison

## Overview

**PostgreSQL**
- Type: Relational Database (RDBMS)
- Data Model: Tables with rows and columns
- Query Language: SQL
- First Released: 1996
- License: PostgreSQL License (permissive)

**MongoDB**
- Type: NoSQL Document Database
- Data Model: JSON-like documents (BSON)
- Query Language: MongoDB Query Language
- First Released: 2009
- License: Server Side Public License (SSPL)

## Feature Comparison

| Feature | PostgreSQL | MongoDB |
|---------|-----------|---------|
| **Schema** | Strict, predefined | Flexible, dynamic |
| **Transactions** | Full ACID | ACID (v4.0+) |
| **Joins** | Excellent | Limited (lookups) |
| **Scaling** | Vertical, Read replicas | Horizontal (sharding) |
| **Data Types** | Rich (JSON, Arrays, etc.) | BSON documents |
| **Indexing** | B-tree, Hash, GiST, GIN | B-tree, Text, Geospatial |
| **Full-text Search** | Built-in (good) | Built-in (excellent) |
| **Aggregation** | SQL (powerful) | Aggregation Pipeline |
| **Performance** | Fast for complex queries | Fast for simple lookups |

## When to Use PostgreSQL

✅ **Best for:**
- Complex relationships between data
- Need for complex joins and queries
- Strong consistency requirements
- Financial or transactional systems
- When ACID compliance is critical
- Reporting and analytics
- Data integrity is paramount

**Example Use Cases:**
- E-commerce platforms
- Banking systems
- ERP systems
- CRM applications
- SaaS applications

**Sample Data Model:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  status VARCHAR(50)
);

-- Complex query example
SELECT 
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.email
HAVING SUM(o.total) > 100;
```

## When to Use MongoDB

✅ **Best for:**
- Rapid development with changing requirements
- Flexible or unknown schema
- Large-scale data (horizontal scaling)
- Real-time analytics
- Content management
- Catalogs with varied attributes
- IoT and time-series data

**Example Use Cases:**
- Content management systems
- Real-time analytics
- IoT applications
- User profiles
- Product catalogs
- Logging systems

**Sample Data Model:**
```javascript
// MongoDB document
{
  _id: ObjectId("..."),
  email: "user@example.com",
  profile: {
    name: "John Doe",
    age: 30,
    preferences: ["email", "sms"]
  },
  orders: [
    {
      id: "order-1",
      total: 99.99,
      items: [
        { productId: "prod-1", quantity: 2 },
        { productId: "prod-2", quantity: 1 }
      ],
      status: "delivered",
      createdAt: ISODate("2024-01-01")
    }
  ],
  metadata: {
    lastLogin: ISODate("2024-01-15"),
    loginCount: 42
  }
}

// Query example
db.users.aggregate([
  { $unwind: "$orders" },
  {
    $match: {
      "orders.createdAt": {
        $gte: new Date(Date.now() - 30*24*60*60*1000)
      }
    }
  },
  {
    $group: {
      _id: "$email",
      orderCount: { $sum: 1 },
      totalSpent: { $sum: "$orders.total" }
    }
  },
  { $match: { totalSpent: { $gt: 100 } } }
])
```

## Performance Considerations

**PostgreSQL:**
- ⚡ Excellent for complex queries
- ⚡ Great at joins and aggregations
- 🐌 Vertical scaling can be expensive
- 🐌 Schema changes require migrations

**MongoDB:**
- ⚡ Very fast for simple reads/writes
- ⚡ Horizontal scaling is straightforward
- ⚡ Schema flexibility speeds development
- 🐌 Slower for complex joins
- 🐌 Document size limits (16MB)

## Maintenance and Operations

**PostgreSQL:**
- Mature tooling and ecosystem
- Well-understood by DBAs
- Excellent backup/restore tools
- Strong community support

**MongoDB:**
- Modern tooling (Atlas, Compass)
- Good monitoring tools
- Automated sharding
- Growing ecosystem

## Cost Considerations

**PostgreSQL:**
- Free and open-source
- Managed services available (AWS RDS, etc.)
- Generally cheaper to run
- Mature optimization techniques

**MongoDB:**
- Community Edition: Free
- Enterprise: Paid
- MongoDB Atlas: Managed, pricing varies
- Can be expensive at scale

## My Recommendation

**Choose PostgreSQL if:**
- You have structured, relational data
- Need complex queries and joins
- Prioritize data consistency
- Have a predictable schema
- Budget-conscious

**Choose MongoDB if:**
- Schema is flexible or evolving
- Need horizontal scalability
- Simple queries, fast reads/writes
- Working with semi-structured data
- Rapid prototyping

**Consider Hybrid:**
Many modern applications use both:
- PostgreSQL for core transactional data
- MongoDB for logs, analytics, or flexible content

What kind of project are you building? I can give you a more specific 
recommendation based on your requirements.
```

---

## DevOps Automation

Automate DevOps tasks with nano-claw.

### Scenario: Deployment Assistant

**Setup:**
```bash
# Create DevOps skill (see Advanced Features guide)
# Configure cron for automated checks
nano-claw cron add "0 */6 * * *" "Check Docker containers health and disk space"
```

**Interactive Deployment:**

```text
You: I need to deploy my Node.js app to production. Guide me through it.

🤖 Agent: I'll guide you through a safe production deployment. Let me create 
a checklist:

# Production Deployment Checklist

## Pre-Deployment

- [ ] Run tests
- [ ] Build production bundle
- [ ] Review changes since last deploy
- [ ] Check environment variables
- [ ] Backup database
- [ ] Verify disk space
- [ ] Check service health

## Deployment Steps

1. **Run Tests**
```bash
npm test
```

Should I run the tests for you? (yes/no)

You: yes

🤖 Agent: [Tool: execute_shell]
Running: npm test

✓ All tests passed (47 tests, 0 failures)

Great! Moving to next step.

2. **Build Production Bundle**
```bash
npm run build
```

Run build? (yes/no)

You: yes

🤖 Agent: [Tool: execute_shell]
Running: npm run build

✓ Build completed successfully
Output size: 2.3 MB (gzipped: 645 KB)

3. **Review Recent Changes**
```bash
git log --oneline production..main
```

[Tool: execute_shell]
Show me the changes? (yes/no)

You: yes

🤖 Agent: Recent commits to deploy:
```
abc123f feat: Add user authentication
def456g fix: Fix memory leak in worker
ghi789h docs: Update API documentation
```text

3 commits ready to deploy. Continue? (yes/no)

You: yes

🤖 Agent: 4. **Check Environment Variables**

Required environment variables:
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- NODE_ENV=production

Shall I verify these are set on production? (yes/no)

You: yes

🤖 Agent: [Connecting to production...]
✓ All required environment variables are set
✓ NODE_ENV is set to 'production'

5. **Backup Database**

Creating database backup...
```bash
pg_dump $DATABASE_URL > backup_2024-01-15.sql
```

✓ Backup created: backup_2024-01-15.sql (45.2 MB)
✓ Uploaded to S3: s3://backups/backup_2024-01-15.sql

6. **Deploy**

Deploying using: docker-compose
```bash
docker-compose pull
docker-compose up -d
```

Deploy now? (yes/no)

You: yes

🤖 Agent: [Tool: execute_shell]
Deploying...

✓ Images pulled successfully
✓ Containers started
✓ Health check passed

## Post-Deployment

7. **Verify Deployment**
```bash
curl https://api.yourapp.com/health
```

✓ API is responding
✓ Database connection: OK
✓ Redis connection: OK
✓ All services: Healthy

8. **Monitor Logs**

Watching logs for 2 minutes...
[No errors detected]

## Deployment Summary

✅ Deployment completed successfully!

Time: 14:32:15 UTC
Version: v1.5.2
Commits deployed: 3
Duration: 4m 23s
Status: All services healthy

Would you like me to:
1. Send notification to team
2. Update deployment log
3. Tag this release in Git
4. Run smoke tests
```

---

## Learning and Education

Use nano-claw as a learning companion.

### Scenario: Learning New Technology

```text
You: I want to learn TypeScript. I know JavaScript already. Can you teach me?

🤖 Agent: Great! Since you know JavaScript, learning TypeScript will be 
smooth. Let's start with a structured learning path.

# TypeScript Learning Path (For JavaScript Developers)

## Module 1: TypeScript Basics (Day 1-2)

### 1.1 What is TypeScript?
TypeScript = JavaScript + Types

Key concepts:
- Static type checking
- Compiles to JavaScript
- Superset of JavaScript (all JS is valid TS)
- Catches errors at compile time

**Example:**
```javascript
// JavaScript (runtime error)
function greet(name) {
  return "Hello, " + name.toUpperCase();
}
greet(null); // Runtime error!

// TypeScript (compile-time error)
function greet(name: string): string {
  return "Hello, " + name.toUpperCase();
}
greet(null); // TS Error: Argument of type 'null' is not assignable to parameter of type 'string'
```

### 1.2 Basic Types

Let's practice! Try to add types to this JavaScript code:

```javascript
// Exercise 1: Add types
let age = 30;
let name = "John";
let isActive = true;
let scores = [95, 87, 92];
```

Take a moment to try it yourself. When ready, say "show solution".

You: show solution

🤖 Agent: Great! Here's the solution:

```typescript
// Solution
let age: number = 30;
let name: string = "John";
let isActive: boolean = true;
let scores: number[] = [95, 87, 92];

// TypeScript can infer types, so you can also write:
let age = 30;           // TypeScript infers 'number'
let name = "John";      // TypeScript infers 'string'
let isActive = true;    // TypeScript infers 'boolean'
let scores = [95, 87];  // TypeScript infers 'number[]'
```

### 1.3 Interfaces

Interfaces define object shapes:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // Optional property
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
  // age is optional
};
```

**Exercise 2:** Create an interface for a blog post with:
- id (number)
- title (string)
- content (string)
- author (string)
- published (boolean)
- tags (array of strings)

Try it! Say "solution" when ready.

You: solution

🤖 Agent: Perfect! Here's the solution:

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  published: boolean;
  tags: string[];
}

// Usage
const post: BlogPost = {
  id: 1,
  title: "Learning TypeScript",
  content: "TypeScript is awesome!",
  author: "John Doe",
  published: true,
  tags: ["typescript", "programming", "tutorial"]
};
```

Great job! Ready for Module 2? (yes/continue/take a break)

You: continue

🤖 Agent: Awesome! Let's continue.

## Module 2: Functions and Types (Day 3-4)

### 2.1 Function Type Annotations

```typescript
// Function parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function power(base: number, exponent: number = 2): number {
  return Math.pow(base, exponent);
}
```

### 2.2 Union Types

```typescript
// Variable can be string OR number
let id: string | number;
id = "abc123";  // OK
id = 123;       // OK
id = true;      // Error!

// Function with union type
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}
```

**Exercise 3:** Write a function called `formatValue` that:
- Takes a parameter that can be string, number, or boolean
- Returns a string representation
- If number, add "Value: " prefix
- If boolean, return "Yes" or "No"
- If string, return as-is

Try it now!

[...conversation continues with interactive learning...]
```

---

## Next Steps

- [Basic Usage](./basic-usage.md) - Getting started
- [Integration Examples](./integration-examples.md) - Chat platforms
- [Advanced Features](./advanced-features.md) - Custom skills and automation
- [Code Recipes](./code-recipes.md) - Configuration patterns

## Share Your Use Case

Have you found an interesting way to use nano-claw? We'd love to hear about it!
- Open an issue on GitHub with your use case
- Contribute to the examples directory
- Share on social media with #nanoclaw

# GitHub Integration

Interact with GitHub repositories, issues, and pull requests.

## Capabilities

- Search repositories
- View repository information
- List issues and PRs
- Read file contents from repos
- Check commit history
- View repository statistics

## Usage Examples

### Search Repositories
"Find popular TypeScript projects on GitHub"

### View Repository Info
"Show me information about the nano-claw repository"

### List Issues
"What are the open issues in hustcc/nano-claw?"

### Read Files
"Show me the README from the nano-claw repo"

## Authentication

For private repositories or higher rate limits, configure a GitHub token:

```json
{
  "skills": {
    "github": {
      "token": "ghp_your_token_here"
    }
  }
}
```

## API Limits

Public API: 60 requests/hour
Authenticated: 5000 requests/hour

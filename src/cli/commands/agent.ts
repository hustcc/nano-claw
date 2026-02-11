import * as readline from 'readline';
import chalk from 'chalk';
import { getConfig } from '../../config/index.js';
import { AgentLoop } from '../../agent/loop.js';

/**
 * Agent command - chat with the AI agent
 */
export async function agentCommand(options: {
  message?: string;
  session?: string;
}): Promise<void> {
  const sessionId = options.session || 'default';

  // Load configuration
  const config = getConfig();

  // Create agent loop
  const agent = new AgentLoop(sessionId, config);

  // Single message mode
  if (options.message) {
    console.log(chalk.blue('\n🤖 Agent: Processing your request...\n'));

    try {
      const response = await agent.processMessage(options.message);
      console.log(chalk.green(response.content));
      console.log('');
    } catch (error) {
      console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
      process.exit(1);
    }

    return;
  }

  // Interactive mode
  console.log(chalk.blue.bold('\n🐈 nano-claw Interactive Mode\n'));
  console.log(chalk.gray('Type your message and press Enter. Type "exit" or "quit" to end.\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('You: '),
  });

  rl.prompt();

  rl.on('line', async (line: string) => {
    const message = line.trim();

    if (!message) {
      rl.prompt();
      return;
    }

    // Check for exit commands
    if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
      console.log(chalk.blue('\n👋 Goodbye!\n'));
      rl.close();
      process.exit(0);
    }

    // Check for clear command
    if (message.toLowerCase() === 'clear') {
      agent.clearHistory();
      console.log(chalk.yellow('\n✓ Conversation history cleared\n'));
      rl.prompt();
      return;
    }

    // Process message
    console.log(chalk.blue('\n🤖 Agent: '));

    try {
      const response = await agent.processMessage(message);
      console.log(chalk.green(response.content));
      console.log('');
    } catch (error) {
      console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.blue('\n👋 Goodbye!\n'));
    process.exit(0);
  });
}

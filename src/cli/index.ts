#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { onboardCommand } from './commands/onboard';
import { agentCommand } from './commands/agent';
import { statusCommand } from './commands/status';
import { gatewayCommand } from './commands/gateway';
import {
  cronAddCommand,
  cronListCommand,
  cronRemoveCommand,
  cronEnableCommand,
  cronDisableCommand,
} from './commands/cron';
import { logger } from '../utils/logger';

const program = new Command();

program
  .name('nano-claw')
  .description('Ultra-lightweight personal AI assistant')
  .version('0.1.0');

// Onboard command
program
  .command('onboard')
  .description('Initialize configuration')
  .action(async () => {
    try {
      await onboardCommand();
    } catch (error) {
      logger.error({ error }, 'Onboard failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Agent command
program
  .command('agent')
  .description('Chat with the AI agent')
  .option('-m, --message <message>', 'Send a single message')
  .option('-s, --session <id>', 'Session ID (default: "default")')
  .action(async (options: { message?: string; session?: string }) => {
    try {
      await agentCommand(options);
    } catch (error) {
      logger.error({ error }, 'Agent command failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show system status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error) {
      logger.error({ error }, 'Status command failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Gateway command
program
  .command('gateway')
  .description('Start gateway server for channel integrations')
  .action(async () => {
    try {
      await gatewayCommand();
    } catch (error) {
      logger.error({ error }, 'Gateway command failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Channels command (placeholder)
program
  .command('channels')
  .description('Manage chat channels (not yet implemented)')
  .argument('<action>', 'Action to perform (login, logout, etc.)')
  .action((action: string) => {
    console.log(
      chalk.yellow(`Channels command '${action}' is not yet implemented in this version.`)
    );
  });

// Cron commands
const cron = program.command('cron').description('Manage scheduled tasks');

cron
  .command('add')
  .description('Add a new cron job')
  .requiredOption('-n, --name <name>', 'Job name')
  .requiredOption('-s, --schedule <schedule>', 'Cron schedule expression')
  .requiredOption('-t, --task <task>', 'Task to execute')
  .action(async (options: { name: string; schedule: string; task: string }) => {
    try {
      await cronAddCommand(options);
    } catch (error) {
      logger.error({ error }, 'Cron add failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

cron
  .command('list')
  .description('List all cron jobs')
  .action(async () => {
    try {
      await cronListCommand();
    } catch (error) {
      logger.error({ error }, 'Cron list failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

cron
  .command('remove <id>')
  .description('Remove a cron job')
  .action(async (id: string) => {
    try {
      await cronRemoveCommand(id);
    } catch (error) {
      logger.error({ error }, 'Cron remove failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

cron
  .command('enable <id>')
  .description('Enable a cron job')
  .action(async (id: string) => {
    try {
      await cronEnableCommand(id);
    } catch (error) {
      logger.error({ error }, 'Cron enable failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

cron
  .command('disable <id>')
  .description('Disable a cron job')
  .action(async (id: string) => {
    try {
      await cronDisableCommand(id);
    } catch (error) {
      logger.error({ error }, 'Cron disable failed');
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

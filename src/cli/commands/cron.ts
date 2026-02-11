import chalk from 'chalk';
import Table from 'cli-table3';
import { getConfig } from '../../config/index.js';
import { CronManager } from '../../cron/index.js';
import { formatDate } from '../../utils/helpers.js';

/**
 * Cron add command - add a new cron job
 */
export async function cronAddCommand(options: {
  name: string;
  schedule: string;
  task: string;
}): Promise<void> {
  try {
    const config = getConfig();
    const cronManager = new CronManager(config);

    // Validate cron expression
    if (!CronManager.validateExpression(options.schedule)) {
      console.error(chalk.red(`\nError: Invalid cron expression: ${options.schedule}\n`));
      console.log(chalk.gray('Examples of valid cron expressions:'));
      console.log(chalk.gray('  "0 9 * * *"      - Every day at 9:00 AM'));
      console.log(chalk.gray('  "*/5 * * * *"    - Every 5 minutes'));
      console.log(chalk.gray('  "0 */2 * * *"    - Every 2 hours'));
      console.log(chalk.gray('  "0 0 * * 1"      - Every Monday at midnight\n'));
      process.exit(1);
    }

    const job = cronManager.addJob(options.name, options.schedule, options.task);

    console.log(chalk.green('\n✓ Cron job added successfully!\n'));
    console.log(chalk.bold('Job Details:'));
    console.log(chalk.gray(`  ID:       ${job.id}`));
    console.log(chalk.gray(`  Name:     ${job.name}`));
    console.log(chalk.gray(`  Schedule: ${job.schedule}`));
    console.log(chalk.gray(`  Task:     ${job.task}`));
    console.log(chalk.gray(`  Enabled:  ${job.enabled ? 'Yes' : 'No'}\n`));
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

/**
 * Cron list command - list all cron jobs
 */
export async function cronListCommand(): Promise<void> {
  try {
    const config = getConfig();
    const cronManager = new CronManager(config);
    const jobs = cronManager.listJobs();

    if (jobs.length === 0) {
      console.log(chalk.yellow('\nNo cron jobs found.\n'));
      return;
    }

    console.log(chalk.blue.bold(`\n📅 Cron Jobs (${jobs.length})\n`));

    const table = new Table({
      head: ['ID', 'Name', 'Schedule', 'Task', 'Enabled', 'Last Run', 'Next Run'],
      colWidths: [12, 20, 15, 30, 10, 20, 20],
      wordWrap: true,
    });

    for (const job of jobs) {
      table.push([
        chalk.cyan(job.id.substring(0, 8)),
        job.name,
        chalk.gray(job.schedule),
        chalk.gray(job.task.length > 27 ? job.task.substring(0, 27) + '...' : job.task),
        job.enabled ? chalk.green('Yes') : chalk.gray('No'),
        job.lastRun ? formatDate(job.lastRun) : chalk.gray('-'),
        job.nextRun ? formatDate(job.nextRun) : chalk.gray('-'),
      ]);
    }

    console.log(table.toString());
    console.log('');
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

/**
 * Cron remove command - remove a cron job
 */
export async function cronRemoveCommand(jobId: string): Promise<void> {
  try {
    const config = getConfig();
    const cronManager = new CronManager(config);

    const success = cronManager.removeJob(jobId);

    if (success) {
      console.log(chalk.green(`\n✓ Cron job ${jobId} removed successfully!\n`));
    } else {
      console.error(chalk.red(`\nError: Cron job ${jobId} not found.\n`));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

/**
 * Cron enable command - enable a cron job
 */
export async function cronEnableCommand(jobId: string): Promise<void> {
  try {
    const config = getConfig();
    const cronManager = new CronManager(config);

    const success = cronManager.enableJob(jobId);

    if (success) {
      console.log(chalk.green(`\n✓ Cron job ${jobId} enabled successfully!\n`));
    } else {
      console.error(chalk.red(`\nError: Cron job ${jobId} not found.\n`));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

/**
 * Cron disable command - disable a cron job
 */
export async function cronDisableCommand(jobId: string): Promise<void> {
  try {
    const config = getConfig();
    const cronManager = new CronManager(config);

    const success = cronManager.disableJob(jobId);

    if (success) {
      console.log(chalk.green(`\n✓ Cron job ${jobId} disabled successfully!\n`));
    } else {
      console.error(chalk.red(`\nError: Cron job ${jobId} not found.\n`));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

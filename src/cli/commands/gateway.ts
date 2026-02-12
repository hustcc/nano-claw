/**
 * Gateway command - Start gateway server
 */

import chalk from 'chalk';
import { getGateway } from '../../gateway';
import { logger } from '../../utils/logger';

export async function gatewayCommand(): Promise<void> {
  console.log(chalk.blue('Starting gateway server...'));

  const gateway = getGateway();

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log(chalk.yellow('\nShutting down gateway...'));
    await gateway.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  try {
    await gateway.start();

    console.log(chalk.green('✓ Gateway server started successfully'));
    console.log(chalk.gray('Press Ctrl+C to stop\n'));

    // Get initial status
    const status = gateway.getStatus();
    
    // Display channel statuses
    const enabledChannels = Object.entries(status.channels).filter(
      ([_, channelStatus]) => channelStatus.enabled
    );

    if (enabledChannels.length === 0) {
      console.log(chalk.yellow('⚠ No channels are enabled'));
      console.log(chalk.gray('Configure channels in ~/.nano-claw/config.json to enable them\n'));
    } else {
      console.log(chalk.bold('Active Channels:'));
      for (const [channelType, channelStatus] of enabledChannels) {
        const statusIcon = channelStatus.connected ? '✓' : '✗';
        const statusColor = channelStatus.connected ? chalk.green : chalk.red;
        console.log(
          `  ${statusColor(statusIcon)} ${channelType}: ${channelStatus.connected ? 'connected' : 'disconnected'}`
        );
      }
      console.log();
    }

    // Display heartbeat status if enabled
    if (status.heartbeat && status.heartbeat.enabled) {
      console.log(chalk.bold('Heartbeat:'));
      console.log(`  Interval: ${status.heartbeat.interval}ms`);
      console.log(`  Status: ${status.heartbeat.running ? 'running' : 'stopped'}\n`);
    }

    // Keep the process running
    await new Promise(() => {
      // This will keep running until SIGINT/SIGTERM
    });
  } catch (error) {
    logger.error('Gateway failed', error);
    console.error(chalk.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
}

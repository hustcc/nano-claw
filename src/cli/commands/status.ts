import chalk from 'chalk';
import Table from 'cli-table3';
import { getConfig } from '../../config/index';
import { ProviderConfig } from '../../types';
import { PROVIDERS } from '../../providers/registry';

/**
 * Status command - show system status
 */
export async function statusCommand(): Promise<void> {
  console.log(chalk.blue.bold('\n🐈 nano-claw Status\n'));

  try {
    const config = getConfig();

    // Show configured providers
    console.log(chalk.bold('LLM Providers:\n'));

    const providerTable = new Table({
      head: ['Provider', 'Status', 'API Key'],
      colWidths: [20, 15, 30],
    });

    const providersConfig = config.providers as Record<string, ProviderConfig>;

    for (const spec of PROVIDERS) {
      const providerConfig = providersConfig?.[spec.name];
      const hasKey = !!(providerConfig && providerConfig.apiKey);
      const enabled = providerConfig?.enabled !== false;

      const status = hasKey && enabled ? chalk.green('✓ Configured') : chalk.gray('Not configured');
      const apiKey = hasKey
        ? chalk.gray(`${providerConfig.apiKey?.substring(0, 8)}...`)
        : chalk.gray('-');

      providerTable.push([spec.displayName, status, apiKey]);
    }

    console.log(providerTable.toString());

    // Show agent configuration
    console.log(chalk.bold('\nAgent Configuration:\n'));

    const agentTable = new Table({
      head: ['Setting', 'Value'],
      colWidths: [20, 60],
    });

    const agentConfig = config.agents?.defaults;
    agentTable.push(
      ['Model', chalk.cyan(agentConfig?.model || 'anthropic/claude-opus-4-5')],
      ['Temperature', chalk.cyan(String(agentConfig?.temperature || 0.7))],
      ['Max Tokens', chalk.cyan(String(agentConfig?.maxTokens || 4096))]
    );

    console.log(agentTable.toString());

    // Show tools configuration
    console.log(chalk.bold('\nTools Configuration:\n'));

    const toolsTable = new Table({
      head: ['Setting', 'Value'],
      colWidths: [25, 55],
    });

    const toolsConfig = config.tools;
    toolsTable.push([
      'Restrict to Workspace',
      chalk.cyan(String(toolsConfig?.restrictToWorkspace || false)),
    ]);

    if (toolsConfig?.allowedCommands && toolsConfig.allowedCommands.length > 0) {
      toolsTable.push(['Allowed Commands', chalk.cyan(toolsConfig.allowedCommands.join(', '))]);
    }

    if (toolsConfig?.deniedCommands && toolsConfig.deniedCommands.length > 0) {
      toolsTable.push(['Denied Commands', chalk.cyan(toolsConfig.deniedCommands.join(', '))]);
    }

    console.log(toolsTable.toString());

    // Show channels status
    console.log(chalk.bold('\nChat Channels:\n'));

    const channelsTable = new Table({
      head: ['Channel', 'Status'],
      colWidths: [20, 30],
    });

    const channelsConfig = config.channels;
    const channelNames = [
      'telegram',
      'discord',
      'whatsapp',
      'feishu',
      'slack',
      'email',
      'qq',
      'dingtalk',
      'mochat',
    ];

    for (const channelName of channelNames) {
      const channelConfig = channelsConfig?.[channelName as keyof typeof channelsConfig];
      const enabled = channelConfig?.enabled === true;
      const status = enabled ? chalk.green('✓ Enabled') : chalk.gray('Disabled');
      channelsTable.push([channelName, status]);
    }

    console.log(channelsTable.toString());

    console.log('');
  } catch (error) {
    console.error(chalk.red(`\nError: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

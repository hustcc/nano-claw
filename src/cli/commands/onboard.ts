import { existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';
import { createDefaultConfig, saveConfig } from '../../config/index.js';
import { getHomeDir, getConfigPath, getMemoryDir, getSkillsDir } from '../../utils/helpers.js';

/**
 * Onboard command - initialize configuration
 */
export async function onboardCommand(): Promise<void> {
  console.log(chalk.blue.bold('\n🐈 Welcome to nano-claw!\n'));

  const homeDir = getHomeDir();
  const configPath = getConfigPath();

  // Create directories
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir, { recursive: true });
    console.log(chalk.green(`✓ Created directory: ${homeDir}`));
  }

  if (!existsSync(getMemoryDir())) {
    mkdirSync(getMemoryDir(), { recursive: true });
    console.log(chalk.green(`✓ Created memory directory`));
  }

  if (!existsSync(getSkillsDir())) {
    mkdirSync(getSkillsDir(), { recursive: true });
    console.log(chalk.green(`✓ Created skills directory`));
  }

  // Check if config already exists
  if (existsSync(configPath)) {
    console.log(chalk.yellow(`\n⚠ Configuration file already exists at ${configPath}`));
    console.log(chalk.yellow('Please edit it manually or delete it to create a new one.\n'));
    return;
  }

  // Create default config
  const config = createDefaultConfig();
  saveConfig(config);

  console.log(chalk.green(`✓ Created configuration file: ${configPath}\n`));

  // Show next steps
  console.log(chalk.bold('Next steps:\n'));
  console.log('1. Edit your configuration file:');
  console.log(chalk.cyan(`   ${configPath}\n`));
  console.log('2. Add your API keys (recommended: OpenRouter)');
  console.log(chalk.cyan('   Get API key: https://openrouter.ai/keys\n'));
  console.log('3. Example configuration:');
  console.log(
    chalk.gray(`   {
     "providers": {
       "openrouter": {
         "apiKey": "sk-or-v1-xxx"
       }
     },
     "agents": {
       "defaults": {
         "model": "anthropic/claude-opus-4-5"
       }
     }
   }\n`)
  );
  console.log('4. Start chatting:');
  console.log(chalk.cyan('   nano-claw agent -m "Hello!"\n'));

  console.log(chalk.green('✨ Setup complete!\n'));
}

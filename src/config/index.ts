import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { Config, ConfigSchema } from './schema';
import { getConfigPath, getHomeDir } from '../utils/helpers';
import { ConfigError } from '../utils/errors';
import { logger } from '../utils/logger';

// Re-export getConfigDir for external use
export { getConfigDir } from '../utils/helpers';

/**
 * Load configuration from file
 */
export function loadConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    throw new ConfigError(
      `Configuration file not found at ${configPath}. Please run 'nano-claw onboard' first.`
    );
  }

  try {
    const configData = readFileSync(configPath, 'utf-8');
    const configJson = JSON.parse(configData) as unknown;
    const config = ConfigSchema.parse(configJson);
    logger.debug({ config }, 'Configuration loaded');
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigError(`Invalid JSON in configuration file: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: Config): void {
  const configPath = getConfigPath();
  const homeDir = getHomeDir();

  // Ensure directory exists
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir, { recursive: true });
  }

  try {
    const configJson = JSON.stringify(config, null, 2);
    writeFileSync(configPath, configJson, 'utf-8');
    logger.info({ path: configPath }, 'Configuration saved');
  } catch (error) {
    throw new ConfigError(`Failed to save configuration: ${(error as Error).message}`);
  }
}

/**
 * Create default configuration
 */
export function createDefaultConfig(): Config {
  return ConfigSchema.parse({
    providers: {},
    agents: {
      defaults: {
        model: 'anthropic/claude-opus-4-5',
        temperature: 0.7,
        maxTokens: 4096,
      },
    },
    tools: {
      restrictToWorkspace: false,
    },
    channels: {},
  });
}

/**
 * Merge environment variables into configuration
 */
export function mergeEnvConfig(config: Config): Config {
  // Check for provider API keys in environment variables
  const envProviders: Record<string, { apiKey: string }> = {};

  if (process.env.OPENROUTER_API_KEY) {
    envProviders.openrouter = { apiKey: process.env.OPENROUTER_API_KEY };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    envProviders.anthropic = { apiKey: process.env.ANTHROPIC_API_KEY };
  }
  if (process.env.OPENAI_API_KEY) {
    envProviders.openai = { apiKey: process.env.OPENAI_API_KEY };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    envProviders.deepseek = { apiKey: process.env.DEEPSEEK_API_KEY };
  }
  if (process.env.GROQ_API_KEY) {
    envProviders.groq = { apiKey: process.env.GROQ_API_KEY };
  }
  if (process.env.GEMINI_API_KEY) {
    envProviders.gemini = { apiKey: process.env.GEMINI_API_KEY };
  }

  // Merge with existing config (env vars take precedence)
  const mergedProviders = { ...config.providers };
  for (const [key, value] of Object.entries(envProviders)) {
    mergedProviders[key as keyof typeof mergedProviders] = {
      ...(mergedProviders[key as keyof typeof mergedProviders] || {}),
      ...value,
    } as never;
  }
  
  return {
    ...config,
    providers: mergedProviders,
  };
}

/**
 * Get configuration with environment variable overrides
 */
export function getConfig(): Config {
  const config = loadConfig();
  return mergeEnvConfig(config);
}

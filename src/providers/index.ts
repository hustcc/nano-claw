import { Config } from '../config/schema.js';
import { Message, LLMResponse, ToolDefinition, ProviderConfig } from '../types.js';
import { ProviderError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import {
  BaseProvider,
  OpenRouterProvider,
  AnthropicProvider,
  OpenAIProvider,
} from './base.js';
import { findProviderByModel } from './registry.js';

/**
 * Provider manager - handles provider selection and instantiation
 */
export class ProviderManager {
  private config: Config;
  private providerCache: Map<string, BaseProvider> = new Map();

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Get or create provider instance
   */
  private getProviderInstance(providerName: string): BaseProvider {
    if (this.providerCache.has(providerName)) {
      return this.providerCache.get(providerName)!;
    }

    const providerConfig = (this.config.providers as Record<string, ProviderConfig>)?.[
      providerName
    ];

    if (!providerConfig || !providerConfig.apiKey) {
      throw new ProviderError(`Provider ${providerName} is not configured`);
    }

    let provider: BaseProvider;

    switch (providerName) {
      case 'openrouter':
        provider = new OpenRouterProvider(providerConfig.apiKey, providerConfig.apiBase);
        break;
      case 'anthropic':
        provider = new AnthropicProvider(providerConfig.apiKey, providerConfig.apiBase);
        break;
      case 'openai':
        provider = new OpenAIProvider(providerConfig.apiKey, providerConfig.apiBase);
        break;
      case 'deepseek':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://api.deepseek.com/v1'
        );
        break;
      case 'groq':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://api.groq.com/openai/v1'
        );
        break;
      case 'gemini':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://generativelanguage.googleapis.com/v1beta'
        );
        break;
      case 'minimax':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://api.minimax.chat/v1'
        );
        break;
      case 'dashscope':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        );
        break;
      case 'moonshot':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://api.moonshot.cn/v1'
        );
        break;
      case 'zhipu':
        provider = new OpenAIProvider(
          providerConfig.apiKey,
          providerConfig.apiBase || 'https://open.bigmodel.cn/api/paas/v4'
        );
        break;
      case 'vllm':
        if (!providerConfig.apiBase) {
          throw new ProviderError('vLLM provider requires apiBase configuration');
        }
        provider = new OpenAIProvider(providerConfig.apiKey, providerConfig.apiBase);
        break;
      default:
        throw new ProviderError(`Unknown provider: ${providerName}`);
    }

    this.providerCache.set(providerName, provider);
    return provider;
  }

  /**
   * Detect provider from model name or configuration
   */
  private detectProvider(model: string): string {
    // First, try to detect by model name
    const providerSpec = findProviderByModel(model);
    if (providerSpec) {
      const providerConfig = (this.config.providers as Record<string, ProviderConfig>)?.[
        providerSpec.name
      ];
      if (providerConfig && providerConfig.apiKey) {
        logger.debug(
          { provider: providerSpec.name, model },
          'Provider detected from model name'
        );
        return providerSpec.name;
      }
    }

    // Try to find gateway provider (like OpenRouter)
    const gatewayProviders = ['openrouter', 'aihubmix'];
    for (const providerName of gatewayProviders) {
      const providerConfig = (this.config.providers as Record<string, ProviderConfig>)?.[
        providerName
      ];
      if (providerConfig && providerConfig.apiKey) {
        logger.debug({ provider: providerName, model }, 'Using gateway provider');
        return providerName;
      }
    }

    // Fall back to first configured provider
    const providersConfig = this.config.providers as Record<string, ProviderConfig>;
    const firstConfigured = Object.keys(providersConfig).find(
      (key) => providersConfig[key]?.apiKey
    );

    if (firstConfigured) {
      logger.debug({ provider: firstConfigured, model }, 'Using first configured provider');
      return firstConfigured;
    }

    throw new ProviderError('No provider configured');
  }

  /**
   * Complete a chat conversation
   */
  async complete(
    messages: Message[],
    model: string,
    temperature?: number,
    maxTokens?: number,
    tools?: ToolDefinition[]
  ): Promise<LLMResponse> {
    const providerName = this.detectProvider(model);
    const provider = this.getProviderInstance(providerName);

    logger.info(
      { provider: providerName, model, messageCount: messages.length },
      'Completing chat'
    );

    return provider.complete(messages, model, temperature, maxTokens, tools);
  }
}

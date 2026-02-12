import { ProviderConfig } from '../types';

/**
 * Provider specification for the registry
 */
export interface ProviderSpec {
  name: string;
  keywords: string[];
  envKey: string;
  displayName: string;
  litellmPrefix?: string;
  skipPrefixes?: string[];
  envExtras?: Array<[string, string]>;
  modelOverrides?: Map<string, Record<string, unknown>>;
  isGateway?: boolean;
  detectByKeyPrefix?: string;
  detectByBaseKeyword?: string;
  stripModelPrefix?: boolean;
}

/**
 * Provider registry - single source of truth for all providers
 */
export const PROVIDERS: ProviderSpec[] = [
  {
    name: 'openrouter',
    keywords: ['openrouter'],
    envKey: 'OPENROUTER_API_KEY',
    displayName: 'OpenRouter',
    isGateway: true,
    detectByKeyPrefix: 'sk-or-',
    detectByBaseKeyword: 'openrouter',
  },
  {
    name: 'anthropic',
    keywords: ['anthropic', 'claude'],
    envKey: 'ANTHROPIC_API_KEY',
    displayName: 'Anthropic (Claude)',
    litellmPrefix: 'anthropic',
    skipPrefixes: ['anthropic/'],
  },
  {
    name: 'openai',
    keywords: ['openai', 'gpt'],
    envKey: 'OPENAI_API_KEY',
    displayName: 'OpenAI (GPT)',
    litellmPrefix: 'openai',
    skipPrefixes: ['openai/', 'gpt-'],
  },
  {
    name: 'deepseek',
    keywords: ['deepseek'],
    envKey: 'DEEPSEEK_API_KEY',
    displayName: 'DeepSeek',
    litellmPrefix: 'deepseek',
    skipPrefixes: ['deepseek/'],
  },
  {
    name: 'groq',
    keywords: ['groq'],
    envKey: 'GROQ_API_KEY',
    displayName: 'Groq',
    litellmPrefix: 'groq',
    skipPrefixes: ['groq/'],
  },
  {
    name: 'gemini',
    keywords: ['gemini'],
    envKey: 'GEMINI_API_KEY',
    displayName: 'Google Gemini',
    litellmPrefix: 'gemini',
    skipPrefixes: ['gemini/'],
  },
  {
    name: 'minimax',
    keywords: ['minimax'],
    envKey: 'MINIMAX_API_KEY',
    displayName: 'MiniMax',
    litellmPrefix: 'minimax',
    skipPrefixes: ['minimax/'],
  },
  {
    name: 'aihubmix',
    keywords: ['aihubmix'],
    envKey: 'AIHUBMIX_API_KEY',
    displayName: 'AiHubMix',
    isGateway: true,
    detectByBaseKeyword: 'aihubmix',
    stripModelPrefix: true,
  },
  {
    name: 'dashscope',
    keywords: ['dashscope', 'qwen'],
    envKey: 'DASHSCOPE_API_KEY',
    displayName: 'Dashscope (Qwen)',
    litellmPrefix: 'dashscope',
    skipPrefixes: ['dashscope/'],
  },
  {
    name: 'moonshot',
    keywords: ['moonshot', 'kimi'],
    envKey: 'MOONSHOT_API_KEY',
    displayName: 'Moonshot (Kimi)',
    litellmPrefix: 'moonshot',
    skipPrefixes: ['moonshot/'],
  },
  {
    name: 'zhipu',
    keywords: ['zhipu', 'glm'],
    envKey: 'ZHIPUAI_API_KEY',
    displayName: 'Zhipu (GLM)',
    litellmPrefix: 'zhipu',
    skipPrefixes: ['zhipu/'],
    envExtras: [['ZHIPUAI_API_KEY', '{api_key}']],
  },
  {
    name: 'vllm',
    keywords: ['vllm'],
    envKey: 'VLLM_API_KEY',
    displayName: 'vLLM (Local)',
    litellmPrefix: 'openai',
    skipPrefixes: ['openai/', 'vllm/'],
  },
];

/**
 * Find provider by name
 */
export function findProviderByName(name: string): ProviderSpec | undefined {
  return PROVIDERS.find((p) => p.name === name);
}

/**
 * Find provider by model name (keywords matching)
 */
export function findProviderByModel(model: string): ProviderSpec | undefined {
  const lowerModel = model.toLowerCase();
  return PROVIDERS.find((p) => p.keywords.some((keyword) => lowerModel.includes(keyword)));
}

/**
 * Get all configured providers
 */
export function getConfiguredProviders(
  providersConfig: Record<string, ProviderConfig>
): ProviderSpec[] {
  return PROVIDERS.filter((spec) => {
    const config = providersConfig[spec.name];
    return config && config.enabled !== false && config.apiKey;
  });
}

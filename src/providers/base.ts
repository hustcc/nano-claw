import axios, { AxiosInstance } from 'axios';
import { Message, LLMResponse, ToolDefinition, ToolCall } from '../types';
import { ProviderError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Base class for LLM providers
 */
export abstract class BaseProvider {
  protected client: AxiosInstance;
  protected apiKey: string;
  protected apiBase: string;

  constructor(apiKey: string, apiBase?: string) {
    this.apiKey = apiKey;
    this.apiBase = apiBase || this.getDefaultApiBase();
    this.client = axios.create({
      baseURL: this.apiBase,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds
    });
  }

  /**
   * Get the default API base URL for this provider
   */
  protected abstract getDefaultApiBase(): string;

  /**
   * Complete a chat conversation
   */
  abstract complete(
    messages: Message[],
    model: string,
    temperature?: number,
    maxTokens?: number,
    tools?: ToolDefinition[]
  ): Promise<LLMResponse>;

  /**
   * Format model name for provider
   */
  protected formatModelName(model: string): string {
    return model;
  }
}

/**
 * OpenRouter provider
 */
export class OpenRouterProvider extends BaseProvider {
  protected getDefaultApiBase(): string {
    return 'https://openrouter.ai/api/v1';
  }

  async complete(
    messages: Message[],
    model: string,
    temperature = 0.7,
    maxTokens = 4096,
    tools?: ToolDefinition[]
  ): Promise<LLMResponse> {
    try {
      const requestData: Record<string, unknown> = {
        model: this.formatModelName(model),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.name && { name: m.name }),
          ...(m.tool_calls && { tool_calls: m.tool_calls }),
          ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
        })),
        temperature,
        max_tokens: maxTokens,
      };

      if (tools && tools.length > 0) {
        requestData.tools = tools;
      }

      const response = await this.client.post('/chat/completions', requestData);

      const choice = response.data.choices[0];
      const message = choice.message;

      return {
        content: message.content || '',
        toolCalls: message.tool_calls as ToolCall[] | undefined,
        finishReason: choice.finish_reason,
        usage: response.data.usage
          ? {
              promptTokens: response.data.usage.prompt_tokens,
              completionTokens: response.data.usage.completion_tokens,
              totalTokens: response.data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'OpenRouter API error');
      if (axios.isAxiosError(error)) {
        throw new ProviderError(
          `OpenRouter API error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw new ProviderError(`OpenRouter API error: ${(error as Error).message}`);
    }
  }
}

/**
 * Anthropic provider
 */
export class AnthropicProvider extends BaseProvider {
  protected getDefaultApiBase(): string {
    return 'https://api.anthropic.com/v1';
  }

  protected formatModelName(model: string): string {
    // Remove anthropic/ prefix if present
    if (model.startsWith('anthropic/')) {
      return model.substring(10);
    }
    return model;
  }

  async complete(
    messages: Message[],
    model: string,
    temperature = 0.7,
    maxTokens = 4096,
    tools?: ToolDefinition[]
  ): Promise<LLMResponse> {
    try {
      // Extract system message
      const systemMessage = messages.find((m) => m.role === 'system')?.content || '';
      const nonSystemMessages = messages.filter((m) => m.role !== 'system');

      const requestData: Record<string, unknown> = {
        model: this.formatModelName(model),
        messages: nonSystemMessages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
      };

      if (systemMessage) {
        requestData.system = systemMessage;
      }

      if (tools && tools.length > 0) {
        requestData.tools = tools.map((t) => t.function);
      }

      const response = await this.client.post('/messages', requestData, {
        headers: {
          'anthropic-version': '2023-06-01',
          'x-api-key': this.apiKey,
        },
      });

      const content = response.data.content[0];

      return {
        content: content.type === 'text' ? content.text : '',
        toolCalls: content.type === 'tool_use' ? [content] : undefined,
        finishReason: response.data.stop_reason,
        usage: response.data.usage
          ? {
              promptTokens: response.data.usage.input_tokens,
              completionTokens: response.data.usage.output_tokens,
              totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'Anthropic API error');
      if (axios.isAxiosError(error)) {
        throw new ProviderError(
          `Anthropic API error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw new ProviderError(`Anthropic API error: ${(error as Error).message}`);
    }
  }
}

/**
 * OpenAI provider
 */
export class OpenAIProvider extends BaseProvider {
  protected getDefaultApiBase(): string {
    return 'https://api.openai.com/v1';
  }

  protected formatModelName(model: string): string {
    // Remove openai/ prefix if present
    if (model.startsWith('openai/')) {
      return model.substring(7);
    }
    return model;
  }

  async complete(
    messages: Message[],
    model: string,
    temperature = 0.7,
    maxTokens = 4096,
    tools?: ToolDefinition[]
  ): Promise<LLMResponse> {
    try {
      const requestData: Record<string, unknown> = {
        model: this.formatModelName(model),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.name && { name: m.name }),
          ...(m.tool_calls && { tool_calls: m.tool_calls }),
          ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
        })),
        temperature,
        max_tokens: maxTokens,
      };

      if (tools && tools.length > 0) {
        requestData.tools = tools;
      }

      const response = await this.client.post('/chat/completions', requestData);

      const choice = response.data.choices[0];
      const message = choice.message;

      return {
        content: message.content || '',
        toolCalls: message.tool_calls as ToolCall[] | undefined,
        finishReason: choice.finish_reason,
        usage: response.data.usage
          ? {
              promptTokens: response.data.usage.prompt_tokens,
              completionTokens: response.data.usage.completion_tokens,
              totalTokens: response.data.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error({ error }, 'OpenAI API error');
      if (axios.isAxiosError(error)) {
        throw new ProviderError(
          `OpenAI API error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw new ProviderError(`OpenAI API error: ${(error as Error).message}`);
    }
  }
}

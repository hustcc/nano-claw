/**
 * Core type definitions for nano-claw
 */

/**
 * Message role in conversation
 */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * Message in conversation
 */
export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

/**
 * Tool call structure
 */
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

/**
 * Tool definition
 */
export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

/**
 * Tool execution result
 */
export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Session information
 */
export interface Session {
  id: string;
  userId: string;
  channelType: string;
  createdAt: Date;
  lastActivity: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Skill definition
 */
export interface Skill {
  name: string;
  description: string;
  content: string;
  path: string;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  apiKey?: string;
  apiBase?: string;
  enabled?: boolean;
}

/**
 * Channel message
 */
export interface ChannelMessage {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  channelType: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Cron job definition
 */
export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  task: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

/**
 * LLM response
 */
export interface LLMResponse {
  content: string;
  toolCalls?: ToolCall[];
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Agent execution context
 */
export interface AgentContext {
  sessionId: string;
  userId: string;
  channelType: string;
  messages: Message[];
  skills: Skill[];
  tools: ToolDefinition[];
  config: AgentConfig;
}

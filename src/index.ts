/**
 * nano-claw - Ultra-lightweight personal AI assistant
 * TypeScript + Node.js implementation
 * 
 * Main public API exports
 */

// Core agent
export { AgentLoop } from './agent/loop';
export { Memory } from './agent/memory';

// Tools
export { ToolRegistry, BaseTool } from './agent/tools/registry';

// Cron system
export { CronManager } from './cron/index';

// Providers
export { ProviderManager } from './providers/index';
export { BaseProvider } from './providers/base';

// Configuration
export { getConfig, loadConfig, saveConfig } from './config/index';
export type { Config, ProvidersConfig, AgentsConfig, ToolsConfig, ChannelsConfig } from './config/schema';

// Essential types
export type { Message, ToolCall, ToolResult, ToolDefinition, AgentConfig } from './types';

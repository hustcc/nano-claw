/**
 * nano-claw - Ultra-lightweight personal AI assistant
 * TypeScript + Node.js implementation
 */

// Export main classes and functions
export { AgentLoop } from './agent/loop.js';
export { Memory } from './agent/memory.js';
export { ContextBuilder } from './agent/context.js';
export { SkillsLoader } from './agent/skills.js';
export { ToolRegistry, BaseTool } from './agent/tools/registry.js';
export { ShellTool } from './agent/tools/shell.js';
export { ReadFileTool, WriteFileTool } from './agent/tools/file.js';

// Export providers
export { ProviderManager } from './providers/index.js';
export { BaseProvider, OpenRouterProvider, AnthropicProvider, OpenAIProvider } from './providers/base.js';
export { PROVIDERS, findProviderByName, findProviderByModel } from './providers/registry.js';

// Export configuration
export { getConfig, loadConfig, saveConfig, createDefaultConfig } from './config/index.js';
export * from './config/schema.js';

// Export types
export * from './types.js';

// Export utilities
export * from './utils/logger.js';
export * from './utils/errors.js';
export * from './utils/helpers.js';

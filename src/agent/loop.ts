import { AgentConfig, Message, ToolCall } from '../types.js';
import { ProviderManager } from '../providers/index.js';
import { Memory } from './memory.js';
import { ContextBuilder } from './context.js';
import { SkillsLoader } from './skills.js';
import { ToolRegistry } from './tools/registry.js';
import { ShellTool } from './tools/shell.js';
import { ReadFileTool, WriteFileTool } from './tools/file.js';
import { Config } from '../config/schema.js';
import { logger } from '../utils/logger.js';

/**
 * Agent response
 */
export interface AgentResponse {
  content: string;
  toolCalls?: ToolCall[];
  finishReason?: string;
}

/**
 * Main agent loop - handles LLM and tool execution
 */
export class AgentLoop {
  private config: AgentConfig;
  private providerManager: ProviderManager;
  private memory: Memory;
  private contextBuilder: ContextBuilder;
  private skillsLoader: SkillsLoader;
  private toolRegistry: ToolRegistry;
  private maxIterations: number;

  constructor(
    sessionId: string,
    config: Config,
    agentConfig?: Partial<AgentConfig>,
    maxIterations = 10
  ) {
    // Merge agent config with defaults
    this.config = {
      model: config.agents?.defaults?.model || 'anthropic/claude-opus-4-5',
      temperature: config.agents?.defaults?.temperature || 0.7,
      maxTokens: config.agents?.defaults?.maxTokens || 4096,
      systemPrompt: config.agents?.defaults?.systemPrompt,
      ...agentConfig,
    };

    this.providerManager = new ProviderManager(config);
    this.memory = new Memory(sessionId);
    this.contextBuilder = new ContextBuilder(this.config);
    this.skillsLoader = new SkillsLoader();
    this.toolRegistry = new ToolRegistry();
    this.maxIterations = maxIterations;

    // Register built-in tools
    this.registerBuiltInTools(config);
  }

  /**
   * Register built-in tools
   */
  private registerBuiltInTools(config: Config): void {
    const toolsConfig = config.tools;

    this.toolRegistry.register(
      new ShellTool(
        toolsConfig?.restrictToWorkspace,
        toolsConfig?.allowedCommands,
        toolsConfig?.deniedCommands
      )
    );
    this.toolRegistry.register(new ReadFileTool());
    this.toolRegistry.register(new WriteFileTool());
  }

  /**
   * Process a user message and generate response
   */
  async processMessage(userMessage: string): Promise<AgentResponse> {
    // Add user message to memory
    this.memory.addMessage({
      role: 'user',
      content: userMessage,
    });

    // Start agent loop
    let iteration = 0;
    let continueLoop = true;
    let finalResponse: AgentResponse | null = null;

    while (continueLoop && iteration < this.maxIterations) {
      iteration++;
      logger.debug({ iteration, maxIterations: this.maxIterations }, 'Agent loop iteration');

      try {
        // Build context with skills and tools
        const skills = this.skillsLoader.getSkills();
        const tools = this.toolRegistry.getDefinitions();
        const conversationMessages = this.memory.getMessages();
        const contextMessages = this.contextBuilder.buildContextMessages(
          conversationMessages,
          skills,
          tools
        );

        // Call LLM
        const response = await this.providerManager.complete(
          contextMessages,
          this.config.model,
          this.config.temperature,
          this.config.maxTokens,
          tools
        );

        logger.debug(
          {
            iteration,
            hasContent: !!response.content,
            toolCallsCount: response.toolCalls?.length || 0,
            finishReason: response.finishReason,
          },
          'LLM response received'
        );

        // Check if LLM wants to use tools
        if (response.toolCalls && response.toolCalls.length > 0) {
          // Add assistant message with tool calls
          this.memory.addMessage({
            role: 'assistant',
            content: response.content || '',
            tool_calls: response.toolCalls,
          });

          // Execute each tool call
          for (const toolCall of response.toolCalls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments) as Record<
              string,
              unknown
            >;

            logger.info({ tool: toolName, args: toolArgs }, 'Executing tool');

            const toolResult = await this.toolRegistry.execute(toolName, toolArgs);

            // Add tool result to memory
            this.memory.addMessage({
              role: 'tool',
              content: toolResult.success
                ? toolResult.output
                : `Error: ${toolResult.error}`,
              name: toolName,
              tool_call_id: toolCall.id,
            });
          }

          // Continue loop to get final response
          continueLoop = true;
        } else {
          // No tool calls, this is the final response
          this.memory.addMessage({
            role: 'assistant',
            content: response.content,
          });

          finalResponse = {
            content: response.content,
            finishReason: response.finishReason,
          };

          continueLoop = false;
        }
      } catch (error) {
        logger.error({ error, iteration }, 'Error in agent loop');
        throw error;
      }
    }

    if (iteration >= this.maxIterations) {
      logger.warn({ maxIterations: this.maxIterations }, 'Max iterations reached');
    }

    if (!finalResponse) {
      finalResponse = {
        content: 'I apologize, but I was unable to complete your request.',
        finishReason: 'max_iterations',
      };
    }

    return finalResponse;
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.memory.getMessages();
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.memory.clear();
  }

  /**
   * Get memory instance
   */
  getMemory(): Memory {
    return this.memory;
  }

  /**
   * Get tool registry
   */
  getToolRegistry(): ToolRegistry {
    return this.toolRegistry;
  }

  /**
   * Get skills loader
   */
  getSkillsLoader(): SkillsLoader {
    return this.skillsLoader;
  }
}

import { ToolDefinition, ToolResult } from '../../types';
import { logger } from '../../utils/logger';

/**
 * Base class for tools
 */
export abstract class BaseTool {
  abstract name: string;
  abstract description: string;

  /**
   * Get tool definition for LLM
   */
  abstract getDefinition(): ToolDefinition;

  /**
   * Execute the tool
   */
  abstract execute(args: Record<string, unknown>): Promise<ToolResult>;

  /**
   * Helper to create successful result
   */
  protected success(output: string): ToolResult {
    return {
      success: true,
      output,
    };
  }

  /**
   * Helper to create error result
   */
  protected error(error: string): ToolResult {
    return {
      success: false,
      output: '',
      error,
    };
  }
}

/**
 * Tool registry
 */
export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();

  /**
   * Register a tool
   */
  register(tool: BaseTool): void {
    this.tools.set(tool.name, tool);
    logger.debug({ tool: tool.name }, 'Tool registered');
  }

  /**
   * Get a tool by name
   */
  get(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all tool definitions
   */
  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.getDefinition());
  }

  /**
   * Execute a tool
   */
  async execute(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        output: '',
        error: `Tool not found: ${name}`,
      };
    }

    try {
      logger.info({ tool: name, args }, 'Executing tool');
      return await tool.execute(args);
    } catch (error) {
      logger.error({ error, tool: name }, 'Tool execution failed');
      return {
        success: false,
        output: '',
        error: `Tool execution failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Get tool count
   */
  getToolCount(): number {
    return this.tools.size;
  }
}

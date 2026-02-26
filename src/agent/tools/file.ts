import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { BaseTool } from './registry';
import { ToolDefinition, ToolResult } from '../../types';

/**
 * File read tool
 */
export class ReadFileTool extends BaseTool {
  name = 'read_file';
  description = 'Read contents of a file';

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the file to read',
            },
          },
          required: ['path'],
        },
      },
    };
  }

  execute(args: Record<string, unknown>): Promise<ToolResult> {
    const path = args.path as string;

    if (!path) {
      return Promise.resolve(this.error('Path is required'));
    }

    try {
      if (!existsSync(path)) {
        return Promise.resolve(this.error(`File not found: ${path}`));
      }

      const content = readFileSync(path, 'utf-8');
      return Promise.resolve(this.success(content));
    } catch (error) {
      return Promise.resolve(this.error(`Failed to read file: ${(error as Error).message}`));
    }
  }
}

/**
 * File write tool
 */
export class WriteFileTool extends BaseTool {
  name = 'write_file';
  description = 'Write content to a file';

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the file to write',
            },
            content: {
              type: 'string',
              description: 'Content to write to the file',
            },
          },
          required: ['path', 'content'],
        },
      },
    };
  }

  execute(args: Record<string, unknown>): Promise<ToolResult> {
    const path = args.path as string;
    const content = args.content as string;

    if (!path) {
      return Promise.resolve(this.error('Path is required'));
    }

    if (content === undefined) {
      return Promise.resolve(this.error('Content is required'));
    }

    try {
      // Ensure directory exists
      const dir = dirname(path);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(path, content, 'utf-8');
      return Promise.resolve(this.success(`File written successfully: ${path}`));
    } catch (error) {
      return Promise.resolve(this.error(`Failed to write file: ${(error as Error).message}`));
    }
  }
}

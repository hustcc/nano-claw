import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseTool } from './registry';
import { ToolDefinition, ToolResult } from '../../types';

const execAsync = promisify(exec);

/**
 * Shell command execution tool
 */
export class ShellTool extends BaseTool {
  name = 'shell';
  description = 'Execute shell commands';

  private allowedCommands?: string[];
  private deniedCommands?: string[];
  private restrictToWorkspace: boolean;

  constructor(
    restrictToWorkspace = false,
    allowedCommands?: string[],
    deniedCommands?: string[]
  ) {
    super();
    this.restrictToWorkspace = restrictToWorkspace;
    this.allowedCommands = allowedCommands;
    this.deniedCommands = deniedCommands;
  }

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The shell command to execute',
            },
          },
          required: ['command'],
        },
      },
    };
  }

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const command = args.command as string;

    if (!command) {
      return this.error('Command is required');
    }

    // Check denied commands
    if (this.deniedCommands) {
      for (const denied of this.deniedCommands) {
        if (command.includes(denied)) {
          return this.error(`Command contains denied keyword: ${denied}`);
        }
      }
    }

    // Check allowed commands if specified
    if (this.allowedCommands && this.allowedCommands.length > 0) {
      const isAllowed = this.allowedCommands.some((allowed) => command.startsWith(allowed));
      if (!isAllowed) {
        return this.error('Command is not in the allowed list');
      }
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000, // 30 seconds
        maxBuffer: 1024 * 1024, // 1MB
        cwd: this.restrictToWorkspace ? process.cwd() : undefined,
      });

      const output = stdout + (stderr ? `\nSTDERR:\n${stderr}` : '');
      return this.success(output || 'Command executed successfully (no output)');
    } catch (error) {
      const err = error as { stdout?: string; stderr?: string; message: string };
      const output = err.stdout || err.stderr || err.message;
      return this.error(`Command failed: ${output}`);
    }
  }
}

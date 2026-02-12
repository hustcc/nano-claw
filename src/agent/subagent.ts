/**
 * Subagent - Background Task Execution
 * Handles background tasks and spawning of sub-agents
 */

import { AgentContext } from '../types';
import { logger } from '../utils/logger';

export interface SubagentTask {
  id: string;
  description: string;
  context: AgentContext;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class Subagent {
  private tasks: Map<string, SubagentTask>;
  private runningTasks: Set<string>;
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 3) {
    this.tasks = new Map();
    this.runningTasks = new Set();
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Spawn a background task
   */
  async spawn(description: string, context: AgentContext): Promise<string> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const task: SubagentTask = {
      id: taskId,
      description,
      context,
      status: 'pending',
      createdAt: new Date(),
    };

    this.tasks.set(taskId, task);
    logger.info(`Spawned subagent task: ${taskId} - ${description}`);

    // Start task if we have capacity
    if (this.runningTasks.size < this.maxConcurrent) {
      this.executeTask(taskId).catch((error) => {
        logger.error(`Subagent task failed: ${taskId}`, error);
      });
    }

    return taskId;
  }

  /**
   * Execute a task
   */
  private async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') {
      return;
    }

    this.runningTasks.add(taskId);
    task.status = 'running';
    task.startedAt = new Date();

    try {
      logger.info(`Executing subagent task: ${taskId}`);

      // Note: For actual implementation, we would need to:
      // 1. Load config
      // 2. Create a new AgentLoop with the subagent session
      // 3. Process the task description
      // For now, we'll just set a placeholder result
      const result = `Subagent task ${taskId} executed successfully`;

      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();

      logger.info(`Subagent task completed: ${taskId}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      task.completedAt = new Date();

      logger.error(`Subagent task failed: ${taskId}`, error);
    } finally {
      this.runningTasks.delete(taskId);

      // Start next pending task if available
      this.startNextPendingTask();
    }
  }

  /**
   * Start next pending task if available
   */
  private startNextPendingTask(): void {
    if (this.runningTasks.size >= this.maxConcurrent) {
      return;
    }

    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'pending') {
        this.executeTask(taskId).catch((error) => {
          logger.error(`Subagent task failed: ${taskId}`, error);
        });
        break;
      }
    }
  }

  /**
   * Get task status
   */
  getTask(taskId: string): SubagentTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): SubagentTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get running tasks
   */
  getRunningTasks(): SubagentTask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.status === 'running'
    );
  }

  /**
   * Get pending tasks
   */
  getPendingTasks(): SubagentTask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.status === 'pending'
    );
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'pending') {
      task.status = 'failed';
      task.error = 'Cancelled by user';
      task.completedAt = new Date();
      logger.info(`Cancelled subagent task: ${taskId}`);
      return true;
    }
    return false;
  }

  /**
   * Clean up old tasks
   */
  cleanup(maxAge: number = 3600000): number {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [taskId, task] of this.tasks.entries()) {
      if (
        task.completedAt &&
        now - task.completedAt.getTime() > maxAge
      ) {
        toDelete.push(taskId);
      }
    }

    for (const taskId of toDelete) {
      this.tasks.delete(taskId);
    }

    logger.info(`Cleaned up ${toDelete.length} old subagent tasks`);
    return toDelete.length;
  }

  /**
   * Wait for a task to complete
   */
  async waitForTask(
    taskId: string,
    timeoutMs: number = 60000
  ): Promise<SubagentTask> {
    const startTime = Date.now();

    while (true) {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw new Error(`Task not found: ${taskId}`);
      }

      if (task.status === 'completed' || task.status === 'failed') {
        return task;
      }

      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Task timeout: ${taskId}`);
      }

      // Wait a bit before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Singleton instance
let subagent: Subagent | null = null;

export function getSubagent(): Subagent {
  if (!subagent) {
    subagent = new Subagent();
  }
  return subagent;
}

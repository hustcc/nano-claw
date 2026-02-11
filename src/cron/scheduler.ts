import cron from 'node-cron';
import cronParser from 'cron-parser';
import { CronJob } from '../types.js';
import { logger } from '../utils/logger.js';

/**
 * Cron job scheduler - manages scheduled task execution
 */
export class CronScheduler {
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();
  private jobs: Map<string, CronJob> = new Map();

  /**
   * Schedule a cron job
   */
  schedule(job: CronJob, callback: () => void | Promise<void>): boolean {
    try {
      // Validate cron expression
      if (!cron.validate(job.schedule)) {
        logger.error({ schedule: job.schedule }, 'Invalid cron expression');
        return false;
      }

      // Stop existing task if any
      this.unschedule(job.id);

      // Schedule new task
      const task = cron.schedule(job.schedule, async () => {
        logger.info({ jobId: job.id, name: job.name }, 'Executing cron job');
        job.lastRun = new Date();

        try {
          await callback();
          logger.info({ jobId: job.id, name: job.name }, 'Cron job completed successfully');
        } catch (error) {
          logger.error({ error, jobId: job.id, name: job.name }, 'Cron job execution failed');
        }

        // Update next run time
        this.updateNextRun(job);
      });

      this.scheduledTasks.set(job.id, task);
      this.jobs.set(job.id, job);

      // Calculate next run time
      this.updateNextRun(job);

      logger.info({ jobId: job.id, name: job.name, schedule: job.schedule }, 'Cron job scheduled');
      return true;
    } catch (error) {
      logger.error({ error, jobId: job.id }, 'Failed to schedule cron job');
      return false;
    }
  }

  /**
   * Unschedule a cron job
   */
  unschedule(jobId: string): boolean {
    const task = this.scheduledTasks.get(jobId);
    if (task) {
      task.stop();
      this.scheduledTasks.delete(jobId);
      this.jobs.delete(jobId);
      logger.info({ jobId }, 'Cron job unscheduled');
      return true;
    }
    return false;
  }

  /**
   * Start all scheduled tasks
   */
  startAll(): void {
    for (const [jobId, task] of this.scheduledTasks.entries()) {
      task.start();
      logger.debug({ jobId }, 'Started cron task');
    }
  }

  /**
   * Stop all scheduled tasks
   */
  stopAll(): void {
    for (const [jobId, task] of this.scheduledTasks.entries()) {
      task.stop();
      logger.debug({ jobId }, 'Stopped cron task');
    }
  }

  /**
   * Get scheduled job
   */
  getJob(jobId: string): CronJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all scheduled jobs
   */
  getAllJobs(): CronJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Update next run time for a job
   */
  private updateNextRun(job: CronJob): void {
    try {
      const interval = cronParser.parseExpression(job.schedule);
      job.nextRun = interval.next().toDate();
    } catch (error) {
      logger.error({ error, jobId: job.id }, 'Failed to calculate next run time');
    }
  }

  /**
   * Validate cron expression
   */
  static validateExpression(expression: string): boolean {
    return cron.validate(expression);
  }
}

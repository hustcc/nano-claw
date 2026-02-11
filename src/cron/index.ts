import { readFileSync, writeFileSync, existsSync } from 'fs';
import { CronJob } from '../types.js';
import { getCronJobsPath } from '../utils/helpers.js';
import { generateId } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';
import { CronScheduler } from './scheduler.js';
import { AgentLoop } from '../agent/loop.js';
import { Config } from '../config/schema.js';

/**
 * Cron manager - manages cron jobs persistence and execution
 */
export class CronManager {
  private cronJobsPath: string;
  private scheduler: CronScheduler;
  private config: Config;

  constructor(config: Config) {
    this.cronJobsPath = getCronJobsPath();
    this.scheduler = new CronScheduler();
    this.config = config;
  }

  /**
   * Load cron jobs from file
   */
  loadJobs(): CronJob[] {
    if (!existsSync(this.cronJobsPath)) {
      return [];
    }

    try {
      const data = readFileSync(this.cronJobsPath, 'utf-8');
      const jobs = JSON.parse(data) as CronJob[];

      // Parse dates
      for (const job of jobs) {
        if (job.lastRun) {
          job.lastRun = new Date(job.lastRun);
        }
        if (job.nextRun) {
          job.nextRun = new Date(job.nextRun);
        }
      }

      logger.info({ count: jobs.length }, 'Loaded cron jobs');
      return jobs;
    } catch (error) {
      logger.error({ error }, 'Failed to load cron jobs');
      return [];
    }
  }

  /**
   * Save cron jobs to file
   */
  saveJobs(jobs: CronJob[]): void {
    try {
      const data = JSON.stringify(jobs, null, 2);
      writeFileSync(this.cronJobsPath, data, 'utf-8');
      logger.debug({ count: jobs.length }, 'Saved cron jobs');
    } catch (error) {
      logger.error({ error }, 'Failed to save cron jobs');
    }
  }

  /**
   * Add a new cron job
   */
  addJob(name: string, schedule: string, task: string, enabled = true): CronJob {
    const jobs = this.loadJobs();

    const newJob: CronJob = {
      id: generateId(),
      name,
      schedule,
      task,
      enabled,
    };

    jobs.push(newJob);
    this.saveJobs(jobs);

    // Schedule the job
    if (enabled) {
      this.scheduleJob(newJob);
    }

    logger.info({ jobId: newJob.id, name, schedule }, 'Added cron job');
    return newJob;
  }

  /**
   * Remove a cron job
   */
  removeJob(jobId: string): boolean {
    const jobs = this.loadJobs();
    const index = jobs.findIndex((j) => j.id === jobId);

    if (index === -1) {
      return false;
    }

    jobs.splice(index, 1);
    this.saveJobs(jobs);

    // Unschedule the job
    this.scheduler.unschedule(jobId);

    logger.info({ jobId }, 'Removed cron job');
    return true;
  }

  /**
   * List all cron jobs
   */
  listJobs(): CronJob[] {
    return this.loadJobs();
  }

  /**
   * Enable a cron job
   */
  enableJob(jobId: string): boolean {
    const jobs = this.loadJobs();
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
      return false;
    }

    job.enabled = true;
    this.saveJobs(jobs);

    // Schedule the job
    this.scheduleJob(job);

    logger.info({ jobId }, 'Enabled cron job');
    return true;
  }

  /**
   * Disable a cron job
   */
  disableJob(jobId: string): boolean {
    const jobs = this.loadJobs();
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
      return false;
    }

    job.enabled = false;
    this.saveJobs(jobs);

    // Unschedule the job
    this.scheduler.unschedule(jobId);

    logger.info({ jobId }, 'Disabled cron job');
    return true;
  }

  /**
   * Schedule a job for execution
   */
  private scheduleJob(job: CronJob): void {
    this.scheduler.schedule(job, async () => {
      // Execute the task using agent
      const sessionId = `cron-${job.id}`;
      const agent = new AgentLoop(sessionId, this.config);

      try {
        await agent.processMessage(job.task);
      } catch (error) {
        logger.error({ error, jobId: job.id }, 'Failed to execute cron job task');
      }

      // Update job in storage
      const jobs = this.loadJobs();
      const jobIndex = jobs.findIndex((j) => j.id === job.id);
      if (jobIndex !== -1) {
        jobs[jobIndex] = job;
        this.saveJobs(jobs);
      }
    });
  }

  /**
   * Start all enabled cron jobs
   */
  start(): void {
    const jobs = this.loadJobs();

    for (const job of jobs) {
      if (job.enabled) {
        this.scheduleJob(job);
      }
    }

    this.scheduler.startAll();
    logger.info({ count: jobs.filter((j) => j.enabled).length }, 'Started cron jobs');
  }

  /**
   * Stop all cron jobs
   */
  stop(): void {
    this.scheduler.stopAll();
    logger.info('Stopped all cron jobs');
  }

  /**
   * Validate cron expression
   */
  static validateExpression(expression: string): boolean {
    return CronScheduler.validateExpression(expression);
  }
}

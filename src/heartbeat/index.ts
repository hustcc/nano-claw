/**
 * Heartbeat - Proactive Wake-up Mechanism
 * Periodically checks for tasks that need agent attention
 */

import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export interface HeartbeatConfig {
  enabled: boolean;
  interval: number; // milliseconds
  onBeat?: () => Promise<void>;
}

export class Heartbeat extends EventEmitter {
  private config: HeartbeatConfig;
  private timer: NodeJS.Timeout | null;
  private isRunning: boolean;
  private beatCount: number;
  private lastBeat: Date | null;

  constructor(config: HeartbeatConfig) {
    super();
    this.config = {
      enabled: config.enabled,
      interval: config.interval || 60000, // default: 1 minute
      onBeat: config.onBeat,
    };
    this.timer = null;
    this.isRunning = false;
    this.beatCount = 0;
    this.lastBeat = null;
  }

  /**
   * Start heartbeat
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('Heartbeat is already running');
      return;
    }

    if (!this.config.enabled) {
      logger.info('Heartbeat is disabled in config');
      return;
    }

    this.isRunning = true;
    this.scheduleNextBeat();
    logger.info(`Heartbeat started with interval: ${this.config.interval}ms`);
  }

  /**
   * Stop heartbeat
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.isRunning = false;
    logger.info('Heartbeat stopped');
  }

  /**
   * Schedule next heartbeat
   */
  private scheduleNextBeat(): void {
    if (!this.isRunning) {
      return;
    }

    this.timer = setTimeout(() => {
      this.beat().catch((error) => {
        logger.error('Heartbeat error', error);
        this.emit('error', error);
      });
    }, this.config.interval);
  }

  /**
   * Execute a heartbeat
   */
  private async beat(): Promise<void> {
    this.beatCount++;
    this.lastBeat = new Date();

    logger.debug(`Heartbeat ${this.beatCount} at ${this.lastBeat.toISOString()}`);

    try {
      // Emit beat event
      this.emit('beat', {
        count: this.beatCount,
        timestamp: this.lastBeat,
      });

      // Call custom beat handler if provided
      if (this.config.onBeat) {
        await this.config.onBeat();
      }
    } catch (error) {
      logger.error('Error during heartbeat', error);
      this.emit('error', error);
    } finally {
      // Schedule next beat
      this.scheduleNextBeat();
    }
  }

  /**
   * Get heartbeat status
   */
  getStatus(): {
    enabled: boolean;
    running: boolean;
    beatCount: number;
    lastBeat: Date | null;
    interval: number;
  } {
    return {
      enabled: this.config.enabled,
      running: this.isRunning,
      beatCount: this.beatCount,
      lastBeat: this.lastBeat,
      interval: this.config.interval,
    };
  }

  /**
   * Update heartbeat interval
   */
  updateInterval(interval: number): void {
    if (interval < 1000) {
      throw new Error('Interval must be at least 1000ms');
    }

    this.config.interval = interval;
    logger.info(`Heartbeat interval updated to: ${interval}ms`);

    // Restart if currently running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Manually trigger a beat
   */
  async trigger(): Promise<void> {
    logger.info('Manually triggering heartbeat');
    await this.beat();
  }
}

// Singleton instance
let heartbeat: Heartbeat | null = null;

export function getHeartbeat(config?: HeartbeatConfig): Heartbeat {
  if (!heartbeat && config) {
    heartbeat = new Heartbeat(config);
  }
  if (!heartbeat) {
    throw new Error('Heartbeat not initialized. Call with config first.');
  }
  return heartbeat;
}

export function initializeHeartbeat(config: HeartbeatConfig): Heartbeat {
  heartbeat = new Heartbeat(config);
  return heartbeat;
}

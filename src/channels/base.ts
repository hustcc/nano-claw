/**
 * Base Channel Interface
 * All channel implementations should extend this
 */

import { EventEmitter } from 'events';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';

export abstract class BaseChannel extends EventEmitter {
  protected channelType: string;
  protected enabled: boolean;

  constructor(channelType: string) {
    super();
    this.channelType = channelType;
    this.enabled = false;
  }

  /**
   * Initialize the channel
   */
  abstract initialize(): Promise<void>;

  /**
   * Start listening for messages
   */
  abstract start(): Promise<void>;

  /**
   * Stop listening for messages
   */
  abstract stop(): Promise<void>;

  /**
   * Send a message through the channel
   */
  abstract sendMessage(
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void>;

  /**
   * Get channel type
   */
  getChannelType(): string {
    return this.channelType;
  }

  /**
   * Check if channel is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get channel status
   */
  getStatus(): {
    type: string;
    enabled: boolean;
    connected: boolean;
  } {
    return {
      type: this.channelType,
      enabled: this.enabled,
      connected: this.isConnected(),
    };
  }

  /**
   * Check if channel is connected
   */
  protected abstract isConnected(): boolean;

  /**
   * Emit a message event
   */
  protected emitMessage(message: ChannelMessage): void {
    logger.debug(`Message from ${this.channelType}: ${message.id}`);
    this.emit('message', message);
  }

  /**
   * Emit an error event
   */
  protected emitError(error: Error): void {
    logger.error(`Error in ${this.channelType} channel`, error);
    this.emit('error', error);
  }
}

/**
 * Channel factory interface
 */
export interface ChannelFactory {
  create(config: any): BaseChannel;
}

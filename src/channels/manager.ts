/**
 * Channel Manager
 * Manages all active channels and message routing
 */

import { BaseChannel } from './base';
import { getMessageBus } from '../bus';
import { logger } from '../utils/logger';
import { ChannelMessage } from '../types';

export class ChannelManager {
  private channels: Map<string, BaseChannel>;
  private messageBus: ReturnType<typeof getMessageBus>;

  constructor() {
    this.channels = new Map();
    this.messageBus = getMessageBus();
  }

  /**
   * Register a channel
   */
  registerChannel(channel: BaseChannel): void {
    const channelType = channel.getChannelType();

    if (this.channels.has(channelType)) {
      logger.warn(`Channel ${channelType} is already registered`);
      return;
    }

    this.channels.set(channelType, channel);

    // Forward channel messages to message bus
    channel.on('message', (message: ChannelMessage) => {
      this.messageBus.publish(message).catch((error) => {
        logger.error('Failed to publish message to bus', error);
      });
    });

    channel.on('error', (error: Error) => {
      logger.error(`Channel ${channelType} error`, error);
    });

    logger.info(`Registered channel: ${channelType}`);
  }

  /**
   * Unregister a channel
   */
  unregisterChannel(channelType: string): void {
    const channel = this.channels.get(channelType);
    if (channel) {
      channel.removeAllListeners();
      this.channels.delete(channelType);
      logger.info(`Unregistered channel: ${channelType}`);
    }
  }

  /**
   * Start all channels
   */
  async startAll(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [channelType, channel] of this.channels.entries()) {
      if (channel.isEnabled()) {
        logger.info(`Starting channel: ${channelType}`);
        promises.push(
          channel.start().catch((error) => {
            logger.error(`Failed to start channel ${channelType}`, error);
          })
        );
      } else {
        logger.info(`Channel ${channelType} is disabled, skipping`);
      }
    }

    await Promise.all(promises);
    logger.info('All enabled channels started');
  }

  /**
   * Stop all channels
   */
  async stopAll(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [channelType, channel] of this.channels.entries()) {
      logger.info(`Stopping channel: ${channelType}`);
      promises.push(
        channel.stop().catch((error) => {
          logger.error(`Failed to stop channel ${channelType}`, error);
        })
      );
    }

    await Promise.all(promises);
    logger.info('All channels stopped');
  }

  /**
   * Send a message through a specific channel
   */
  async sendMessage(
    channelType: string,
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const channel = this.channels.get(channelType);
    if (!channel) {
      throw new Error(`Channel not found: ${channelType}`);
    }

    if (!channel.isEnabled()) {
      throw new Error(`Channel is disabled: ${channelType}`);
    }

    await channel.sendMessage(userId, content, metadata);
  }

  /**
   * Get all registered channels
   */
  getChannels(): BaseChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Get a specific channel
   */
  getChannel(channelType: string): BaseChannel | undefined {
    return this.channels.get(channelType);
  }

  /**
   * Get channel status
   */
  getChannelStatus(channelType: string): ReturnType<BaseChannel['getStatus']> | null {
    const channel = this.channels.get(channelType);
    return channel ? channel.getStatus() : null;
  }

  /**
   * Get all channel statuses
   */
  getAllChannelStatuses(): Record<string, ReturnType<BaseChannel['getStatus']>> {
    const statuses: Record<string, ReturnType<BaseChannel['getStatus']>> = {};

    for (const [channelType, channel] of this.channels.entries()) {
      statuses[channelType] = channel.getStatus();
    }

    return statuses;
  }
}

// Singleton instance
let channelManager: ChannelManager | null = null;

export function getChannelManager(): ChannelManager {
  if (!channelManager) {
    channelManager = new ChannelManager();
  }
  return channelManager;
}

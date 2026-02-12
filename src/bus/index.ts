/**
 * Message Bus
 * Routes messages between channels and agent
 */

import { EventEmitter } from 'events';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';

export type MessageHandler = (message: ChannelMessage) => Promise<void>;

export class MessageBus extends EventEmitter {
  private handlers: Map<string, Set<MessageHandler>>;
  private globalHandlers: Set<MessageHandler>;

  constructor() {
    super();
    this.handlers = new Map();
    this.globalHandlers = new Set();
  }

  /**
   * Subscribe to messages from a specific channel
   */
  subscribe(channelType: string, handler: MessageHandler): void {
    if (!this.handlers.has(channelType)) {
      this.handlers.set(channelType, new Set());
    }
    this.handlers.get(channelType)!.add(handler);
    logger.debug(`Subscribed handler to channel: ${channelType}`);
  }

  /**
   * Subscribe to all messages
   */
  subscribeAll(handler: MessageHandler): void {
    this.globalHandlers.add(handler);
    logger.debug('Subscribed global handler');
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channelType: string, handler: MessageHandler): void {
    const channelHandlers = this.handlers.get(channelType);
    if (channelHandlers) {
      channelHandlers.delete(handler);
      if (channelHandlers.size === 0) {
        this.handlers.delete(channelType);
      }
      logger.debug(`Unsubscribed handler from channel: ${channelType}`);
    }
  }

  /**
   * Unsubscribe from all messages
   */
  unsubscribeAll(handler: MessageHandler): void {
    this.globalHandlers.delete(handler);
    logger.debug('Unsubscribed global handler');
  }

  /**
   * Publish a message to the bus
   */
  async publish(message: ChannelMessage): Promise<void> {
    logger.info(`Publishing message from ${message.channelType}: ${message.id}`);

    // Emit event for potential listeners
    this.emit('message', message);
    this.emit(`message:${message.channelType}`, message);

    // Call channel-specific handlers
    const channelHandlers = this.handlers.get(message.channelType);
    if (channelHandlers) {
      const promises = Array.from(channelHandlers).map((handler) =>
        this.safeHandlerCall(handler, message)
      );
      await Promise.all(promises);
    }

    // Call global handlers
    const globalPromises = Array.from(this.globalHandlers).map((handler) =>
      this.safeHandlerCall(handler, message)
    );
    await Promise.all(globalPromises);
  }

  /**
   * Safely call a handler with error handling
   */
  private async safeHandlerCall(handler: MessageHandler, message: ChannelMessage): Promise<void> {
    try {
      await handler(message);
    } catch (error) {
      logger.error('Error in message handler', error);
      this.emit('error', { error, message });
    }
  }

  /**
   * Get number of handlers for a channel
   */
  getHandlerCount(channelType?: string): number {
    if (channelType) {
      return this.handlers.get(channelType)?.size || 0;
    }
    let total = this.globalHandlers.size;
    for (const handlers of this.handlers.values()) {
      total += handlers.size;
    }
    return total;
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.globalHandlers.clear();
    this.removeAllListeners();
    logger.info('Cleared all message bus handlers');
  }
}

// Singleton instance
let messageBus: MessageBus | null = null;

export function getMessageBus(): MessageBus {
  if (!messageBus) {
    messageBus = new MessageBus();
  }
  return messageBus;
}

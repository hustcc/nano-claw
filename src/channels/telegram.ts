/**
 * Telegram Channel Adapter
 * Integrates Telegram Bot API with nano-claw
 */

import TelegramBot from 'node-telegram-bot-api';
import { BaseChannel } from './base';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';
import { generateId } from '../utils/helpers';

export interface TelegramChannelConfig {
  enabled: boolean;
  token?: string;
  allowFrom?: string[];
}

export class TelegramChannel extends BaseChannel {
  private bot: TelegramBot | null;
  private config: TelegramChannelConfig;
  private connected: boolean;

  constructor(config: TelegramChannelConfig) {
    super('telegram');
    this.config = config;
    this.bot = null;
    this.connected = false;
    this.enabled = config.enabled;
  }

  /**
   * Initialize the Telegram bot
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('Telegram channel is disabled');
      return;
    }

    if (!this.config.token) {
      throw new Error('Telegram bot token is required');
    }

    try {
      this.bot = new TelegramBot(this.config.token, { polling: false });
      logger.info('Telegram channel initialized');
    } catch (error) {
      logger.error('Failed to initialize Telegram channel', error);
      throw error;
    }
  }

  /**
   * Start listening for messages
   */
  async start(): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram bot not initialized');
    }

    try {
      // Start polling
      await this.bot.startPolling();
      this.connected = true;

      // Set up message handler
      this.bot.on('message', (msg) => {
        this.handleMessage(msg).catch((error) => {
          logger.error('Error handling Telegram message', error);
        });
      });

      // Set up error handler
      this.bot.on('polling_error', (error) => {
        logger.error('Telegram polling error', error);
        this.emitError(error);
      });

      logger.info('Telegram channel started');
    } catch (error) {
      logger.error('Failed to start Telegram channel', error);
      throw error;
    }
  }

  /**
   * Stop listening for messages
   */
  async stop(): Promise<void> {
    if (this.bot) {
      try {
        await this.bot.stopPolling();
        this.connected = false;
        logger.info('Telegram channel stopped');
      } catch (error) {
        logger.error('Failed to stop Telegram channel', error);
        throw error;
      }
    }
  }

  /**
   * Send a message through Telegram
   */
  async sendMessage(
    userId: string,
    content: string,
    _metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!this.bot) {
      throw new Error('Telegram bot not initialized');
    }

    try {
      const chatId = parseInt(userId, 10);
      await this.bot.sendMessage(chatId, content, {
        parse_mode: 'Markdown',
      });
      logger.debug(`Sent message to Telegram user: ${userId}`);
    } catch (error) {
      logger.error('Failed to send Telegram message', error);
      throw error;
    }
  }

  /**
   * Check if channel is connected
   */
  protected isConnected(): boolean {
    return this.connected;
  }

  /**
   * Handle incoming Telegram message
   */
  private async handleMessage(msg: TelegramBot.Message): Promise<void> {
    // Check if it's a text message
    if (!msg.text) {
      return;
    }

    // Check if user is allowed
    const userId = msg.from?.id.toString();
    if (!userId) {
      return;
    }

    if (
      this.config.allowFrom &&
      this.config.allowFrom.length > 0 &&
      !this.config.allowFrom.includes(userId)
    ) {
      logger.warn(`Telegram message from unauthorized user: ${userId}`);
      return;
    }

    // Create channel message
    const channelMessage: ChannelMessage = {
      id: generateId(),
      sessionId: `telegram-${userId}`,
      userId,
      content: msg.text,
      channelType: 'telegram',
      timestamp: new Date(msg.date * 1000),
      metadata: {
        messageId: msg.message_id,
        chatId: msg.chat.id,
        username: msg.from?.username,
        firstName: msg.from?.first_name,
        lastName: msg.from?.last_name,
      },
    };

    // Emit the message
    this.emitMessage(channelMessage);
  }
}

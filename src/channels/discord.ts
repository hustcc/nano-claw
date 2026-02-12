/**
 * Discord Channel Adapter
 * Integrates Discord Bot API with nano-claw
 */

import { Client, GatewayIntentBits, Message } from 'discord.js';
import { BaseChannel } from './base';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';
import { generateId } from '../utils/helpers';

export interface DiscordChannelConfig {
  enabled: boolean;
  token?: string;
  allowFrom?: string[];
}

export class DiscordChannel extends BaseChannel {
  private client: Client | null;
  private config: DiscordChannelConfig;
  private connected: boolean;

  constructor(config: DiscordChannelConfig) {
    super('discord');
    this.config = config;
    this.client = null;
    this.connected = false;
    this.enabled = config.enabled;
  }

  /**
   * Initialize the Discord bot
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('Discord channel is disabled');
      return;
    }

    if (!this.config.token) {
      throw new Error('Discord bot token is required');
    }

    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      logger.info('Discord channel initialized');
    } catch (error) {
      logger.error('Failed to initialize Discord channel', error);
      throw error;
    }
  }

  /**
   * Start listening for messages
   */
  async start(): Promise<void> {
    if (!this.client) {
      throw new Error('Discord client not initialized');
    }

    try {
      // Set up event handlers
      this.client.on('ready', () => {
        this.connected = true;
        logger.info(`Discord bot logged in as ${this.client?.user?.tag}`);
      });

      this.client.on('messageCreate', (msg) => {
        this.handleMessage(msg).catch((error) => {
          logger.error('Error handling Discord message', error);
        });
      });

      this.client.on('error', (error) => {
        logger.error('Discord client error', error);
        this.emitError(error);
      });

      // Login to Discord
      await this.client.login(this.config.token);
      logger.info('Discord channel started');
    } catch (error) {
      logger.error('Failed to start Discord channel', error);
      throw error;
    }
  }

  /**
   * Stop listening for messages
   */
  async stop(): Promise<void> {
    if (this.client) {
      try {
        this.client.destroy();
        this.connected = false;
        logger.info('Discord channel stopped');
      } catch (error) {
        logger.error('Failed to stop Discord channel', error);
        throw error;
      }
    }
  }

  /**
   * Send a message through Discord
   */
  async sendMessage(
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Discord client not initialized');
    }

    try {
      // Get the channel from metadata or try to DM the user
      const channelId = metadata?.channelId as string | undefined;

      if (channelId) {
        const channel = await this.client.channels.fetch(channelId);
        if (channel && 'send' in channel && typeof channel.send === 'function') {
          await channel.send(content);
        }
      } else {
        // Try to DM the user
        const user = await this.client.users.fetch(userId);
        await user.send(content);
      }

      logger.debug(`Sent message to Discord user: ${userId}`);
    } catch (error) {
      logger.error('Failed to send Discord message', error);
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
   * Handle incoming Discord message
   */
  private async handleMessage(msg: Message): Promise<void> {
    // Ignore bot messages
    if (msg.author.bot) {
      return;
    }

    // Check if user is allowed
    const userId = msg.author.id;
    if (
      this.config.allowFrom &&
      this.config.allowFrom.length > 0 &&
      !this.config.allowFrom.includes(userId)
    ) {
      logger.warn(`Discord message from unauthorized user: ${userId}`);
      return;
    }

    // Only respond to DMs or mentions
    const isDM = msg.guild === null;
    const isMentioned = msg.mentions.has(this.client?.user?.id || '');

    if (!isDM && !isMentioned) {
      return;
    }

    // Remove bot mention from content if present
    let content = msg.content;
    if (isMentioned && this.client?.user) {
      content = content.replace(new RegExp(`<@!?${this.client.user.id}>`), '').trim();
    }

    // Create channel message
    const channelMessage: ChannelMessage = {
      id: generateId(),
      sessionId: `discord-${userId}`,
      userId,
      content,
      channelType: 'discord',
      timestamp: msg.createdAt,
      metadata: {
        messageId: msg.id,
        channelId: msg.channel.id,
        guildId: msg.guild?.id,
        username: msg.author.username,
        discriminator: msg.author.discriminator,
      },
    };

    // Emit the message
    this.emitMessage(channelMessage);
  }
}

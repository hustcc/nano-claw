/**
 * DingTalk Channel Adapter
 * Integrates DingTalk Stream API with nano-claw
 */

import { DWClient, DWClientDownStream, EventAck } from 'dingtalk-stream';
import { BaseChannel } from './base';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';
import { generateId } from '../utils/helpers';

export interface DingTalkChannelConfig {
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  allowFrom?: string[];
}

export class DingTalkChannel extends BaseChannel {
  private client: DWClient | null;
  private config: DingTalkChannelConfig;
  private connected: boolean;

  constructor(config: DingTalkChannelConfig) {
    super('dingtalk');
    this.config = config;
    this.client = null;
    this.connected = false;
    this.enabled = config.enabled;
  }

  /**
   * Initialize the DingTalk client
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('DingTalk channel is disabled');
      return;
    }

    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('DingTalk clientId and clientSecret are required');
    }

    try {
      // Initialize DingTalk Stream client
      this.client = new DWClient({
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      });

      logger.info('DingTalk channel initialized');
    } catch (error) {
      logger.error('Failed to initialize DingTalk channel', error);
      throw error;
    }
  }

  /**
   * Start listening for messages
   */
  async start(): Promise<void> {
    if (!this.client) {
      throw new Error('DingTalk client not initialized');
    }

    try {
      // Register message callback
      this.client.registerCallbackListener('SYSTEM', async (res: DWClientDownStream) => {
        await this.handleMessage(res);
        return EventAck.SUCCESS;
      });

      // Connect to DingTalk Stream
      await this.client.connect();
      this.connected = true;

      logger.info('DingTalk channel started');
    } catch (error) {
      logger.error('Failed to start DingTalk channel', error);
      throw error;
    }
  }

  /**
   * Stop listening for messages
   */
  async stop(): Promise<void> {
    if (this.client) {
      try {
        await this.client.disconnect();
        this.connected = false;
        logger.info('DingTalk channel stopped');
      } catch (error) {
        logger.error('Failed to stop DingTalk channel', error);
        throw error;
      }
    }
  }

  /**
   * Send a message through DingTalk
   */
  async sendMessage(
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!this.client) {
      throw new Error('DingTalk client not initialized');
    }

    try {
      // DingTalk uses webhook or API to send messages
      // For Stream mode, we need to reply to the conversation
      const conversationId = metadata?.conversationId as string | undefined;
      const robotCode = metadata?.robotCode as string | undefined;

      if (conversationId && robotCode) {
        // Send message via DingTalk API
        // Note: This requires additional API setup
        logger.debug(`Sending message to DingTalk user: ${userId}`);

        // The actual implementation would use DingTalk's REST API
        // For now, we'll log that we would send the message
        logger.info(`Would send to conversation ${conversationId}: ${content}`);
      } else {
        logger.warn('Missing conversationId or robotCode in metadata');
      }
    } catch (error) {
      logger.error('Failed to send DingTalk message', error);
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
   * Handle incoming DingTalk message
   */
  private async handleMessage(res: DWClientDownStream): Promise<void> {
    try {
      const { headers, data } = res;

      // Parse the message data
      const eventType = headers?.eventType;

      // Only handle IM messages
      if (eventType !== 'im.message.receive_v1') {
        return;
      }

      const messageData = typeof data === 'string' ? JSON.parse(data) : data;

      // Extract message details
      const senderId = messageData?.senderId || messageData?.senderStaffId;
      const text = messageData?.text?.content || messageData?.content;
      const conversationId = messageData?.conversationId;
      const robotCode = messageData?.robotCode;

      if (!senderId || !text) {
        return;
      }

      // Check if user is allowed
      if (
        this.config.allowFrom &&
        this.config.allowFrom.length > 0 &&
        !this.config.allowFrom.includes(senderId)
      ) {
        logger.warn(`DingTalk message from unauthorized user: ${senderId}`);
        return;
      }

      // Create channel message
      const channelMessage: ChannelMessage = {
        id: generateId(),
        sessionId: `dingtalk-${senderId}`,
        userId: senderId,
        content: text,
        channelType: 'dingtalk',
        timestamp: new Date(),
        metadata: {
          conversationId,
          robotCode,
          messageId: messageData?.msgId,
          conversationType: messageData?.conversationType,
          senderNick: messageData?.senderNick,
        },
      };

      // Emit the message
      this.emitMessage(channelMessage);
    } catch (error) {
      logger.error('Error handling DingTalk message', error);
    }
  }
}

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

interface DingTalkMessageData {
  senderId?: string;
  senderStaffId?: string;
  text?: {
    content?: string;
  };
  content?: string;
  conversationId?: string;
  robotCode?: string;
  msgId?: string;
  conversationType?: string;
  senderNick?: string;
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
    if (!this.config.enabled) return logger.info('DingTalk channel is disabled');
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('DingTalk clientId and clientSecret are required');
    }

    this.client = new DWClient({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
    });
    logger.info('DingTalk channel initialized');
  }

  /**
   * Start listening for messages
   */
  async start(): Promise<void> {
    if (!this.client) {
      throw new Error('DingTalk client not initialized');
    }

    try {
      // Register callback for bot messages
      // Note: DingTalk Stream API uses different topics based on message type
      // For bot IM messages, we register both SYSTEM and IM topics
      this.client.registerCallbackListener('SYSTEM', (res: DWClientDownStream) => {
        this.handleMessage(res);
        return EventAck.SUCCESS;
      });

      this.client.registerCallbackListener(
        '/v1.0/im/bot/messages/get',
        (res: DWClientDownStream) => {
          this.handleMessage(res);
          return EventAck.SUCCESS;
        }
      );

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
      this.client.disconnect();
      this.connected = false;
      logger.info('DingTalk channel stopped');
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
      // DingTalk Stream mode requires using the REST API to send messages
      const conversationId = metadata?.conversationId as string | undefined;
      const robotCode = metadata?.robotCode as string | undefined;

      if (!conversationId || !robotCode) {
        throw new Error(
          'Missing conversationId or robotCode in metadata for DingTalk message sending'
        );
      }

      // Use DingTalk's REST API to send messages
      // This requires an access token which should be obtained from the client
      const axios = (await import('axios')).default;

      // Get access token from DingTalk
      const tokenResponse = await axios.post<{ accessToken: string }>(
        'https://api.dingtalk.com/v1.0/oauth2/accessToken',
        {
          appKey: this.config.clientId,
          appSecret: this.config.clientSecret,
        }
      );

      const accessToken = tokenResponse.data.accessToken;

      // Send message to conversation
      await axios.post<unknown>(
        `https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend`,
        {
          robotCode,
          userIds: [userId],
          msgKey: 'sampleText',
          msgParam: JSON.stringify({ content }),
        },
        {
          headers: {
            'x-acs-dingtalk-access-token': accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.debug(`Sent message to DingTalk user: ${userId}`);
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
  private handleMessage(res: DWClientDownStream): void {
    try {
      const { headers, data } = res;

      // Parse the message data
      const eventType = headers?.eventType;

      // Only handle IM messages
      if (eventType !== 'im.message.receive_v1') {
        return;
      }

      const messageData: DingTalkMessageData =
        typeof data === 'string'
          ? (JSON.parse(data) as DingTalkMessageData)
          : (data as DingTalkMessageData);

      // Extract message details
      const senderId = messageData?.senderId || messageData?.senderStaffId;
      const text = messageData?.text?.content || messageData?.content;

      if (!senderId || !text || !this.isUserAuthorized(senderId, this.config.allowFrom)) {
        return;
      }

      const conversationId = messageData?.conversationId;
      const robotCode = messageData?.robotCode;

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

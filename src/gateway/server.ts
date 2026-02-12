/**
 * Gateway Server
 * Central server for managing channels and message routing
 */

import { getChannelManager } from '../channels';
import { TelegramChannel } from '../channels/telegram';
import { DiscordChannel } from '../channels/discord';
import { DingTalkChannel } from '../channels/dingtalk';
import { getMessageBus } from '../bus';
import { getSessionManager } from '../session';
import { initializeHeartbeat } from '../heartbeat';
import { AgentLoop } from '../agent/loop';
import { logger } from '../utils/logger';
import { getConfig } from '../config';
import { ChannelMessage } from '../types';

export class GatewayServer {
  private channelManager: ReturnType<typeof getChannelManager>;
  private messageBus: ReturnType<typeof getMessageBus>;
  private heartbeat: ReturnType<typeof initializeHeartbeat> | null;
  private isRunning: boolean;

  constructor() {
    this.channelManager = getChannelManager();
    this.messageBus = getMessageBus();
    this.heartbeat = null;
    this.isRunning = false;
  }

  /**
   * Initialize the gateway
   */
  async initialize(): Promise<void> {
    logger.info('Initializing gateway server...');

    // Initialize session manager
    await getSessionManager();
    logger.info('Session manager initialized');

    // Load configuration
    const config = await getConfig();

    // Register available channels
    await this.registerChannels(config);

    // Subscribe to all messages from the bus
    this.messageBus.subscribeAll(async (message: ChannelMessage) => {
      await this.handleMessage(message);
    });

    // Initialize heartbeat if configured
    if (config.agents?.defaults?.systemPrompt) {
      this.heartbeat = initializeHeartbeat({
        enabled: false, // Disabled by default, can be enabled in config
        interval: 60000, // 1 minute
        onBeat: async () => {
          logger.debug('Heartbeat tick');
          // Can be extended to perform periodic tasks
        },
      });
    }

    logger.info('Gateway initialized');
  }

  /**
   * Register available channels
   */
  private async registerChannels(config: Awaited<ReturnType<typeof getConfig>>): Promise<void> {
    // Register Telegram channel if configured
    if (config.channels?.telegram) {
      const telegramChannel = new TelegramChannel(config.channels.telegram);
      await telegramChannel.initialize();
      this.channelManager.registerChannel(telegramChannel);
      logger.info('Telegram channel registered');
    }

    // Register Discord channel if configured
    if (config.channels?.discord) {
      const discordChannel = new DiscordChannel(config.channels.discord);
      await discordChannel.initialize();
      this.channelManager.registerChannel(discordChannel);
      logger.info('Discord channel registered');
    }

    // Register DingTalk channel if configured
    if (config.channels?.dingtalk) {
      const dingtalkChannel = new DingTalkChannel(config.channels.dingtalk);
      await dingtalkChannel.initialize();
      this.channelManager.registerChannel(dingtalkChannel);
      logger.info('DingTalk channel registered');
    }

    // Add more channels here as they are implemented
  }

  /**
   * Start the gateway
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Gateway is already running');
      return;
    }

    await this.initialize();

    // Start all enabled channels
    await this.channelManager.startAll();

    // Start heartbeat if configured
    if (this.heartbeat) {
      this.heartbeat.start();
    }

    this.isRunning = true;
    logger.info('Gateway server started successfully');
  }

  /**
   * Stop the gateway
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.warn('Gateway is not running');
      return;
    }

    logger.info('Stopping gateway server...');

    // Stop heartbeat
    if (this.heartbeat) {
      this.heartbeat.stop();
    }

    // Stop all channels
    await this.channelManager.stopAll();

    // Clear message bus handlers
    this.messageBus.clear();

    this.isRunning = false;
    logger.info('Gateway server stopped');
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(message: ChannelMessage): Promise<void> {
    logger.info(`Handling message from ${message.channelType} (user: ${message.userId})`);

    try {
      // Get or create session
      const sessionManager = await getSessionManager();
      await sessionManager.getOrCreateSession(
        message.sessionId,
        message.userId,
        message.channelType
      );

      // Get config
      const config = await getConfig();

      // Create agent loop for this session and message
      const agentLoop = new AgentLoop(message.sessionId, config);

      // Process the message
      const result = await agentLoop.processMessage(message.content);

      // Send response back through the channel
      await this.channelManager.sendMessage(
        message.channelType,
        message.userId,
        result.content,
        message.metadata
      );

      logger.info(`Response sent to ${message.userId} via ${message.channelType}`);
    } catch (error) {
      logger.error('Error handling message', error);

      // Try to send error message back to user
      try {
        await this.channelManager.sendMessage(
          message.channelType,
          message.userId,
          'Sorry, I encountered an error processing your message. Please try again.',
          message.metadata
        );
      } catch (sendError) {
        logger.error('Failed to send error message', sendError);
      }
    }
  }

  /**
   * Get gateway status
   */
  getStatus(): {
    running: boolean;
    channels: Record<string, any>;
    heartbeat: any;
  } {
    return {
      running: this.isRunning,
      channels: this.channelManager.getAllChannelStatuses(),
      heartbeat: this.heartbeat ? this.heartbeat.getStatus() : null,
    };
  }
}

// Singleton instance
let gateway: GatewayServer | null = null;

export function getGateway(): GatewayServer {
  if (!gateway) {
    gateway = new GatewayServer();
  }
  return gateway;
}

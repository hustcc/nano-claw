/**
 * Webhook Channel Adapter
 * Integrates generic HTTP webhooks with nano-claw
 */

import http, { IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse } from 'http';
import { BaseChannel } from './base';
import { ChannelMessage } from '../types';
import { logger } from '../utils/logger';
import { generateId } from '../utils/helpers';

export interface WebhookChannelConfig {
  enabled: boolean;
  port?: number;
  host?: string;
  token?: string;
  connectorUrl?: string;
  allowFrom?: string[];
}

interface InboundPayload extends Record<string, unknown> {
  userId: string;
  content: string;
}

export class WebhookChannel extends BaseChannel {
  private server: Server | null;
  private connected: boolean;
  private config: {
    enabled: boolean;
    port: number;
    host: string;
    token?: string;
    connectorUrl: string;
    allowFrom: string[];
  };

  constructor(config: WebhookChannelConfig) {
    super('webhook');
    this.config = {
      enabled: config.enabled,
      port: config.port ?? 18794,
      host: config.host ?? '127.0.0.1',
      token: config.token,
      connectorUrl: config.connectorUrl ?? 'http://127.0.0.1:19400/v1/outbound',
      allowFrom: config.allowFrom ?? [],
    };
    this.server = null;
    this.connected = false;
    this.enabled = this.config.enabled;
  }

  /**
   * Initialize webhook HTTP server
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      logger.info('Webhook channel is disabled');
      return;
    }

    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res).catch((error) => {
        logger.error('Error handling webhook request', error);
        this.respond(res, 500, { error: 'Internal server error' });
      });
    });

    this.server.on('error', (error) => {
      logger.error('Webhook server error', error);
      this.emitError(error as Error);
    });

    logger.info('Webhook channel initialized');
  }

  /**
   * Start listening for webhook requests
   */
  async start(): Promise<void> {
    if (!this.server) {
      throw new Error('Webhook server not initialized');
    }

    if (this.connected) {
      logger.warn('Webhook channel is already started');
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error): void => {
        this.server?.off('listening', onListening);
        reject(error);
      };

      const onListening = (): void => {
        this.server?.off('error', onError);
        resolve();
      };

      this.server?.once('error', onError);
      this.server?.once('listening', onListening);
      this.server?.listen(this.config.port, this.config.host);
    });

    this.connected = true;
    logger.info(`Webhook channel started on http://${this.config.host}:${this.config.port}`);
  }

  /**
   * Stop webhook server
   */
  async stop(): Promise<void> {
    if (!this.server || !this.connected) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.server?.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    this.connected = false;
    logger.info('Webhook channel stopped');
  }

  /**
   * Forward outbound message to configured connector URL
   */
  async sendMessage(
    userId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const connectorUrl = new URL(this.config.connectorUrl);

    if (connectorUrl.protocol !== 'http:') {
      throw new Error('Webhook connectorUrl must use http protocol');
    }

    const payload: Record<string, unknown> = {
      userId,
      content,
      channelType: 'webhook',
    };

    if (metadata) {
      payload.metadata = metadata;
    }

    const body = JSON.stringify(payload);
    const headers: OutgoingHttpHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    };

    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    await new Promise<void>((resolve, reject) => {
      const request = http.request(
        {
          method: 'POST',
          hostname: connectorUrl.hostname,
          port: connectorUrl.port ? Number.parseInt(connectorUrl.port, 10) : 80,
          path: `${connectorUrl.pathname}${connectorUrl.search}`,
          headers,
        },
        (response) => {
          const chunks: Buffer[] = [];

          response.on('data', (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          });

          response.on('end', () => {
            const responseBody = Buffer.concat(chunks).toString('utf-8');
            const statusCode = response.statusCode ?? 500;

            if (statusCode >= 400) {
              reject(
                new Error(
                  `Webhook connector returned ${statusCode}: ${responseBody || 'Unknown error'}`
                )
              );
              return;
            }

            resolve();
          });
        }
      );

      request.on('error', reject);
      request.write(body);
      request.end();
    });

    logger.debug(`Forwarded outbound message for webhook user: ${userId}`);
  }

  /**
   * Check if webhook channel is connected
   */
  protected isConnected(): boolean {
    return this.connected;
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!this.isAuthorized(req)) {
      this.respond(res, 401, { error: 'Unauthorized' });
      return;
    }

    const method = req.method ?? 'GET';
    const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host || '127.0.0.1'}`);
    const path = requestUrl.pathname;

    if (method === 'GET' && path === '/health') {
      this.respond(res, 200, { status: 'ok', channel: 'webhook' });
      return;
    }

    if (method === 'POST' && path === '/v1/inbound') {
      await this.handleInbound(req, res);
      return;
    }

    if (method === 'POST' && path === '/v1/outbound') {
      await this.handleOutbound(req, res);
      return;
    }

    this.respond(res, 404, { error: 'Not found' });
  }

  private async handleInbound(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let payload: unknown;

    try {
      payload = await this.parseJsonBody(req);
    } catch (error) {
      logger.warn('Invalid JSON in webhook inbound request', error);
      this.respond(res, 400, { error: 'Invalid JSON body' });
      return;
    }

    if (!this.isValidInboundPayload(payload)) {
      this.respond(res, 400, { error: 'Invalid payload: userId and content are required' });
      return;
    }

    if (this.config.allowFrom.length > 0 && !this.config.allowFrom.includes(payload.userId)) {
      logger.warn(`Webhook message from unauthorized user: ${payload.userId}`);
      this.respond(res, 403, { error: 'Forbidden' });
      return;
    }

    const metadata = this.extractMetadata(payload);

    const channelMessage: ChannelMessage = {
      id: generateId(),
      sessionId: `webhook-${payload.userId}`,
      userId: payload.userId,
      content: payload.content,
      channelType: 'webhook',
      timestamp: new Date(),
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    };

    this.emitMessage(channelMessage);
    this.respond(res, 200, { status: 'accepted', id: channelMessage.id });
  }

  private async handleOutbound(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let payload: unknown;

    try {
      payload = await this.parseJsonBody(req);
    } catch (error) {
      logger.warn('Invalid JSON in webhook outbound request', error);
      this.respond(res, 400, { error: 'Invalid JSON body' });
      return;
    }

    this.emit('outbound', payload);
    this.respond(res, 200, { status: 'ok' });
  }

  private isAuthorized(req: IncomingMessage): boolean {
    if (!this.config.token) {
      return true;
    }

    return req.headers.authorization === `Bearer ${this.config.token}`;
  }

  private respond(res: ServerResponse, statusCode: number, data: Record<string, unknown>): void {
    if (res.writableEnded) {
      return;
    }

    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  }

  private async parseJsonBody(req: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      req.on('end', resolve);
      req.on('error', reject);
    });

    const rawBody = Buffer.concat(chunks).toString('utf-8').trim();

    if (!rawBody) {
      return {};
    }

    return JSON.parse(rawBody) as unknown;
  }

  private isValidInboundPayload(payload: unknown): payload is InboundPayload {
    if (!this.isRecord(payload)) {
      return false;
    }

    const { userId, content } = payload;

    return (
      typeof userId === 'string' &&
      userId.trim().length > 0 &&
      typeof content === 'string' &&
      content.trim().length > 0
    );
  }

  private extractMetadata(payload: InboundPayload): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'userId' && key !== 'content') {
        metadata[key] = value;
      }
    }

    return metadata;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

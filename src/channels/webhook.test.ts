import http from 'http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { WebhookChannel } from './webhook';
import { ChannelMessage } from '../types';

interface HttpResponse {
  statusCode: number;
  body: string;
}

async function getFreePort(): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const probeServer = http.createServer();

    probeServer.listen(0, '127.0.0.1', () => {
      const address = probeServer.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to resolve free port'));
        return;
      }

      const { port } = address;
      probeServer.close((error?: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });

    probeServer.on('error', reject);
  });
}

async function makeRequest(options: {
  host: string;
  port: number;
  method: string;
  path: string;
  token?: string;
  body?: string;
}): Promise<HttpResponse> {
  const headers: http.OutgoingHttpHeaders = {};

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(options.body);
  }

  return await new Promise<HttpResponse>((resolve, reject) => {
    const request = http.request(
      {
        host: options.host,
        port: options.port,
        method: options.method,
        path: options.path,
        headers,
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on('end', () => {
          resolve({
            statusCode: response.statusCode ?? 0,
            body: Buffer.concat(chunks).toString('utf-8'),
          });
        });
      }
    );

    request.on('error', reject);

    if (options.body !== undefined) {
      request.write(options.body);
    }

    request.end();
  });
}

describe('WebhookChannel', () => {
  const host = '127.0.0.1';
  const token = 'test-webhook-token';
  let port = 0;
  let channel: WebhookChannel;

  beforeAll(async () => {
    port = await getFreePort();
    channel = new WebhookChannel({
      enabled: true,
      host,
      port,
      token,
      allowFrom: ['user-1'],
    });

    await channel.initialize();
    await channel.start();
  });

  afterAll(async () => {
    await channel.stop();
  });

  it('handles inbound messages from /v1/inbound', async () => {
    const receivedMessage = new Promise<ChannelMessage>((resolve) => {
      channel.once('message', (message) => {
        resolve(message as ChannelMessage);
      });
    });

    const response = await makeRequest({
      host,
      port,
      method: 'POST',
      path: '/v1/inbound',
      token,
      body: JSON.stringify({
        userId: 'user-1',
        content: 'hello webhook',
        source: 'external-system',
      }),
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({ status: 'accepted' });

    const message = await receivedMessage;
    expect(message.userId).toBe('user-1');
    expect(message.content).toBe('hello webhook');
    expect(message.channelType).toBe('webhook');
    expect(message.sessionId).toBe('webhook-user-1');
    expect(message.metadata).toEqual({ source: 'external-system' });
  });

  it('rejects requests with missing or invalid bearer token', async () => {
    const withoutToken = await makeRequest({
      host,
      port,
      method: 'GET',
      path: '/health',
    });

    expect(withoutToken.statusCode).toBe(401);

    const withWrongToken = await makeRequest({
      host,
      port,
      method: 'GET',
      path: '/health',
      token: 'wrong-token',
    });

    expect(withWrongToken.statusCode).toBe(401);
  });

  it('rejects unauthorized userId based on allowFrom list', async () => {
    const response = await makeRequest({
      host,
      port,
      method: 'POST',
      path: '/v1/inbound',
      token,
      body: JSON.stringify({
        userId: 'user-2',
        content: 'blocked user',
      }),
    });

    expect(response.statusCode).toBe(403);
  });

  it('returns webhook health status', async () => {
    const response = await makeRequest({
      host,
      port,
      method: 'GET',
      path: '/health',
      token,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      status: 'ok',
      channel: 'webhook',
    });
  });

  it('returns 404 for unknown routes', async () => {
    const response = await makeRequest({
      host,
      port,
      method: 'GET',
      path: '/unknown-route',
      token,
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 400 for invalid JSON payloads', async () => {
    const response = await makeRequest({
      host,
      port,
      method: 'POST',
      path: '/v1/inbound',
      token,
      body: '{"userId":"user-1","content":',
    });

    expect(response.statusCode).toBe(400);
  });
});

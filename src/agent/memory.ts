import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Message } from '../types.js';
import { getMemoryDir } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * Memory storage for conversations
 */
export class Memory {
  private sessionId: string;
  private memoryPath: string;
  private messages: Message[] = [];
  private maxMessages: number;

  constructor(sessionId: string, maxMessages = 100) {
    this.sessionId = sessionId;
    this.maxMessages = maxMessages;

    const memoryDir = getMemoryDir();
    if (!existsSync(memoryDir)) {
      mkdirSync(memoryDir, { recursive: true });
    }

    this.memoryPath = join(memoryDir, `${sessionId}.json`);
    this.load();
  }

  /**
   * Load messages from disk
   */
  private load(): void {
    if (existsSync(this.memoryPath)) {
      try {
        const data = readFileSync(this.memoryPath, 'utf-8');
        const parsed = JSON.parse(data) as Message[];
        this.messages = parsed;
        logger.debug(
          { sessionId: this.sessionId, count: this.messages.length },
          'Memory loaded'
        );
      } catch (error) {
        logger.error({ error, sessionId: this.sessionId }, 'Failed to load memory');
        this.messages = [];
      }
    }
  }

  /**
   * Save messages to disk
   */
  private save(): void {
    try {
      const data = JSON.stringify(this.messages, null, 2);
      writeFileSync(this.memoryPath, data, 'utf-8');
      logger.debug(
        { sessionId: this.sessionId, count: this.messages.length },
        'Memory saved'
      );
    } catch (error) {
      logger.error({ error, sessionId: this.sessionId }, 'Failed to save memory');
    }
  }

  /**
   * Add a message to memory
   */
  addMessage(message: Message): void {
    this.messages.push(message);

    // Trim old messages if exceeding max
    if (this.messages.length > this.maxMessages) {
      // Keep system messages and trim from user/assistant messages
      const systemMessages = this.messages.filter((m) => m.role === 'system');
      const otherMessages = this.messages
        .filter((m) => m.role !== 'system')
        .slice(-this.maxMessages);
      this.messages = [...systemMessages, ...otherMessages];
    }

    this.save();
  }

  /**
   * Get all messages
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Get recent messages
   */
  getRecentMessages(count: number): Message[] {
    return this.messages.slice(-count);
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messages = [];
    this.save();
  }

  /**
   * Update the last message
   */
  updateLastMessage(content: string): void {
    if (this.messages.length > 0) {
      this.messages[this.messages.length - 1].content = content;
      this.save();
    }
  }

  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messages.length;
  }
}

/**
 * Session Management
 * Manages conversation sessions for different users and channels
 */

import { Session } from '../types';
import path from 'path';
import fs from 'fs/promises';
import { getConfigDir } from '../config';
import { logger } from '../utils/logger';

export class SessionManager {
  private sessionsDir: string;
  private sessions: Map<string, Session>;

  constructor() {
    this.sessionsDir = path.join(getConfigDir(), 'sessions');
    this.sessions = new Map();
  }

  /**
   * Initialize session manager
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.sessionsDir, { recursive: true });
      await this.loadSessions();
      logger.info('Session manager initialized');
    } catch (error) {
      logger.error('Failed to initialize session manager', error);
      throw error;
    }
  }

  /**
   * Load existing sessions from disk
   */
  private async loadSessions(): Promise<void> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.sessionsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const session: Session = JSON.parse(content);
          // Convert date strings back to Date objects
          session.createdAt = new Date(session.createdAt);
          session.lastActivity = new Date(session.lastActivity);
          this.sessions.set(session.id, session);
        }
      }
      logger.info(`Loaded ${this.sessions.size} sessions`);
    } catch (error) {
      logger.error('Failed to load sessions', error);
    }
  }

  /**
   * Get or create a session
   */
  async getOrCreateSession(
    sessionId: string,
    userId: string,
    channelType: string = 'cli'
  ): Promise<Session> {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        userId,
        channelType,
        createdAt: new Date(),
        lastActivity: new Date(),
        metadata: {},
      };
      this.sessions.set(sessionId, session);
      await this.saveSession(session);
      logger.info(`Created new session: ${sessionId}`);
    } else {
      // Update last activity
      session.lastActivity = new Date();
      await this.saveSession(session);
    }

    return session;
  }

  /**
   * Get a session by ID
   */
  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  /**
   * Get all active sessions (active in last 24 hours)
   */
  getActiveSessions(hours: number = 24): Session[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.sessions.values()).filter(
      (session) => session.lastActivity > cutoff
    );
  }

  /**
   * Update session metadata
   */
  async updateSessionMetadata(
    sessionId: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.metadata = { ...session.metadata, ...metadata };
      session.lastActivity = new Date();
      await this.saveSession(session);
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
    try {
      await fs.unlink(filePath);
      logger.info(`Deleted session: ${sessionId}`);
    } catch (error) {
      logger.warn(`Failed to delete session file: ${sessionId}`, error);
    }
  }

  /**
   * Clean up old sessions
   */
  async cleanupOldSessions(days: number = 30): Promise<number> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const toDelete: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < cutoff) {
        toDelete.push(sessionId);
      }
    }

    for (const sessionId of toDelete) {
      await this.deleteSession(sessionId);
    }

    logger.info(`Cleaned up ${toDelete.length} old sessions`);
    return toDelete.length;
  }

  /**
   * Save session to disk
   */
  private async saveSession(session: Session): Promise<void> {
    const filePath = path.join(this.sessionsDir, `${session.id}.json`);
    try {
      await fs.writeFile(filePath, JSON.stringify(session, null, 2));
    } catch (error) {
      logger.error(`Failed to save session: ${session.id}`, error);
    }
  }

  /**
   * Get all sessions
   */
  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }
}

// Singleton instance
let sessionManager: SessionManager | null = null;

export async function getSessionManager(): Promise<SessionManager> {
  if (!sessionManager) {
    sessionManager = new SessionManager();
    await sessionManager.initialize();
  }
  return sessionManager;
}

import { homedir } from 'os';
import { join } from 'path';
import { randomUUID as cryptoRandomUUID } from 'crypto';

/**
 * Get the home directory path for nano-claw
 */
export function getHomeDir(): string {
  return join(homedir(), '.nano-claw');
}

/**
 * Get the config directory path (same as home dir)
 */
export function getConfigDir(): string {
  return getHomeDir();
}

/**
 * Get the config file path
 */
export function getConfigPath(): string {
  return join(getHomeDir(), 'config.json');
}

/**
 * Get the memory directory path
 */
export function getMemoryDir(): string {
  return join(getHomeDir(), 'memory');
}

/**
 * Get the skills directory path
 */
export function getSkillsDir(): string {
  return join(getHomeDir(), 'skills');
}

/**
 * Get the logs directory path
 */
export function getLogsDir(): string {
  return join(getHomeDir(), 'logs');
}

/**
 * Get the cron jobs file path
 */
export function getCronJobsPath(): string {
  return join(getHomeDir(), 'cron.json');
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from ISO string
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Generate a random ID using crypto.randomUUID()
 */
export function generateId(): string {
  return cryptoRandomUUID();
}

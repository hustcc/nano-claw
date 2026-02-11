/**
 * Custom error classes for nano-claw
 */

export class NanoClawError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NanoClawError';
  }
}

export class ConfigError extends NanoClawError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ProviderError extends NanoClawError {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderError';
  }
}

export class ToolError extends NanoClawError {
  constructor(message: string) {
    super(message);
    this.name = 'ToolError';
  }
}

export class SessionError extends NanoClawError {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export class ChannelError extends NanoClawError {
  constructor(message: string) {
    super(message);
    this.name = 'ChannelError';
  }
}

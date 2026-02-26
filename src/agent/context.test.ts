import { describe, it, expect } from 'vitest';
import { ContextBuilder } from './context';
import { AgentConfig, Message } from '../types';

const defaultConfig: AgentConfig = {
  model: 'test/model',
  temperature: 0.7,
  maxTokens: 4096,
};

describe('ContextBuilder.truncateContext', () => {
  const builder = new ContextBuilder(defaultConfig);

  it('returns messages unchanged when total length is within limit', () => {
    const messages: Message[] = [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hello' },
    ];
    const result = builder.truncateContext(messages, 1000);
    expect(result).toEqual(messages);
  });

  it('removes oldest non-system messages when total exceeds limit', () => {
    const messages: Message[] = [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'old message' },
      { role: 'assistant', content: 'old reply' },
      { role: 'user', content: 'new' },
    ];
    // limit = 10 chars: system(3) + new(3) = 6, fits; add old reply(9) would exceed
    const result = builder.truncateContext(messages, 10);
    expect(result.some((m) => m.role === 'system')).toBe(true);
    // The last user message 'new' (3 chars) fits alongside system (3 chars)
    expect(result.some((m) => m.content === 'new')).toBe(true);
    // 'old message' should not be included
    expect(result.some((m) => m.content === 'old message')).toBe(false);
  });

  it('returns only system messages when system message length already equals maxLength', () => {
    const messages: Message[] = [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hello' },
    ];
    // maxLength exactly equals system message length
    const result = builder.truncateContext(messages, 3);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('system');
  });

  it('returns only system messages when system message length exceeds maxLength', () => {
    const messages: Message[] = [
      { role: 'system', content: 'this is a long system prompt' },
      { role: 'user', content: 'hello' },
    ];
    // maxLength smaller than system message
    const result = builder.truncateContext(messages, 5);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('system');
  });
});

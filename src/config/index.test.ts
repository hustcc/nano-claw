import { describe, it, expect, vi, afterEach } from 'vitest';
import { ConfigError } from '../utils/errors';

// Top-level mock definitions - vi.mock is hoisted so factories must not use outer variables
vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

afterEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

describe('loadConfig', () => {
  it('throws ConfigError when config file does not exist', async () => {
    const fs = await import('fs');
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const { loadConfig } = await import('./index');
    expect(() => loadConfig()).toThrow(ConfigError);
    expect(() => loadConfig()).toThrow(/not found/);
  });

  it('throws ConfigError with descriptive message when JSON is invalid', async () => {
    const fs = await import('fs');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('{invalid json'));
    const { loadConfig } = await import('./index');
    expect(() => loadConfig()).toThrow(/Invalid JSON/);
  });

  it('throws ConfigError with descriptive message when schema is invalid', async () => {
    const fs = await import('fs');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      Buffer.from(JSON.stringify({ agents: { defaults: { temperature: 999 } } }))
    );
    const { loadConfig } = await import('./index');
    expect(() => loadConfig()).toThrow(/Invalid configuration schema/);
  });
});

describe('getConfigOrDefault', () => {
  it('returns default config when no config file exists', async () => {
    const fs = await import('fs');
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const { getConfigOrDefault } = await import('./index');
    const config = getConfigOrDefault();
    expect(config).toBeDefined();
    expect(config.agents).toBeDefined();
  });

  it('returns loaded config when file exists and is valid', async () => {
    const validConfig = {
      providers: {},
      agents: { defaults: { model: 'test/model', temperature: 0.5, maxTokens: 2048 } },
      tools: {},
      channels: {},
    };
    const fs = await import('fs');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      Buffer.from(JSON.stringify(validConfig))
    );
    const { getConfigOrDefault } = await import('./index');
    const config = getConfigOrDefault();
    expect(config.agents?.defaults?.maxTokens).toBe(2048);
  });
});

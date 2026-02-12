import { z } from 'zod';

/**
 * Provider configuration schema
 */
export const ProviderConfigSchema = z.object({
  apiKey: z.string().optional(),
  apiBase: z.string().optional(),
  enabled: z.boolean().optional().default(true),
});

/**
 * Providers configuration schema
 */
export const ProvidersConfigSchema = z.object({
  openrouter: ProviderConfigSchema.optional(),
  anthropic: ProviderConfigSchema.optional(),
  openai: ProviderConfigSchema.optional(),
  deepseek: ProviderConfigSchema.optional(),
  groq: ProviderConfigSchema.optional(),
  gemini: ProviderConfigSchema.optional(),
  minimax: ProviderConfigSchema.optional(),
  aihubmix: ProviderConfigSchema.optional(),
  dashscope: ProviderConfigSchema.optional(),
  moonshot: ProviderConfigSchema.optional(),
  zhipu: ProviderConfigSchema.optional(),
  vllm: ProviderConfigSchema.optional(),
});

/**
 * Agent defaults configuration schema
 */
export const AgentDefaultsSchema = z.object({
  model: z.string().default('anthropic/claude-opus-4-5'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().positive().optional().default(4096),
  systemPrompt: z.string().optional(),
});

/**
 * Agents configuration schema
 */
export const AgentsConfigSchema = z.object({
  defaults: AgentDefaultsSchema.optional(),
});

/**
 * Tools configuration schema
 */
export const ToolsConfigSchema = z.object({
  restrictToWorkspace: z.boolean().optional().default(false),
  allowedCommands: z.array(z.string()).optional(),
  deniedCommands: z.array(z.string()).optional(),
});

/**
 * Telegram channel configuration schema
 */
export const TelegramChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  token: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * Discord channel configuration schema
 */
export const DiscordChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  token: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * WhatsApp channel configuration schema
 */
export const WhatsAppChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * Feishu channel configuration schema
 */
export const FeishuChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  appId: z.string().optional(),
  appSecret: z.string().optional(),
  encryptKey: z.string().optional(),
  verificationToken: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * Slack channel configuration schema
 */
export const SlackChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  botToken: z.string().optional(),
  appToken: z.string().optional(),
  groupPolicy: z.enum(['mention', 'open', 'allowlist']).optional().default('mention'),
});

/**
 * Email channel configuration schema
 */
export const EmailChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  consentGranted: z.boolean().optional().default(false),
  imapHost: z.string().optional(),
  imapPort: z.number().optional().default(993),
  imapUsername: z.string().optional(),
  imapPassword: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional().default(587),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromAddress: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * QQ channel configuration schema
 */
export const QQChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  appId: z.string().optional(),
  secret: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * DingTalk channel configuration schema
 */
export const DingTalkChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  allowFrom: z.array(z.string()).optional().default([]),
});

/**
 * Mochat channel configuration schema
 */
export const MochatChannelSchema = z.object({
  enabled: z.boolean().optional().default(false),
  baseUrl: z.string().optional().default('https://mochat.io'),
  socketUrl: z.string().optional().default('https://mochat.io'),
  socketPath: z.string().optional().default('/socket.io'),
  clawToken: z.string().optional(),
  agentUserId: z.string().optional(),
  sessions: z.array(z.string()).optional().default(['*']),
  panels: z.array(z.string()).optional().default(['*']),
  replyDelayMode: z.string().optional().default('non-mention'),
  replyDelayMs: z.number().optional().default(120000),
});

/**
 * Channels configuration schema
 */
export const ChannelsConfigSchema = z.object({
  telegram: TelegramChannelSchema.optional(),
  discord: DiscordChannelSchema.optional(),
  whatsapp: WhatsAppChannelSchema.optional(),
  feishu: FeishuChannelSchema.optional(),
  slack: SlackChannelSchema.optional(),
  email: EmailChannelSchema.optional(),
  qq: QQChannelSchema.optional(),
  dingtalk: DingTalkChannelSchema.optional(),
  mochat: MochatChannelSchema.optional(),
});

/**
 * Main configuration schema
 */
export const ConfigSchema = z.object({
  providers: ProvidersConfigSchema.optional().default({}),
  agents: AgentsConfigSchema.optional().default({}),
  tools: ToolsConfigSchema.optional().default({}),
  channels: ChannelsConfigSchema.optional().default({}),
});

/**
 * Configuration type inferred from schema
 */
export type Config = z.infer<typeof ConfigSchema>;
export type ProvidersConfig = z.infer<typeof ProvidersConfigSchema>;
export type AgentsConfig = z.infer<typeof AgentsConfigSchema>;
export type ToolsConfig = z.infer<typeof ToolsConfigSchema>;
export type ChannelsConfig = z.infer<typeof ChannelsConfigSchema>;

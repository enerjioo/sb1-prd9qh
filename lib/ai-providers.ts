import { createOpenAIClient } from './openai';
import { createGeminiClient } from './gemini';
import { createClaudeClient } from './anthropic';

export type AIProvider = 'openai' | 'gemini' | 'claude' | 'palm';
export type ImageProvider = 'openai' | 'gemini' | 'leonardo' | 'runway';

export const getAIClient = (provider: AIProvider, apiKey: string) => {
  switch (provider) {
    case 'openai':
      return createOpenAIClient(apiKey);
    case 'gemini':
      return createGeminiClient(apiKey);
    case 'claude':
      return createClaudeClient(apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};

export const supportedProviders = {
  text: [
    { id: 'openai', name: 'OpenAI GPT' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'claude', name: 'Anthropic Claude' },
    { id: 'palm', name: 'Google PaLM' }
  ],
  image: [
    { id: 'openai', name: 'DALL-E' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'leonardo', name: 'Leonardo.AI' },
    { id: 'runway', name: 'Runway' }
  ]
};
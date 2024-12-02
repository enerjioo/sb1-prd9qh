import OpenAI from 'openai';

export const createOpenAIClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.openai.com/v1',
  });
};
import { Leonardo } from 'leonardo-ai';

export const createLeonardoClient = (apiKey: string) => {
  return new Leonardo({
    auth: apiKey,
  });
};